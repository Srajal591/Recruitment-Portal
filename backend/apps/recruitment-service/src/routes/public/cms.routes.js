const express = require("express");
const router = express.Router();
const { getPublicStatePage } = require("../../controllers/admin/cms.controller");

// Public — no auth required
router.get("/:state", getPublicStatePage);

module.exports = router;
