const express = require("express");
const router = express.Router();
const jobController = require("../../controllers/public/job.controller");
const { apiLimiter } = require("../../shared/middlewares/rateLimiter");

// ── Public Job Routes ─────────────────────────────────────────
router.get("/", apiLimiter, jobController.getJobs);
router.get("/stats", apiLimiter, jobController.getJobStats);
router.get("/search", apiLimiter, jobController.searchJobs);
router.get("/departments", apiLimiter, jobController.getDepartments);
router.get("/categories", apiLimiter, jobController.getCategories);
router.get("/:id", apiLimiter, jobController.getJob);

module.exports = router;

