const mongoose = require("mongoose");

const StudyPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    inputs: {
      jobRole: { type: String, required: true, trim: true },
      interviewType: { type: String, required: true, trim: true },
      yearsOfExperience: { type: Number, required: true, min: 0 },
      experienceLevel: { type: String, required: true, trim: true },
      tools: { type: [String], default: [] },
      duration: {
        value: { type: Number, required: true, min: 1 },
        unit: { type: String, required: true, trim: true },
      },
    },
    generatedPlan: { type: String, required: true },
    model: { type: String, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model("StudyPlan", StudyPlanSchema);
