const redisUtil = require("../src/utils/redis.util");
module.exports = class {
  static async remember(key, expire, callback) {
    const client = await redisUtil;
    const cached = await client.get(key);
    if (!cached) {
      const data = await callback();
      await client.set(key, JSON.stringify(data), "EX", expire);
      return data;
    }
    return JSON.parse(cached);
  }
  static async rememberForever(key, callback) {
    const client = await redisUtil;
    const cached = await client.get(key);
    if (!cached) {
      const data = await callback();
      await client.set(key, JSON.stringify(data));
      return data;
    }
    return JSON.parse(cached);
  }
};
