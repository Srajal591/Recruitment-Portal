const Redis = require("ioredis");
const env = require("./env");
const logger = require("../common/utils/logger");

let redisClient = null;

const connectRedis = () => {
  redisClient = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    lazyConnect: true,
  });

  redisClient.on("connect", () => {
    logger.info("Redis connected");
  });

  redisClient.on("error", (err) => {
    logger.error(`Redis error: ${err.message}`);
  });

  redisClient.on("close", () => {
    logger.warn("Redis connection closed");
  });

  return redisClient;
};

const getRedis = () => {
  if (!redisClient) {
    throw new Error("Redis not initialized. Call connectRedis() first.");
  }
  return redisClient;
};

module.exports = { connectRedis, getRedis };
