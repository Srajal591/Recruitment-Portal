const express = require("express");
const router = express.Router();
const notificationController = require("../../controllers/candidate/notification.controller");
const authenticate = require("../../../../../packages/common/middlewares/authenticate");
const { authorize } = require("../../../../../packages/common/middlewares/authorize");

router.use(authenticate, authorize("candidate"));

router.get("/", notificationController.getNotifications);
router.patch("/read-all", notificationController.markAllAsRead);
router.patch("/:id/read", notificationController.markAsRead);

module.exports = router;

