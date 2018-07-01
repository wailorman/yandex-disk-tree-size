const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis);

const redisClient = redis.createClient('redis://192.168.99.100:6379');

redisClient.on('ready', () => console.log('ready'));

module.exports = {
  async get(key, maxAge, { rolling }) {
    try {
      return JSON.parse(await redisClient.getAsync(key)) || {}; 
    } catch (error) {
      console.error('Getting session JSON error:', error);
      return {};
    }
  },
  async set(key, data, maxAge, { rolling, changed }) {
    try {
      const strData = JSON.stringify(data);
      return await redisClient.setAsync(key, strData, 'PX', maxAge); 
    } catch (error) {
      console.error('Setting session JSON error:', error);
      return {};
    }
  },
  async destroy(key) {
    try {
      return redisClient.delAsync(key); 
    } catch (error) {
      console.error('Destroying session data error:', error);
      return {};
    }
  }
};
