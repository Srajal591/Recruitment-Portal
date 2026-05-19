/**
 * Notification helper for the communication-payment service.
 * Writes directly to the shared MongoDB Notification collection.
 */
const Notification = require("../models/Notification");
const { emitToCandidate, SOCKET_EVENTS } = require("../socket/index");

const notify = async ({
  recipientId,
  recipientModel = "User",
  type,
  title,
  message,
  link,
  metadata,
}) => {
  try {
    const notification = await Notification.create({
      recipientId,
      recipientModel,
      type,
      title,
      message,
      link: link || null,
      metadata: metadata || undefined,
    });

    try {
      if (recipientModel === "User") {
        emitToCandidate(
          recipientId.toString(),
          SOCKET_EVENTS.NEW_NOTIFICATION,
          {
            _id: notification._id,
            type,
            title,
            message,
            link,
            isRead: false,
            createdAt: notification.createdAt,
          },
        );
      }
    } catch (_) {}

    return notification;
  } catch (err) {
    console.error("[notify] Failed to create notification:", err.message);
    return null;
  }
};

module.exports = { notify };
