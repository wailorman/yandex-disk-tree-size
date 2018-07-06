import times from 'lodash/times';
import Promise from 'bluebird';

import { pullResourceInfo } from './methods';
import { db } from './db';
import * as ResourcesProcessors from './resources-processors';

const pcompose = (...functions) => initialValue =>
  functions.reduceRight((sum, fn) => Promise.resolve(sum).then(fn), initialValue);

export const processResources = (resources, ctx) =>
  pcompose(
    ResourcesProcessors.setChildResourcesIds(ctx),
    ResourcesProcessors.saveResources(ctx),
    //
  )(resources);

// eslint-disable-next-line no-unused-vars
export const worker = async (args = {}, ctx = {}) => {
  if (!ctx.started) return;

  const threads = 6;

  const proceedTask = () =>
    Promise.resolve()
      .then(async () => {
        const task = ctx.queue.shift();

        if (!task) return;
        if (!ctx.started) return;

        const { id, path } = task;

        const res = await pullResourceInfo({ path });

        // eslint-disable-next-line no-underscore-dangle
        const resources = res._embedded.items.map(resource => ({
          id: resource.resource_id,
          name: resource.name,
          type: resource.type,
          path: resource.path,
          size: resource.size || 0,
          parentResourceId: id,
        }));

        await processResources(resources, ctx);

        resources.filter(({ type }) => type === 'dir').forEach((resource) => {
          ctx.queue.push({ id: resource.id, path: resource.path });
        });
      })
      .delay(100)
      .then(() => proceedTask())
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err);
        proceedTask();
      });

  Promise.all(times(threads, true).map(proceedTask));
};

// eslint-disable-next-line no-unused-vars
export const start = async (args = {}, ctx = {}) => {
  ctx.queue = [...ctx.initialTasks];

  ctx.started = true;
  await ctx.db.resources.clear();
  await processResources(ctx.rootResources, ctx);
  worker({}, ctx);
};

// eslint-disable-next-line no-unused-vars
export const stop = async (args = {}, ctx = {}) => {
  ctx.started = false;
};

export const configure = async (conf = {}) => {
  const { onSuccess, throttle = 10000 } = conf;
  const ctx = {};

  ctx.onSuccess = onSuccess;
  ctx.throttle = throttle;

  ctx.queue = [];
  ctx.initialTasks = conf.tasks || [{ id: 'root', path: '/' }];
  ctx.rootResources = conf.rootResources || [{ id: 'root', path: '/' }];
  ctx.started = false;
  ctx.resources = [];

  ctx.db = db;

  setInterval(async () => {
    const dbCount = await db.resources.count();
    const queueSize = ctx.queue.length;

    // eslint-disable-next-line no-console
    console.log('dbCount', dbCount, 'queueSize', queueSize);
  }, 1000);

  return {
    start: () => start({}, ctx),
    stop: () => stop({}, ctx),
  };
};
