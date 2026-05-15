const express = require("express");
const router = express.Router();
const supportController = require("../../controllers/admin/support.controller");
const authenticate = require("../../../../../packages/common/middlewares/authenticate");
const { authorize } = require("../../../../../packages/common/middlewares/authorize");
const validate = require("../../../../../packages/common/middlewares/validate");
const {
  updateTicketSchema,
  addReplySchema,
} = require("../../../../../packages/common/validations/support.validation");

router.use(authenticate, authorize("admin", "employee"));

router.get("/tickets", supportController.getTickets);
router.get("/stats", supportController.getStats);
router.get("/tickets/:id", supportController.getTicketById);
router.put(
  "/tickets/:id",
  validate(updateTicketSchema),
  supportController.updateTicket,
);
router.post(
  "/tickets/:id/reply",
  validate(addReplySchema),
  supportController.addReply,
);

module.exports = router;

