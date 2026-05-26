/**
 * notifyAdmins — creates a Notification record for every active Employee
 * and pushes a real-time socket event to all admins.
 * Errors are swallowed so they never break the main request flow.
 */
const Notification = require("../models/Notification");
const Employee     = require("../models/Employee");
const { emitToAdmins, SOCKET_EVENTS } = require("../socket/index");

const notifyAdmins = async ({ type, title, message, link, metadata }) => {
  try {
    const admins = await Employee.find({ status: "Active" }).select("_id").lean();
    if (!admins.length) return;

    const docs = admins.map(a => ({
      recipientId:    a._id,
      recipientModel: "Employee",
      type,
      title,
      message,
      link:     link || null,
      metadata: metadata || undefined,
      isRead:   false,
    }));

    await Notification.insertMany(docs, { ordered: false });

    try {
      emitToAdmins(SOCKET_EVENTS.NEW_NOTIFICATION, {
        type, title, message, link, isRead: false, createdAt: new Date(),
      });
    } catch (_) {}
  } catch (err) {
    console.error("[notifyAdmins] Failed:", err.message);
  }
};

module.exports = { notifyAdmins };
