const express = require("express");
const router = express.Router();
const supportController = require("../../controllers/candidate/support.controller");
const authenticate = require("../../shared/middlewares/authenticate");
const { authorize } = require("../../shared/middlewares/authorize");
const { upload } = require("../../shared/services/upload.service");
const validate = require("../../shared/middlewares/validate");
const {
  createTicketSchema,
  addReplySchema,
} = require("../../shared/validations/support.validation");

router.use(authenticate, authorize("candidate"));

router.get("/tickets", supportController.getMyTickets);
router.post(
  "/tickets",
  validate(createTicketSchema),
  supportController.createTicket,
);
router.post(
  "/attachments",
  upload.single("file"),
  supportController.uploadAttachment,
);
router.get("/tickets/:id", supportController.getTicket);
router.post(
  "/tickets/:id/reply",
  validate(addReplySchema),
  supportController.addReply,
);
router.patch("/tickets/:id/complete-action", supportController.completeAction);
router.patch("/tickets/:id/close", supportController.closeTicket);

module.exports = router;
