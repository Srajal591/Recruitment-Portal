const express = require("express");
const router = express.Router();
const supportController = require("../../controllers/candidate/support.controller");
const authenticate = require("../../../../../packages/common/middlewares/authenticate");
const { authorize } = require("../../../../../packages/common/middlewares/authorize");
const validate = require("../../../../../packages/common/middlewares/validate");
const {
  createTicketSchema,
  addReplySchema,
} = require("../../../../../packages/common/validations/support.validation");

router.use(authenticate, authorize("candidate"));

router.get("/tickets", supportController.getMyTickets);
router.post(
  "/tickets",
  validate(createTicketSchema),
  supportController.createTicket,
);
router.get("/tickets/:id", supportController.getTicket);
router.post(
  "/tickets/:id/reply",
  validate(addReplySchema),
  supportController.addReply,
);

module.exports = router;

