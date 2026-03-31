const express = require("express");
const {
  createInterviewQuestions,
  getInterviews,
  getInterview,
  deleteInterview,
} = require("../controllers/interviewController");

const router = express.Router();

// Note: A real implementation would apply authentication middleware here
// e.g., router.use(protect);

router.post("/generate", createInterviewQuestions);
router.get("/mine", getInterviews);
router.route("/:id").get(getInterview).delete(deleteInterview);

module.exports = router;
