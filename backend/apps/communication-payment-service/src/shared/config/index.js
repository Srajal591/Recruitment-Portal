/**
 * @package config
 * Shared configuration used by all microservices.
 */

const env = require("./env");
const connectDB = require("./database");
const { connectRedis, getRedis } = require("./redis");
const {
  connectRabbitMQ,
  getChannel,
  publishToQueue,
  QUEUES,
} = require("./rabbitmq");
const { cloudinary, connectCloudinary } = require("./cloudinary");

module.exports = {
  env,
  connectDB,
  connectRedis,
  getRedis,
  connectRabbitMQ,
  getChannel,
  publishToQueue,
  QUEUES,
  cloudinary,
  connectCloudinary,
};
