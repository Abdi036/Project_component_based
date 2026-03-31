const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    required: [true, "Please provide an interview role"],
  },
  experienceLevel: {
    type: String,
    required: [true, "Please provide an experience level"],
    enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
  },
  amountOfQuestions: {
    type: Number,
    required: [true, "Please specify the amount of questions"],
    min: 1,
    max: 50,
  },
  questions: [
    {
      questionText: String,
      topic: String,
      difficulty: String,
      suggestedAnswer: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Interview", interviewSchema);
