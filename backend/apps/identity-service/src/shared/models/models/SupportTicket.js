const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "replies.sentByModel",
    },
    sentByModel: { type: String, enum: ["User", "Employee"] },
    sentByName: { type: String },
    attachments: [String],
  },
  { timestamps: true },
);

const supportTicketSchema = new mongoose.Schema(
  {
    ticketId: { type: String, unique: true, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["Technical", "Payment", "General", "Document", "Application"],
      required: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },

    // Raised by candidate
    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    raisedByEmail: { type: String },

    // Assigned to employee
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },

    replies: [replySchema],
    attachments: [String],

    resolvedAt: { type: Date },
    closedAt: { type: Date },
  },
  { timestamps: true },
);

supportTicketSchema.index({ raisedBy: 1 });
supportTicketSchema.index({ status: 1 });
supportTicketSchema.index({ priority: 1 });
supportTicketSchema.index({ assignedTo: 1 });

module.exports = mongoose.model("SupportTicket", supportTicketSchema);
