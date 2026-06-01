const { StatusCodes } = require("http-status-codes");
const supportService = require("../../shared/services/support.service");
const { ApiResponse } = require("../../shared/utils/ApiResponse");
const asyncHandler = require("../../shared/utils/asyncHandler");
const ApiError = require("../../shared/utils/ApiError");
const { uploadToCloudinary } = require("../../shared/services/upload.service");

// Import at top level so mongoose registers these models before any populate calls
const User = require("../../shared/models/User");

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

const createTicket = asyncHandler(async (req, res) => {
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

const getTicket = asyncHandler(async (req, res) => {
  const ticket = await supportService.getTicketById(req.params.id);
  if (ticket.raisedBy._id.toString() !== req.user.id) {
    throw new ApiError(403, "Access denied");
  }
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, "Ticket fetched", { ticket }));
});

const addReply = asyncHandler(async (req, res) => {
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

const closeTicket = asyncHandler(async (req, res) => {
  const ticket = await supportService.getTicketById(req.params.id);
  if (ticket.raisedBy._id.toString() !== req.user.id) {
    throw new ApiError(403, "Access denied");
  }
  if (ticket.status === "Closed") {
    return res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse(StatusCodes.OK, "Ticket already closed", { ticket }),
      );
  }
  const updated = await supportService.updateTicket(
    req.params.id,
    { status: "Closed", closedAt: new Date() },
    req.user.id,
  );
  res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(StatusCodes.OK, "Ticket closed", { ticket: updated }),
    );
});

const uploadAttachment = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "No file uploaded");
  }

  const result = await uploadToCloudinary(req.file.buffer, {
    folder: `recruitment_portal/support/${req.user.id}`,
    public_id: `support_${Date.now()}`,
  });

  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, "Attachment uploaded", {
      url: result.secure_url,
      publicId: result.public_id,
      originalName: req.file.originalname,
      sizeKB: Math.round(req.file.size / 1024),
    }),
  );
});

const completeAction = asyncHandler(async (req, res) => {
  const ticket = await supportService.completeCandidateAction(
    req.params.id,
    req.user.id,
  );
  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, "Support action completed", { ticket }),
  );
});

module.exports = {
  getMyTickets,
  createTicket,
  getTicket,
  addReply,
  closeTicket,
  uploadAttachment,
  completeAction,
};
