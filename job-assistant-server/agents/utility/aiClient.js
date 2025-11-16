import { GoogleGenAI } from "@google/genai";

import dotenv from "dotenv";
import { CONFIG } from "./config.js";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY in environment variables");
}

let aiInstance = null;

export const getAIClient = () => {
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    console.log("✅ Gemini AI client initialized");
  }
  return aiInstance;
};

export const extractText = (response) => {
  try {
    if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return response.candidates[0].content.parts[0].text.trim();
    }
    if (typeof response === "string") return response.trim();
    console.warn("⚠️ Unexpected response format");
    return JSON.stringify(response, null, 2);
  } catch {
    return "";
  }
};

export const generateContent = async (prompt) => {
  const ai = getAIClient();
  try {
    const start = Date.now();
    const response = await ai.models.generateContent({
      model: CONFIG.AI.MODEL,
      contents: prompt,
    });
    console.log(`✅ Content generated in ${Date.now() - start}ms`);
    return response;
  } catch (error) {
    console.error("AI generation failed:", error.message);
    throw new Error(`Failed to generate content: ${error.message}`);
  }
};
