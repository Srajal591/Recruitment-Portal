const cloudinary = require("cloudinary").v2;
const env = require("./env");
const logger = require("../common/utils/logger");

const connectCloudinary = () => {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  logger.info("Cloudinary configured");
};

module.exports = { cloudinary, connectCloudinary };
