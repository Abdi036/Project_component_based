const { GoogleGenAI } = require("@google/genai");

let ai;

const getAIClient = () => {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return ai;
};

const generateQuestions = async (role, experienceLevel, amount) => {
  try {
    const aiClient = getAIClient();
    const prompt = `Act as an expert technical interviewer. Generate a list of ${amount} interview questions for a ${role} position with an ${experienceLevel} level of experience.

Please format your response strictly as a JSON array of objects, where each object represents a question and has the following keys:
- "questionText": The content of the question
- "topic": A brief word or phrase describing what the question targets (e.g. "Data Structures", "System Design", "Behavioral")
- "difficulty": "Easy", "Medium", or "Hard"
- "suggestedAnswer": A helpful suggested answer or key points to touch upon for the answer

Return ONLY the raw JSON array. DO NOT wrap the output in any markdown formatting like \`\`\`json.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        maxOutputTokens: 2000,
        temperature: 0.7,
      },
    });

    let resultText = response.text || "";
    resultText = resultText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(resultText);
  } catch (error) {
    console.error("Error in generated interview questions AI:", error);
    throw new Error(
      "Failed to generate interview questions. Please try again.",
    );
  }
};

module.exports = {
  generateQuestions,
};
