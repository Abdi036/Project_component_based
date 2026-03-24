const { GoogleGenAI } = require("@google/genai");

const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing GEMINI_API_KEY. Add it to server/.env (do not hardcode keys).",
    );
  }

  return new GoogleGenAI({ apiKey });
};

/**
 * Generates text from Gemini.
 * @param {string} prompt
 * @param {{ model?: string, temperature?: number, maxOutputTokens?: number }} [options]
 */
exports.getAIResponse = async (prompt, options = {}) => {
  if (!prompt || typeof prompt !== "string") {
    throw new Error("Prompt must be a non-empty string");
  }

  const {
    model = DEFAULT_MODEL,
    temperature = 0.6,
    maxOutputTokens = 2500,
  } = options;

  const genAI = getGeminiClient();

  const result = await genAI.models.generateContent({
    model,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      temperature,
      maxOutputTokens,
    },
  });

  const text = result?.text;
  if (!text) {
    throw new Error("AI returned an empty response");
  }
  return text;
};
