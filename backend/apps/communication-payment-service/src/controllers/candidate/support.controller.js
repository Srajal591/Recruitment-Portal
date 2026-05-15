const { StatusCodes } = require("http-status-codes");
const supportService = require("../../shared/services/support.service");
const { ApiResponse } = require("../../shared/utils/ApiResponse");
const asyncHandler = require("../../shared/utils/asyncHandler");

/**
 * @swagger
 * /api/candidate/support/tickets:
 *   get:
 *     tags: [Candidate - Support]
 *     summary: Get my support tickets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       200: { description: My tickets }
 */
const getMyTickets = asyncHandler(async (req, res) => {
  const result = await supportService.getCandidateTickets(
    req.user.id,
    req.query,
  );
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
 * /api/candidate/support/tickets:
 *   post:
 *     tags: [Candidate - Support]
 *     summary: Create a new support ticket
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, category]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [Technical, Payment, General, Document, Application]
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High, Critical]
 *     responses:
 *       201: { description: Ticket created }
 */
const createTicket = asyncHandler(async (req, res) => {
  const User = require("../../shared/models/User");
  const user = await User.findById(req.user.id).select("email");
  const ticket = await supportService.createTicket(
    req.body,
    req.user.id,
    user?.email,
  );
  res
    .status(StatusCodes.CREATED)
    .json(
      new ApiResponse(StatusCodes.CREATED, "Support ticket created", {
        ticket,
      }),
    );
});

/**
 * @swagger
 * /api/candidate/support/tickets/{id}:
 *   get:
 *     tags: [Candidate - Support]
 *     summary: Get a specific ticket with replies
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
const getTicket = asyncHandler(async (req, res) => {
  const ticket = await supportService.getTicketById(req.params.id);
  // Ensure candidate can only see their own ticket
  if (ticket.raisedBy._id.toString() !== req.user.id) {
    const ApiError = require("../../shared/utils/ApiError");
    throw new ApiError(403, "Access denied");
  }
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, "Ticket fetched", { ticket }));
});

/**
 * @swagger
 * /api/candidate/support/tickets/{id}/reply:
 *   post:
 *     tags: [Candidate - Support]
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
  const User = require("../../shared/models/User");
  const user = await User.findById(req.user.id).select("fullName");
  const ticket = await supportService.addReply(
    req.params.id,
    req.body.message,
    req.user.id,
    "User",
    user?.fullName || "Candidate",
  );
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, "Reply added", { ticket }));
});

module.exports = { getMyTickets, createTicket, getTicket, addReply };


