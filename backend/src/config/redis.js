const Redis = require("ioredis");
const { REDIS_URL } = require("./env");

const redisConnection = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null, // required by BullMQ
});

module.exports = redisConnection;