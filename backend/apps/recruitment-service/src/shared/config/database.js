const mongoose = require("mongoose");
const env = require("./env");
const logger = require("../utils/logger");

const RETRY_DELAY_MS = 10000;
let listenersRegistered = false;
let retryTimer = null;

const connectDB = async () => {
  try {
    if (retryTimer) {
      clearTimeout(retryTimer);
      retryTimer = null;
    }

    const conn = await mongoose.connect(env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info(`MongoDB connected: ${conn.connection.host}`);

    if (!listenersRegistered) {
      mongoose.connection.on("disconnected", () => {
        logger.warn("MongoDB disconnected. Attempting to reconnect...");
      });

      mongoose.connection.on("reconnected", () => {
        logger.info("MongoDB reconnected");
      });

      mongoose.connection.on("error", (err) => {
        logger.error(`MongoDB connection error: ${err.message}`);
      });

      listenersRegistered = true;
    }

    return conn;
  } catch (error) {
    logger.error(`MongoDB connection failed: ${error.message}`);
    retryTimer = setTimeout(connectDB, RETRY_DELAY_MS);
    retryTimer.unref?.();
    return null;
  }
};

module.exports = connectDB;
