import { GoogleGenAI } from "@google/genai";
import { CONFIG } from "./config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const extractText = (response) => {
  try {
    if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return response.candidates[0].content.parts[0].text;
    }
    if (typeof response === "string") {
      return response.text;
    }
    return JSON.stringify(response);
  } catch (error) {
    console.log("⚠️ Failed to extract Gemini text:", err);
    return "";
  }
};
export const generateContent = async (prompt) => {
  const response = await ai.models.generateContent({
    model: CONFIG.AI.MODEL,
    contents: prompt,
  });
  return response;
};
