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

/* export const generateContentWithOptions = async (prompt, options = {}) => {
  const ai = getAIClient();
  try {
    const config = {
      model: options.model || CONFIG.AI.MODEL,
      contents: prompt,
      generationConfig: {
        temperature: options.temperature ?? CONFIG.AI.TEMPERATURE,
        maxOutputTokens: options.maxTokens || CONFIG.AI.MAX_TOKENS,
        topP: options.topP || 0.95,
        topK: options.topK || 40,
      },
    };
    const start = Date.now();
    const response = await ai.models.generateContent(config);
    console.log(`✅ Custom content generated in ${Date.now() - start}ms`);
    return response;
  } catch (error) {
    console.error("AI generation with options failed:", error.message);
    throw new Error(`Failed to generate content: ${error.message}`);
  }
}; */

/* export const generateContentWithRetry = async (
  prompt,
  maxRetries = CONFIG.AI.MAX_RETRIES
) => {
  for (let i = 1; i <= maxRetries; i++) {
    try {
      console.log(`Attempt ${i}/${maxRetries}`);
      return await generateContent(prompt);
    } catch (error) {
      console.warn(`Attempt ${i} failed: ${error.message}`);
      if (i === maxRetries) throw error;
      const delay = CONFIG.AI.RETRY_DELAY * Math.pow(2, i - 1);
      console.log(`Retrying in ${delay}ms...`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
};

export const generateContentWithTimeout = async (
  prompt,
  timeout = CONFIG.AI.TIMEOUT
) => {
  return Promise.race([
    generateContent(prompt),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${timeout}ms`)), timeout)
    ),
  ]);
};

export const batchGenerateContent = async (
  prompts,
  batchSize = CONFIG.BATCH.SIZE,
  delay = CONFIG.BATCH.DELAY
) => {
  const results = [];
  for (let i = 0; i < prompts.length; i += batchSize) {
    const batch = prompts.slice(i, i + batchSize);
    console.log(
      `Processing batch ${i / batchSize + 1}/${Math.ceil(
        prompts.length / batchSize
      )}`
    );
    const batchResults = await Promise.all(
      batch.map((p) => generateContent(p))
    );
    results.push(...batchResults);
    if (i + batchSize < prompts.length) {
      console.log(`Waiting ${delay}ms before next batch...`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  return results;
};

export const estimateTokens = (text) => Math.ceil(text.length / 4);

export const healthCheck = async () => {
  try {
    const response = await generateContent("Say OK if you're working");
    const text = extractText(response);
    return text.toLowerCase().includes("ok");
  } catch {
    return false;
  }
};
 */
