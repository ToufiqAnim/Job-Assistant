// agents/utility/aiClient.js
import { GoogleGenAI } from "@google/genai";
import { CONFIG } from "./config.js";
import dotenv from "dotenv";

dotenv.config();

// Validate API key
if (!process.env.GEMINI_API_KEY) {
  throw new Error("❌ Missing GEMINI_API_KEY in environment variables");
}

// Initialize Gemini client with API key
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY, // ← FIXED: Add API key here
});

/* -------------------------------------------------------
 * 🧩 Extract clean text safely from Gemini response
 * ----------------------------------------------------- */
export const extractText = (response) => {
  try {
    // New SDK uses structured response model
    if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return response.candidates[0].content.parts[0].text.trim();
    }
    if (typeof response === "string") {
      return response.trim();
    }
    return JSON.stringify(response, null, 2);
  } catch (err) {
    console.error("⚠️ Failed to extract Gemini text:", err);
    return "";
  }
};

/* -------------------------------------------------------
 * 🤖 Generate AI content with default model
 * ----------------------------------------------------- */
export const generateContent = async (prompt) => {
  try {
    const response = await ai.models.generateContent({
      model: CONFIG.AI.MODEL,
      contents: prompt,
    });

    return response;
  } catch (error) {
    console.error("❌ AI generation error:", error);
    throw new Error(`Failed to generate content: ${error.message}`);
  }
};

/* -------------------------------------------------------
 * 🎯 Get AI client instance (for direct access if needed)
 * ----------------------------------------------------- */
export const getAIClient = () => ai;

/* -------------------------------------------------------
 * 🔄 Generate content with custom options
 * ----------------------------------------------------- */
export const generateContentWithOptions = async (prompt, options = {}) => {
  try {
    const response = await ai.models.generateContent({
      model: options.model || CONFIG.AI.MODEL,
      contents: prompt,
      generationConfig: {
        temperature: options.temperature || 0.7,
        maxOutputTokens: options.maxTokens || 2048,
        topP: options.topP || 0.95,
        topK: options.topK || 40,
      },
    });

    return response;
  } catch (error) {
    console.error("❌ AI generation error:", error);
    throw new Error(`Failed to generate content: ${error.message}`);
  }
};
