import times from 'lodash/times';
import Promise from 'bluebird';

import { pullResourceInfo } from './methods';
import { db } from './db';

export class ResourcesPuller {
  constructor(conf) {
    const { onSuccess, throttle = 10000 } = conf;
    const self = this;

    self.onSuccess = onSuccess;
    self.throttle = throttle;

    self.queue = [];
    self.started = false;
    self.resources = [];

    setInterval(async () => {
      const dbCount = await db.resources.count();
      const queueSize = self.queue.length;

      // eslint-disable-next-line no-console
      console.log('dbCount', dbCount, 'queueSize', queueSize);
    }, 1000);

    // setInterval(() => {
    //   // if (self.resources.length === 0) return;
    //   // self.onSuccess([...self.resources]);
    //   // self.resources = [];
    //   // const lengthBefore = self.resources.length;
    //   const toSend = self.resources.splice(0, 100);
    //   self.onSuccess(toSend);
    //   const lengthAfter = self.resources.length;
    //   console.log('Shiped:', toSend.length, 'Remaining:', lengthAfter);
    // }, self.throttle);
  }

  static async saveResources(resources) {
    await db.resources.bulkAdd(resources);
  }

  async start() {
    const self = this;
    self.queue = [
      {
        id: 'disk',
        path: '/',
      },
    ];

    self.started = true;
    await db.resources.clear();
    self.worker();
  }

  stop() {
    const self = this;
    self.started = false;
  }

  worker() {
    const self = this;
    // debugger;
    // setTimeout(() => {
    if (!self.started) return;

    const threads = times(6, true);

    const proceedTask = () =>
      Promise.resolve()
        .then(async () => {
          const task = self.queue.shift();

          if (!task) return;

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

          await ResourcesPuller.saveResources(resources);

          // debugger;

          resources.filter(({ type }) => type === 'dir').forEach((resource) => {
            self.queue.push({ id: resource.id, path: resource.path });
          });
        })
        .delay(100)
        .then(() => proceedTask())
        .catch(() => proceedTask());

    Promise.all(threads.map(proceedTask));
    // }, 0);
  }

  // async processResources(resources) {

  // }
}

export default ResourcesPuller;
