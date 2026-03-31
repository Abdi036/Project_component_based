const Interview = require("../models/Interview");
const { generateQuestions } = require("../utils/ai");
const asyncHandler = require("../middleware/async");

// @desc    Generate new interview questions
// @route   POST /api/v1/interviews/generate
// @access  Private
exports.createInterviewQuestions = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }

  const { role, experienceLevel, amountOfQuestions } = req.body;

  if (!role || !experienceLevel || !amountOfQuestions) {
    return res.status(400).json({
      success: false,
      error: "Please provide role, experienceLevel, and amountOfQuestions",
    });
  }

  // Generate questions using AI
  const questionsData = await generateQuestions(
    role,
    experienceLevel,
    amountOfQuestions,
  );

  // Map the generated questions
  const generatedQuestions = questionsData.map((q) => ({
    questionText: q.questionText,
    topic: q.topic,
    difficulty: q.difficulty,
    suggestedAnswer: q.suggestedAnswer,
  }));

  const interview = await Interview.create({
    user: userId,
    role,
    experienceLevel,
    amountOfQuestions,
    questions: generatedQuestions,
  });

  res.status(201).json({
    success: true,
    data: interview,
  });
});

// @desc    Get all interview questions for logged-in user
// @route   GET /api/v1/interviews/mine
// @access  Private
exports.getInterviews = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }

  const interviews = await Interview.find({ user: userId }).sort("-createdAt");

  res.status(200).json({
    success: true,
    count: interviews.length,
    data: interviews,
  });
});

// @desc    Get single interview details
// @route   GET /api/v1/interviews/:id
// @access  Private
exports.getInterview = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }

  const interview = await Interview.findById(req.params.id);

  if (!interview) {
    return res
      .status(404)
      .json({ success: false, error: "Interview not found" });
  }

  // Make sure user owns the interview
  if (interview.user.toString() !== userId.toString()) {
    return res
      .status(401)
      .json({
        success: false,
        error: "Not authorized to access this interview",
      });
  }

  res.status(200).json({
    success: true,
    data: interview,
  });
});

// @desc    Delete interview
// @route   DELETE /api/v1/interviews/:id
// @access  Private
exports.deleteInterview = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }

  const interview = await Interview.findById(req.params.id);

  if (!interview) {
    return res
      .status(404)
      .json({ success: false, error: "Interview not found" });
  }

  // Make sure user owns the interview
  if (interview.user.toString() !== userId.toString()) {
    return res
      .status(401)
      .json({
        success: false,
        error: "Not authorized to access this interview",
      });
  }

  await interview.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
