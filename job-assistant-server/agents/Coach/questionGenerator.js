import { extractText, generateContent } from "../utility/aiClient.js";
import { CONFIG } from "../utility/config.js";
import { parseJSON } from "../utility/parseJson.js";

export const generateInterviewQuestions = async (jobDetails, userProfile) => {
  try {
    const prompt = `You are an interview preparation expert. Generate comprehensive and relavent interview questions for this job application.
    
    Job Details:
    ${JSON.stringify(jobDetails, null, 2)}
    
    Candidate Profile:
    Name: ${userProfile.name || "Not provided"}
    Summary: ${userProfile.summary || "Not provided"}
    Skills: ${JSON.stringify(userProfile.skills, null, 2)}
    Experience: ${JSON.stringify(userProfile.experience?.slice(0, 3), null, 2)}

    Generate ${CONFIG.AI.INTERVIEW_QUESTIONS_COUNT} questions covering:
    1. Technical Questions (based on required technologies) 
    2. Behavioral questions (STAR method applicable)
    3. Company-specific questions
    4. Scenario-based questions
    5. Questions about any gaps or transitions in the resume

        For each question, provide:
    - The question text
    - Category (technical/behavioral/company/scenario)
    - A suggested answer approach (2-3 sentences)
    - Key points to mention
    - 2-3 tips for answering well

    Return ONLY valid JSON with this structure:
    {
      "questions": [
        {
          "question": "Question text here",
          "category": "technical",
          "suggestedAnswer": "Approach to answering...",
          "keyPoints": ["point 1", "point 2"],
          "tips": ["tip 1", "tip 2"]
        }
      ]
    }

    Important: Return ONLY the JSON object, no additional text.
    `;
    const response = await generateContent(prompt);
    const text = extractText(response);
    const result = parseJSON(text);
    if (!result.questions || !Array.isArray(result.questions)) {
      throw new Error("Invalid questions format returned by AI");
    }

    return result.questions.slice(0, CONFIG.AI.INTERVIEW_QUESTIONS_COUNT);
  } catch (error) {
    console.error("Question generation error:", error.message);
    throw new Error(`Failed to generate questions: ${error.message}`);
  }
};
