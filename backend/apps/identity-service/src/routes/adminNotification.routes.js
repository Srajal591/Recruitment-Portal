const express = require("express");
const router = express.Router();
const asyncHandler = require("../shared/utils/asyncHandler");
const { ApiResponse } = require("../shared/utils/ApiResponse");
const { StatusCodes } = require("http-status-codes");
const Notification = require("../shared/models/Notification");
const authenticate = require("../shared/middlewares/authenticate");
const { authorize } = require("../shared/middlewares/authorize");
const { getPaginationParams } = require("../shared/utils/helpers");
const { paginationMeta } = require("../shared/utils/ApiResponse");

router.use(authenticate, authorize("admin", "employee"));

// GET /api/admin/notifications
router.get("/", asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const filter = { recipientId: req.user.id, recipientModel: "Employee" };
  if (req.query.isRead !== undefined) filter.isRead = req.query.isRead === "true";
  // Support exact type or prefix match (e.g. type=payment matches payment_success, payment_failed)
  if (req.query.type) {
    filter.type = { $regex: `^${req.query.type}`, $options: "i" };
  }

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments(filter),
    Notification.countDocuments({ recipientId: req.user.id, recipientModel: "Employee", isRead: false }),
  ]);

  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, "Notifications fetched", { notifications, unreadCount }, paginationMeta(total, page, limit))
  );
}));

// PATCH /api/admin/notifications/read-all
router.patch("/read-all", asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipientId: req.user.id, recipientModel: "Employee", isRead: false },
    { isRead: true, readAt: new Date() }
  );
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, "All notifications marked as read"));
}));

// PATCH /api/admin/notifications/:id/read
router.patch("/:id/read", asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipientId: req.user.id },
    { isRead: true, readAt: new Date() },
    { new: true }
  );
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, "Notification marked as read", { notification }));
}));

// DELETE /api/admin/notifications/:id
router.delete("/:id", asyncHandler(async (req, res) => {
  await Notification.findOneAndDelete({ _id: req.params.id, recipientId: req.user.id });
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, "Notification deleted"));
}));

module.exports = router;
