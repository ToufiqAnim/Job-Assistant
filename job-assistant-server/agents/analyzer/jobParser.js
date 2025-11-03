import { extractText, generateContent } from "../utility/aiClient";
import { CONFIG } from "../utility/config";
import { parseJSON } from "../utility/parseJson";

export const parseJobDescription = async (description) => {
  try {
    const prompt = `You are the job description analyzer. Extract structured information from this job description and return only valid JSON.

    Job Description: ${description.substring(
      0,
      CONFIG.AI.MAX_DESCRIPTION_LENGTH
    )}

    Extract and return a JSON object with exact structure:
{
  "title": "job title",
  "company": "company name",
  "location": "location or Remote",
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
}

Important: Return ONLY the JSON object, no additional text.`;

    const response = await generateContent(prompt);
    const text = extractText(response);
    const parseData = parseJSON(text);
    return parseData;
  } catch (error) {
    console.log("Parse Error", error);
    throw new Error(`Failed to parse job description: ${error.mesage}`);
  }
};
