const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const env = require("../config/env");

/**
 * Generate a unique application ID like BR-2024-XXXXX
 */
const generateApplicationId = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  return `BR-${year}-${random}`;
};

/**
 * Generate a unique employee ID like EMP-2024-XXXX
 */
const generateEmployeeId = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `EMP-${year}-${random}`;
};

/**
 * Generate a 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generate a UUID
 */
const generateUUID = () => uuidv4();

/**
 * Encrypt sensitive data (e.g. payment gateway API keys)
 */
const encrypt = (text) => {
  const key = Buffer.from(
    env.ENCRYPTION_KEY || "fallback_key_32_chars_padded____",
    "utf8",
  ).slice(0, 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
};

/**
 * Decrypt sensitive data
 */
const decrypt = (encryptedText) => {
  const key = Buffer.from(
    env.ENCRYPTION_KEY || "fallback_key_32_chars_padded____",
    "utf8",
  ).slice(0, 32);
  const [ivHex, encrypted] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

/**
 * Calculate application fee based on candidate category
 */
const calculateFee = (feeConfig, category) => {
  const cat = category?.toLowerCase();
  if (cat === "sc" || cat === "st") return feeConfig.scSt || 0;
  if (cat === "pwd") return feeConfig.pwd || 0;
  return feeConfig.general || 0;
};

/**
 * Sanitize pagination params from query string
 */
const getPaginationParams = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

module.exports = {
  generateApplicationId,
  generateEmployeeId,
  generateOTP,
  generateUUID,
  encrypt,
  decrypt,
  calculateFee,
  getPaginationParams,
};
