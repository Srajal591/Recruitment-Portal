const { StatusCodes } = require("http-status-codes");
const ActivityLog = require("../../../../packages/common/models/ActivityLog");
const { ApiResponse, paginationMeta } = require("../../../../packages/common/utils/ApiResponse");
const asyncHandler = require("../../../../packages/common/utils/asyncHandler");
const { getPaginationParams } = require("../../../../packages/common/utils/helpers");

/**
 * @swagger
 * /api/admin/activity-logs:
 *   get:
 *     tags: [Admin - Activity Logs]
 *     summary: Get all activity logs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: string
 *       - in: query
 *         name: module
 *         schema:
 *           type: string
 *           enum: [Jobs, Applications, Projects, Employees, Roles, Support, Payments, Settings, Analytics]
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *           enum: [CREATE, UPDATE, DELETE, VIEW, DOWNLOAD, LOGIN, LOGOUT, PUBLISH, APPROVE, REJECT]
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200: { description: Activity logs }
 */
const getActivityLogs = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const { employeeId, module, action, startDate, endDate } = req.query;

  const filter = {};
  if (employeeId) filter.employeeId = employeeId;
  if (module) filter.module = module;
  if (action) filter.action = action;
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate)
      filter.createdAt.$lte = new Date(new Date(endDate).setHours(23, 59, 59));
  }

  const [logs, total] = await Promise.all([
    ActivityLog.find(filter)
      .populate("employeeId", "fullName employeeId department")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    ActivityLog.countDocuments(filter),
  ]);

  res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        "Activity logs fetched",
        logs,
        paginationMeta(total, page, limit),
      ),
    );
});

/**
 * @swagger
 * /api/admin/activity-logs/export:
 *   get:
 *     tags: [Admin - Activity Logs]
 *     summary: Export activity logs as CSV
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV file
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 */
const exportActivityLogs = asyncHandler(async (req, res) => {
  const { employeeId, module, action, startDate, endDate } = req.query;

  const filter = {};
  if (employeeId) filter.employeeId = employeeId;
  if (module) filter.module = module;
  if (action) filter.action = action;
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate)
      filter.createdAt.$lte = new Date(new Date(endDate).setHours(23, 59, 59));
  }

  const logs = await ActivityLog.find(filter)
    .populate("employeeId", "fullName employeeId department")
    .sort({ createdAt: -1 })
    .limit(5000);

  // Build CSV
  const headers = [
    "Timestamp",
    "Employee",
    "Employee ID",
    "Department",
    "Action",
    "Module",
    "Details",
    "IP Address",
  ];
  const rows = logs.map((log) => [
    new Date(log.createdAt).toISOString(),
    log.employeeId?.fullName || "N/A",
    log.employeeId?.employeeId || "N/A",
    log.employeeId?.department || "N/A",
    log.action,
    log.module,
    `"${(log.details || "").replace(/"/g, '""')}"`,
    log.ipAddress || "N/A",
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="activity-logs-${Date.now()}.csv"`,
  );
  res.send(csv);
});

/**
 * @swagger
 * /api/admin/activity-logs/employee/{employeeId}:
 *   get:
 *     tags: [Admin - Activity Logs]
 *     summary: Get activity logs for a specific employee
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200: { description: Employee activity logs }
 */
const getEmployeeActivityLogs = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req.query);

  const [logs, total] = await Promise.all([
    ActivityLog.find({ employeeId: req.params.employeeId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    ActivityLog.countDocuments({ employeeId: req.params.employeeId }),
  ]);

  // Summary stats
  const stats = await ActivityLog.aggregate([
    {
      $match: {
        employeeId: require("mongoose").Types.ObjectId.createFromHexString(
          req.params.employeeId,
        ),
      },
    },
    { $group: { _id: "$action", count: { $sum: 1 } } },
  ]);

  res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        "Employee activity logs fetched",
        { logs, stats },
        paginationMeta(total, page, limit),
      ),
    );
});

module.exports = {
  getActivityLogs,
  exportActivityLogs,
  getEmployeeActivityLogs,
};


