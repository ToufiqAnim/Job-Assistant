import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
/* async function test() {
  try {
    console.log("Testing Gemini API...");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Explain how AI works in a few words",
    });
    console.log("✅ Success! Gemini response:", response.text);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
} */
async function test() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Explain why should a web developer user AI in 50 words?",
    });
    console.log(response.text);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}
test();
