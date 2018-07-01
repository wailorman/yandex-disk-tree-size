const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis);

const redisClient = redis.createClient('redis://192.168.99.100:6379');

redisClient.on('ready', () => {
  // eslint-disable-next-line no-console
  console.log('ready');
});

module.exports = {
  async get(key) {
    try {
      return JSON.parse(await redisClient.getAsync(key)) || {};
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Getting session JSON error:', error);
      return {};
    }
  },
  async set(key, data, maxAge) {
    try {
      const strData = JSON.stringify(data);
      return await redisClient.setAsync(key, strData, 'PX', maxAge);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Setting session JSON error:', error);
      return {};
    }
  },
  async destroy(key) {
    try {
      return redisClient.delAsync(key);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Destroying session data error:', error);
      return {};
    }
  },
};
