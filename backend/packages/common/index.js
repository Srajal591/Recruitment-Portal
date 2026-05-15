/**
 * @package common
 * Shared code used by all microservices.
 * Each service imports from here instead of cross-referencing other services.
 */

// ── Models ────────────────────────────────────────────────────
const models = require("./models");

// ── Middlewares ───────────────────────────────────────────────
const authenticate = require("./middlewares/authenticate");
const { authorize, checkPermission } = require("./middlewares/authorize");
const { auditLog, saveAuditLog } = require("./middlewares/auditLog");
const errorHandler = require("./middlewares/errorHandler");
const notFound = require("./middlewares/notFound");
const {
  apiLimiter,
  authLimiter,
  otpLimiter,
} = require("./middlewares/rateLimiter");
const validate = require("./middlewares/validate");

// ── Utils ─────────────────────────────────────────────────────
const ApiError = require("./utils/ApiError");
const { ApiResponse, paginationMeta } = require("./utils/ApiResponse");
const asyncHandler = require("./utils/asyncHandler");
const helpers = require("./utils/helpers");
const logger = require("./utils/logger");

// ── Socket ────────────────────────────────────────────────────
const socket = require("./socket/index");

module.exports = {
  // Models
  models,
  ...models,

  // Middlewares
  authenticate,
  authorize,
  checkPermission,
  auditLog,
  saveAuditLog,
  errorHandler,
  notFound,
  apiLimiter,
  authLimiter,
  otpLimiter,
  validate,

  // Utils
  ApiError,
  ApiResponse,
  paginationMeta,
  asyncHandler,
  helpers,
  logger,

  // Socket
  socket,
  ...socket,
};
