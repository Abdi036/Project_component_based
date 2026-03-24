const studyPlanRoutes = require("./src/routes/studyPlanRoutes");
const StudyPlan = require("./src/models/StudyPlan");
const studyPlanController = require("./src/controllers/studyPlanController");
const aiUtils = require("./src/utils/ai");

module.exports = {
  studyPlanRoutes,
  StudyPlan,
  studyPlanController,
  aiUtils,
};
