const SupportTicket = require("../models/SupportTicket");
// Must be imported so mongoose has User and Employee registered before populate runs
const User = require("../models/User");
const Employee = require("../models/Employee");
const ApiError = require("../utils/ApiError");
const { getPaginationParams } = require("../utils/helpers");
const { paginationMeta } = require("../utils/ApiResponse");
const {
  emitToAdmins,
  emitToCandidate,
  emitToUser,
  SOCKET_EVENTS,
} = require("../socket/index");
const {
  sendTicketReplyEmail,
  sendTicketResolvedEmail,
} = require("./email.service");
const { notify } = require("../utils/notify");

let ticketCounter = 1000;
const generateTicketId = () => `TKT-${Date.now()}-${++ticketCounter}`;

const createTicket = async (data, candidateId, email) => {
  const ticket = await SupportTicket.create({
    ...data,
    ticketId: generateTicketId(),
    raisedBy: candidateId,
    raisedByEmail: email,
  });

  // Notify all admins in real-time
  emitToAdmins(SOCKET_EVENTS.TICKET_CREATED, {
    ticketId: ticket.ticketId,
    title: ticket.title,
    priority: ticket.priority,
    category: ticket.category,
  });

  return ticket;
};

const getAdminTickets = async (query) => {
  const { page, limit, skip } = getPaginationParams(query);
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.priority) filter.priority = query.priority;
  if (query.category) filter.category = query.category;
  if (query.assignedTo) filter.assignedTo = query.assignedTo;

  const [tickets, total] = await Promise.all([
    SupportTicket.find(filter)
      .populate("raisedBy", "fullName email")
      .populate("assignedTo", "fullName employeeId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    SupportTicket.countDocuments(filter),
  ]);

  return { tickets, meta: paginationMeta(total, page, limit) };
};

const getTicketById = async (id) => {
  const ticket = await SupportTicket.findById(id)
    .populate("raisedBy", "fullName email registeredMobile")
    .populate("assignedTo", "fullName employeeId")
    .populate("replies.sentBy", "fullName");
  if (!ticket) throw new ApiError(404, "Ticket not found");
  return ticket;
};

const updateTicket = async (id, data, updatedBy) => {
  const ticket = await SupportTicket.findByIdAndUpdate(id, data, { new: true });
  if (!ticket) throw new ApiError(404, "Ticket not found");

  if (data.status === "Resolved") {
    ticket.resolvedAt = new Date();
    await ticket.save();

    // Notify candidate via socket
    emitToCandidate(ticket.raisedBy.toString(), SOCKET_EVENTS.TICKET_RESOLVED, {
      ticketId: ticket.ticketId,
      message: "Your support ticket has been resolved.",
    });

    // Persist notification in DB
    await notify({
      recipientId: ticket.raisedBy,
      type: "ticket_resolved",
      title: "Support Ticket Resolved",
      message: `Your support ticket ${ticket.ticketId} has been resolved. Please close it if your issue is fixed.`,
      link: `/candidate/support/${id}`,
      metadata: { ticketId: ticket.ticketId },
    });

    // Send email notification
    await sendTicketResolvedEmail(ticket.raisedByEmail, ticket.ticketId);
  }

  return ticket;
};

const addReply = async (ticketId, message, sentBy, sentByModel, sentByName) => {
  const ticket = await SupportTicket.findById(ticketId);
  if (!ticket) throw new ApiError(404, "Ticket not found");

  ticket.replies.push({ message, sentBy, sentByModel, sentByName });
  if (ticket.status === "Open") ticket.status = "In Progress";
  await ticket.save();

  // Notify the other party
  if (sentByModel === "Employee") {
    // Admin replied — notify candidate via socket
    emitToCandidate(ticket.raisedBy.toString(), SOCKET_EVENTS.TICKET_REPLY, {
      ticketId: ticket.ticketId,
      message,
      from: sentByName,
    });

    // Persist notification in DB for candidate
    await notify({
      recipientId: ticket.raisedBy,
      type: "ticket_reply",
      title: "Support Team Replied",
      message: `${sentByName || "Support Team"} replied to your ticket ${ticket.ticketId}: "${message.substring(0, 80)}${message.length > 80 ? "..." : ""}"`,
      link: `/candidate/support/${ticketId}`,
      metadata: { ticketId: ticket.ticketId },
    });

    // Send email notification
    await sendTicketReplyEmail(ticket.raisedByEmail, ticket.ticketId, message);
  } else {
    // Candidate replied — notify assigned admin via socket
    emitToAdmins(SOCKET_EVENTS.TICKET_REPLY, {
      ticketId: ticket.ticketId,
      message,
      from: sentByName,
    });
  }

  return ticket;
};

const getCandidateTickets = async (candidateId, query) => {
  const { page, limit, skip } = getPaginationParams(query);
  const filter = { raisedBy: candidateId };
  if (query.status) filter.status = query.status;

  const [tickets, total] = await Promise.all([
    SupportTicket.find(filter)
      .select("-replies")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    SupportTicket.countDocuments(filter),
  ]);

  return { tickets, meta: paginationMeta(total, page, limit) };
};

module.exports = {
  createTicket,
  getAdminTickets,
  getTicketById,
  updateTicket,
  addReply,
  getCandidateTickets,
};
