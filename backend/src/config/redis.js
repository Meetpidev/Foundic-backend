const Redis = require("ioredis");
const { REDIS_URL } = require("./env");

const redisConnection = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null, // required by BullMQ
  enableOfflineQueue: false, // Fail fast when redis is disconnected instead of hanging HTTP requests
  retryStrategy(times) {
    // Retry up to 3 times, then back off to 10 seconds
    const delay = Math.min(times * 2000, 10000);
    return delay;
  },
});

redisConnection.on("error", (err) => {
  // Suppress uncaught exception error noise when local Redis is not running
  if (err.code === "ECONNREFUSED") {
    // Silently log or warning
  } else {
    console.warn("⚠️ Redis warning:", err.message);
  }
});

module.exports = redisConnection;