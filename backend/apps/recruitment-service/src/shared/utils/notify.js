/**
 * Notification helper for the recruitment service.
 * Writes directly to the shared MongoDB Notification collection
 * and emits a real-time socket event to the recipient.
 */
const Notification = require("../models/Notification");
const { emitToCandidate, SOCKET_EVENTS } = require("../socket/index");

/**
 * Create a notification and push it via WebSocket.
 * All errors are swallowed so they never break the main request flow.
 */
const notify = async ({
  recipientId,
  type,
  title,
  message,
  link,
  metadata,
}) => {
  try {
    const notification = await Notification.create({
      recipientId,
      recipientModel: "User", // candidates are Users
      type,
      title,
      message,
      link: link || null,
      metadata: metadata || undefined,
    });

    // Real-time push
    try {
      emitToCandidate(recipientId.toString(), SOCKET_EVENTS.NEW_NOTIFICATION, {
        _id: notification._id,
        type,
        title,
        message,
        link,
        isRead: false,
        createdAt: notification.createdAt,
      });
    } catch (_) {}

    return notification;
  } catch (err) {
    // Never let notification failure break the main flow
    console.error("[notify] Failed to create notification:", err.message);
    return null;
  }
};

module.exports = { notify };
