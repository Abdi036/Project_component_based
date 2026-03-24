const express = require("express");
const {
  generateStudyPlan,
  getMyStudyPlans,
  getStudyPlanById,
  deleteStudyPlan,
} = require("../controllers/studyPlanController");

const router = express.Router();

// Note: A real implementation would apply authentication middleware here
// e.g., router.use(protect);

router.post("/generate", generateStudyPlan);
router.get("/mine", getMyStudyPlans);
router.route("/:id").get(getStudyPlanById).delete(deleteStudyPlan);

module.exports = router;
