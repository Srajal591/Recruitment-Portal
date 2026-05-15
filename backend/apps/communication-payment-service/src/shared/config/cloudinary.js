const cloudinary = require("cloudinary").v2;
const env = require("./env");
const logger = require("../utils/logger");

const connectCloudinary = () => {
  try {
    if (
      !env.CLOUDINARY_CLOUD_NAME ||
      !env.CLOUDINARY_API_KEY ||
      !env.CLOUDINARY_API_SECRET
    ) {
      logger.warn(
        "⚠️  Cloudinary credentials not configured. File uploads will fail.",
      );
      return;
    }

    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    logger.info(`☁️  Cloudinary configured: ${env.CLOUDINARY_CLOUD_NAME}`);
  } catch (error) {
    logger.error(`❌ Cloudinary configuration failed: ${error.message}`);
  }
};

module.exports = { cloudinary, connectCloudinary };
