import times from 'lodash/times';
import uniq from 'lodash/uniq';
import Promise from 'bluebird';

import { pullResourceInfo } from './methods';
import { db } from './db';
import * as ResourcesProcessors from './resources-processors';

const pcompose = (...functions) => initialValue =>
  functions.reduceRight((sum, fn) => Promise.resolve(sum).then(fn), initialValue);

export const processResources = (resourcePayload, ctx) =>
  pcompose(
    ResourcesProcessors.setSizes(ctx),
    ResourcesProcessors.setAllParentResourcesIds(ctx),
    // ResourcesProcessors.setChildResourcesIds(ctx),
    ResourcesProcessors.saveResources(ctx),
    //
  )(resourcePayload);

// eslint-disable-next-line no-unused-vars
export const worker = async (args = {}, ctx = {}) => {
  if (!ctx.started) return;

  const threads = 10;

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

        const resourcePayload = {
          resources,
          parentResourceId: id,
        };

        await processResources(resourcePayload, ctx);

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
  const resourcePayload = {
    resources: ctx.rootResources,
    // parentResourceId: id,
  };
  await processResources(resourcePayload, ctx);
  worker({}, ctx);
};

// eslint-disable-next-line no-unused-vars
export const stop = async (args = {}, ctx = {}) => {
  ctx.started = false;
};

export const subscribeTo = (args = {}, ctx = {}) => {
  ctx.interestingResourcesIds = args.resourcesIds;
};

export const configure = async (conf = {}) => {
  const { onChange, throttle = 1000 } = conf;
  const ctx = {};

  ctx.onChange = onChange;
  ctx.throttle = throttle;

  ctx.queue = [];
  ctx.initialTasks = conf.tasks || [{ id: 'root', path: '/' }];
  ctx.rootResources = conf.rootResources || [{ id: 'root', path: '/' }];
  ctx.started = false;
  ctx.resources = [];
  ctx.interestingResourcesIds = [];

  ctx.db = db;

  ctx.changedResources = [];
  ctx.db.resources.hook('updating', (__, resourceId) => {
    ctx.changedResources.push(resourceId);
  });

  setInterval(() => {
    if (ctx.changedResources.length > 0) {
      const interesting = uniq(ctx.changedResources).filter(
        resourceId => ctx.interestingResourcesIds.indexOf(resourceId) > -1,
      );
      if (interesting.length > 0) {
        ctx.onChange(interesting);
      }
      ctx.changedResources = [];
    }
  }, ctx.throttle);

  let prevDbCount = 0;

  setInterval(async () => {
    const dbCount = await db.resources.count();
    const queueSize = ctx.queue.length;

    const speed = dbCount - prevDbCount;
    prevDbCount = dbCount;

    // eslint-disable-next-line no-console
    console.log('dbCount', dbCount, 'queueSize', queueSize, 'speed', speed);
  }, 1000);

  return {
    start: () => start({}, ctx),
    stop: () => stop({}, ctx),
    subscribeTo: resourcesIds => subscribeTo({ resourcesIds }, ctx),
  };
};
