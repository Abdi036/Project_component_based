const asyncHandler = require("../middleware/async");
const { getAIResponse } = require("../utils/ai");
const StudyPlan = require("../models/StudyPlan");

const getExperienceLevel = (yearsOfExperience) => {
  const years = Number(yearsOfExperience);
  if (Number.isNaN(years) || years < 0) return "Junior";
  if (years <= 1) return "Junior";
  if (years < 3) return "Intermediate";
  return "Senior";
};

// @desc      Generate AI study plan
// @route     POST /api/v1/studyplan/generate
// @access    Private
exports.generateStudyPlan = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }

  const { jobRole, duration, tools, yearsOfExperience, interviewType } =
    req.body;

  if (
    !jobRole ||
    !duration?.value ||
    !duration?.unit ||
    !Array.isArray(tools) ||
    tools.length === 0 ||
    yearsOfExperience === undefined ||
    yearsOfExperience === null ||
    !interviewType
  ) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  const experienceLevel = getExperienceLevel(yearsOfExperience);

  const prompt = `
You are an elite interview coach specializing in communication strategy and interview performance — not content memorization.

Your task is to generate a personalized, structured interview preparation plan focused entirely on HOW a candidate answers, communicates, and connects with interviewers — not on what topics to study.

=== CANDIDATE PROFILE ===
- Job Role: ${jobRole}
- Experience Level: ${experienceLevel}
- Tools / Tech Stack: ${tools.join(", ")}
- Preparation Duration: ${duration.value} ${duration.unit}(s)
- Interview Type: ${interviewType}

=== CRITICAL FORMATTING RULE ===
${
  duration.value < 7 && duration.unit === "day"
    ? "Break the plan into DAILY segments (Day 1, Day 2, etc.)"
    : "Break the plan into WEEKLY segments (Week 1, Week 2, etc.)"
}

=== OUTPUT STRUCTURE ===
For EACH time segment, output exactly these 5 sections in order.
Use clear markdown headers. Do NOT summarize or skip sections.

---

### 1.Answering Frameworks
- Recommend specific frameworks for this candidate's interview type: STAR, CAR, SOAR, or role-specific (e.g., hypothesis-driven for product, trade-off matrices for system design)
- Explain WHEN to use each framework and how to switch between them mid-interview based on interviewer signals
- Tailor advice to ${experienceLevel} level — junior candidates need scaffolding; senior candidates need strategic framing

**Example 1:** Write a realistic question a ${jobRole} would face in a ${interviewType} interview, then show exactly how this candidate should structure their answer using the recommended framework. Use first-person ("I would say...").

**Example 2:** Write a harder or follow-up version of Example 1's question, and show how to adapt the framework when the interviewer digs deeper.

---

### 2.How to Answer
- How to open strong (avoid rambling intros)
- How to calibrate technical depth based on real-time interviewer cues (nodding, interrupting, asking to slow down)
- How to project confidence without arrogance — especially calibrated for ${experienceLevel} level
- How to end answers cleanly and invite dialogue

**Example 1:** Show a weak version of an answer to a ${jobRole} question, then rewrite it as a strong version — annotated with what changed and why.

**Example 2:** Demonstrate how the same answer should differ when given to a technical interviewer vs. a hiring manager.

---

### 3.Interviewer Interaction Skills
- How to ask clarifying questions without seeming unprepared (include exact phrasing)
- How to think aloud in a way that shows structured reasoning, not confusion
- How to handle interruptions gracefully and own the moment
- How to respond to pushback or "that's not quite right" without collapsing
- How to recover authentically when stuck — using a specific recovery script

**Example 1:** Roleplay a moment where the interviewer challenges the candidate's answer. Show word-for-word how to respond.

**Example 2:** Show what "thinking aloud" looks like for a ${tools[0] || "technical"} problem — the exact narration a ${experienceLevel} ${jobRole} should use.

---

### 4.Practical Exercises
- 2 mock question prompts tailored to ${jobRole} using ${tools.join(", ")}
- For each prompt: provide the ideal response structure (not the full answer — the scaffold)
- 1 story-building exercise: map a real past experience to STAR format, showing the before/after

**Example 1:** A behavioral question + STAR story scaffold with guidance on what details to include at each step for a ${experienceLevel} ${jobRole}.

**Example 2:** A technical or role-specific question + a response scaffold that shows how to layer in the tech stack (${tools.slice(0, 2).join(", ")}) authentically.

---

### 5.Revision & Reflection
- 5 self-evaluation questions the candidate should ask themselves after every mock session
- 3 most common mistakes candidates at ${experienceLevel} level make in ${interviewType} interviews — with specific fixes
- One daily/weekly habit to sharpen communication (not content knowledge)

**Example:** Show what a self-evaluation journal entry looks like after a mock interview — what the candidate should notice, flag, and improve.

---

=== GLOBAL TONE RULES ===
- Write as a coach speaking directly to the candidate ("You should...", "When the interviewer asks X, try...")
- Prioritize storytelling, human connection, and clarity over memorization or scripted answers
- All examples must be realistic and specific to ${jobRole} + ${tools.join(", ")} — no generic placeholders
- Do NOT suggest what to study. Only coach on HOW to perform and communicate.
`;

  const studyPlan = await getAIResponse(prompt, {
    temperature: 0.6,
    maxOutputTokens: 8000,
  });

  const savedPlan = await StudyPlan.create({
    user: userId,
    inputs: {
      jobRole,
      interviewType,
      yearsOfExperience: Number(yearsOfExperience),
      experienceLevel,
      tools,
      duration: {
        value: Number(duration.value),
        unit: duration.unit,
      },
    },
    generatedPlan: studyPlan,
    model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
  });

  return res.status(201).json({
    success: true,
    experienceLevel,
    studyPlan: savedPlan,
  });
});

// @desc      Get logged-in user's study plans
// @route     GET /api/v1/studyplan/mine
// @access    Private
exports.getMyStudyPlans = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }

  const plans = await StudyPlan.find({ user: userId })
    .sort({ createdAt: -1 })
    .select("inputs generatedPlan createdAt updatedAt");

  return res.status(200).json({
    success: true,
    count: plans.length,
    data: plans,
  });
});

// @desc      Get single study plan
// @route     GET /api/v1/studyplan/:id
// @access    Private
exports.getStudyPlanById = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }

  const studyPlan = await StudyPlan.findOne({
    _id: id,
    user: userId, // ensures user can only access their own plan
  }).select("inputs generatedPlan createdAt updatedAt");

  if (!studyPlan) {
    return res.status(404).json({
      success: false,
      message: "Study plan not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: studyPlan,
  });
});

// @desc      Delete single study plan
// @route     DELETE /api/v1/studyplan/:id
// @access    Private
exports.deleteStudyPlan = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }

  const studyPlan = await StudyPlan.findOne({
    _id: id,
    user: userId, // ensure ownership
  });

  if (!studyPlan) {
    return res.status(404).json({
      success: false,
      message: "Study plan not found",
    });
  }

  await studyPlan.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Study plan deleted successfully",
  });
});
