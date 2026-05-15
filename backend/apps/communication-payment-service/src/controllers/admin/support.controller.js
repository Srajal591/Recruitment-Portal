const { StatusCodes } = require("http-status-codes");
const supportService = require("../../../../../src/services/support.service");
const { ApiResponse } = require("../../../../../packages/common/utils/ApiResponse");
const asyncHandler = require("../../../../../packages/common/utils/asyncHandler");
const { saveAuditLog } = require("../../../../../packages/common/middlewares/auditLog");

/**
 * @swagger
 * /api/admin/support/tickets:
 *   get:
 *     tags: [Admin - Support]
 *     summary: Get all support tickets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Open, In Progress, Resolved, Closed]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [Low, Medium, High, Critical]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200: { description: List of tickets }
 */
const getTickets = asyncHandler(async (req, res) => {
  const result = await supportService.getAdminTickets(req.query);
  res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        "Tickets fetched",
        result.tickets,
        result.meta,
      ),
    );
});

/**
 * @swagger
 * /api/admin/support/tickets/{id}:
 *   get:
 *     tags: [Admin - Support]
 *     summary: Get ticket by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200: { description: Ticket details }
 *       404: { description: Ticket not found }
 */
const getTicketById = asyncHandler(async (req, res) => {
  const ticket = await supportService.getTicketById(req.params.id);
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, "Ticket fetched", { ticket }));
});

/**
 * @swagger
 * /api/admin/support/tickets/{id}:
 *   put:
 *     tags: [Admin - Support]
 *     summary: Update ticket (status, priority, assignee)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Open, In Progress, Resolved, Closed]
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High, Critical]
 *               assignedTo:
 *                 type: string
 *     responses:
 *       200: { description: Ticket updated }
 */
const updateTicket = asyncHandler(async (req, res) => {
  const ticket = await supportService.updateTicket(
    req.params.id,
    req.body,
    req.user.id,
  );
  await saveAuditLog(
    req,
    `Updated ticket ${ticket.ticketId} — status: ${ticket.status}`,
  );
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, "Ticket updated", { ticket }));
});

/**
 * @swagger
 * /api/admin/support/tickets/{id}/reply:
 *   post:
 *     tags: [Admin - Support]
 *     summary: Reply to a support ticket
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [message]
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200: { description: Reply added }
 */
const addReply = asyncHandler(async (req, res) => {
  const Employee = require("../../../../../packages/common/models/Employee");
  const employee = await Employee.findById(req.user.id).select("fullName");
  const ticket = await supportService.addReply(
    req.params.id,
    req.body.message,
    req.user.id,
    "Employee",
    employee?.fullName || "Admin",
  );
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, "Reply added", { ticket }));
});

/**
 * @swagger
 * /api/admin/support/stats:
 *   get:
 *     tags: [Admin - Support]
 *     summary: Get support ticket statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Support stats }
 */
const getStats = asyncHandler(async (req, res) => {
  const SupportTicket = require("../../../../../packages/common/models/SupportTicket");

  const [statusStats, priorityStats, categoryStats, recentTickets] =
    await Promise.all([
      SupportTicket.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      SupportTicket.aggregate([
        { $group: { _id: "$priority", count: { $sum: 1 } } },
      ]),
      SupportTicket.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
      ]),
      SupportTicket.find()
        .populate("raisedBy", "fullName email")
        .sort({ createdAt: -1 })
        .limit(5)
        .select("ticketId title priority status createdAt"),
    ]);

  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, "Support stats fetched", {
      statusStats,
      priorityStats,
      categoryStats,
      recentTickets,
    }),
  );
});

module.exports = {
  getTickets,
  getTicketById,
  updateTicket,
  addReply,
  getStats,
};


