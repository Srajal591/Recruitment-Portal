const Notification = require("../../packages/common/models/Notification");
const { emitToUser, SOCKET_EVENTS } = require("../../packages/common/socket/index");
const { getPaginationParams } = require("../../packages/common/utils/helpers");
const { paginationMeta } = require("../../packages/common/utils/ApiResponse");

/**
 * Create and instantly push a notification via WebSocket.
 */
const createNotification = async ({
  recipientId,
  recipientModel,
  type,
  title,
  message,
  link,
  metadata,
}) => {
  const notification = await Notification.create({
    recipientId,
    recipientModel,
    type,
    title,
    message,
    link,
    metadata,
  });

  // Push to recipient in real-time
  emitToUser(recipientId.toString(), SOCKET_EVENTS.NEW_NOTIFICATION, {
    _id: notification._id,
    type,
    title,
    message,
    link,
    isRead: false,
    createdAt: notification.createdAt,
  });

  return notification;
};

const getNotifications = async (recipientId, query) => {
  const { page, limit, skip } = getPaginationParams(query);
  const filter = { recipientId };
  if (query.isRead !== undefined) filter.isRead = query.isRead === "true";

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments(filter),
    Notification.countDocuments({ recipientId, isRead: false }),
  ]);

  return {
    notifications,
    meta: paginationMeta(total, page, limit),
    unreadCount,
  };
};

const markAsRead = async (notificationId, recipientId) => {
  return Notification.findOneAndUpdate(
    { _id: notificationId, recipientId },
    { isRead: true, readAt: new Date() },
    { new: true },
  );
};

const markAllAsRead = async (recipientId) => {
  return Notification.updateMany(
    { recipientId, isRead: false },
    { isRead: true, readAt: new Date() },
  );
};

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
};

