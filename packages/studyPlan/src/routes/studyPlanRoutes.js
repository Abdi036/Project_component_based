const express = require("express");
const { protect } = require("auth/src/middleware/authMiddleware.js");
const {
  generateStudyPlan,
  getMyStudyPlans,
  getStudyPlanById,
  deleteStudyPlan,
} = require("../controllers/studyPlanController");

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

router.post("/generate", generateStudyPlan);
router.get("/mine", getMyStudyPlans);
router.route("/:id").get(getStudyPlanById).delete(deleteStudyPlan);

module.exports = router;
