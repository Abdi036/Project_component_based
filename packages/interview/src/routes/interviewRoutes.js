const express = require("express");
const { protect } = require("auth/src/middleware/authMiddleware.js");
const {
  createInterviewQuestions,
  getInterviews,
  getInterview,
  deleteInterview,
} = require("../controllers/interviewController");

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

router.post("/generate", createInterviewQuestions);
router.get("/mine", getInterviews);
router.route("/:id").get(getInterview).delete(deleteInterview);

module.exports = router;
