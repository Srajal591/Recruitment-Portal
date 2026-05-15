const { StatusCodes } = require("http-status-codes");
const notificationService = require("../../shared/services/notification.service");
const { ApiResponse } = require("../../shared/utils/ApiResponse");
const asyncHandler = require("../../shared/utils/asyncHandler");

/**
 * @swagger
 * /api/candidate/notifications:
 *   get:
 *     tags: [Candidate - Notifications]
 *     summary: Get my notifications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isRead
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200: { description: Notifications list with unread count }
 */
const getNotifications = asyncHandler(async (req, res) => {
  const result = await notificationService.getNotifications(
    req.user.id,
    req.query,
  );
  res.status(StatusCodes.OK).json(
    new ApiResponse(
      StatusCodes.OK,
      "Notifications fetched",
      {
        notifications: result.notifications,
        unreadCount: result.unreadCount,
      },
      result.meta,
    ),
  );
});

/**
 * @swagger
 * /api/candidate/notifications/{id}/read:
 *   patch:
 *     tags: [Candidate - Notifications]
 *     summary: Mark a notification as read
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200: { description: Notification marked as read }
 */
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markAsRead(
    req.params.id,
    req.user.id,
  );
  res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(StatusCodes.OK, "Notification marked as read", {
        notification,
      }),
    );
});

/**
 * @swagger
 * /api/candidate/notifications/read-all:
 *   patch:
 *     tags: [Candidate - Notifications]
 *     summary: Mark all notifications as read
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: All notifications marked as read }
 */
const markAllAsRead = asyncHandler(async (req, res) => {
  await notificationService.markAllAsRead(req.user.id);
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, "All notifications marked as read"));
});

module.exports = { getNotifications, markAsRead, markAllAsRead };


