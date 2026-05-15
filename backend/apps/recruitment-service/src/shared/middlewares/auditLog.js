const asyncHandler = require("../utils/asyncHandler");

/**
 * Audit log middleware factory.
 * Automatically logs admin/employee actions to the ActivityLog collection.
 *
 * Usage: auditLog('Jobs', 'CREATE')
 */
const auditLog = (module, action) => {
  return asyncHandler(async (req, res, next) => {
    // Store audit info on req so the controller can enrich it if needed
    req.auditInfo = {
      module,
      action,
      employeeId: req.user?.id,
      ipAddress: req.ip || req.connection?.remoteAddress,
      userAgent: req.headers["user-agent"],
    };
    next();
  });
};

/**
 * Call this inside a controller after a successful operation
 * to persist the audit log entry.
 */
const saveAuditLog = async (req, details = "") => {
  try {
    if (!req.auditInfo) return;

    const ActivityLog = require("../models/ActivityLog");
    await ActivityLog.create({
      ...req.auditInfo,
      details,
    });
  } catch (err) {
    // Audit log failure should never break the main operation
    const logger = require("../utils/logger");
    logger.error(`Audit log save failed: ${err.message}`);
  }
};

module.exports = { auditLog, saveAuditLog };
