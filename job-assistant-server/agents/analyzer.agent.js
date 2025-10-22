import { GoogleGenAI } from "@google/genai";
import * as cheerio from "cheerio";
import axios from "axios";
import { response } from "express";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export const scrapeJbUrl = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      timeout: 10000,
    });
    const $ = cheerio.load(response.data);
    $("script, style, nav, footer, header").remove();
    const text = $("body").text().replace(/\s+/g, " ").trim();
    return text;
  } catch (error) {
    throw new Error(`Failed to scrape URL: ${error.message}`);
  }
};
// Paese the job description
export const parseJobDescription = async (description) => {
  try {
    const prompt = `You are a job description analyzer. Extract structured information from this job posting and return ONLY valid JSON.

    Job Description: 
    ${description.substring(0, 8000)}
    Extract and return a JSON object with the following properties: 
    {
    "title": "Job title",
    "company": "Company name",
    "location": "Job location or Remotw",
    "requirements": {
    "mustHave": ["requirement 1", "requirement 2"],
    "niceToHave": ["optional skill 1"],
    "yearsExperience": 2
  },
  "responsibilities": ["responsibility 1", "responsibility 2"],
  "technologies": ["tech 1", "tech 2"],
  "benefits": ["benefit 1"],
  "salary": {
    "min": 80000,
    "max": 120000,
    "currency": "USD"
  }
  
  Important: Return only the JSON object, nothing else.`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const text = response.test;
    const cleanedtext = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    return JSON.parse(cleanedtext);
  } catch (error) {
    throw new Error(`Failed to parse job description: ${error.message}`);
  }
};
