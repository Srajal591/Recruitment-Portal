const amqplib = require("amqplib");
const env = require("./env");
const logger = require("../common/utils/logger");

let connection = null;
let channel = null;

// Queue names — single source of truth
const QUEUES = {
  EMAIL: "email_queue",
  SMS: "sms_queue",
  NOTIFICATION: "notification_queue",
  PDF_GENERATION: "pdf_generation_queue",
  ANALYTICS: "analytics_queue",
};

const connectRabbitMQ = async () => {
  try {
    connection = await amqplib.connect(env.RABBITMQ_URL);
    channel = await connection.createChannel();

    // Assert all queues (durable = survives broker restart)
    for (const queue of Object.values(QUEUES)) {
      await channel.assertQueue(queue, { durable: true });
    }

    logger.info("RabbitMQ connected and queues asserted");

    connection.on("error", (err) => {
      logger.error(`RabbitMQ connection error: ${err.message}`);
    });

    connection.on("close", () => {
      logger.warn("RabbitMQ connection closed. Reconnecting in 5s...");
      setTimeout(connectRabbitMQ, 5000);
    });
  } catch (error) {
    logger.error(`RabbitMQ connection failed: ${error.message}`);
    logger.warn("Continuing without RabbitMQ — queue features disabled");
  }
};

const getChannel = () => channel;

const publishToQueue = async (queueName, payload) => {
  try {
    if (!channel) {
      logger.warn(
        `RabbitMQ channel not available. Skipping publish to ${queueName}`,
      );
      return false;
    }
    const message = Buffer.from(JSON.stringify(payload));
    channel.sendToQueue(queueName, message, { persistent: true });
    return true;
  } catch (error) {
    logger.error(`Failed to publish to queue ${queueName}: ${error.message}`);
    return false;
  }
};

module.exports = { connectRabbitMQ, getChannel, publishToQueue, QUEUES };
