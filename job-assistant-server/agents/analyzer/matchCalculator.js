import { extractText, generateContent } from "../common/aiClient";
import { CONFIG } from "../common/config";

export const calculateMatchScore = async (jobRequirements, userProfile) => {
  try {
    const prompt = `You are a job matching expert. Analyze how well this candidate matches the job requirements.
    
    Job Requirements: ${JSON.stringify(jobRequirements, null, 2)}

    Candidate Profile: 
    Name: ${userProfile.name || "Not provided"}
   Summary: ${userProfile.summary || "Not provided"}
   Skills: ${JSON.stringify(userProfile.skills, null, 2)}
   Experience: ${JSON.stringify(userProfile.experience?.slice(0, 3), null, 2)}
   
   Provide a detailed analysis and return ONLY valid JSON:
   {
     "score": 75,
     "strengths": ["strength 1", "strength 2", "strength 3"],
     "gaps": ["gap 1", "gap 2"],
     "recommendations": ["recommendation 1", "recommendation 2"]
   }
   
   Important:
   - Score should be ${CONFIG.SCORING.MIN_SCORE}–${CONFIG.SCORING.MAX_SCORE}
   - Be honest but encouraging
   - Focus on how to improve the application
   Return ONLY the JSON object, no additional text.
    `;
    const response = await generateContent(prompt);
    const text = extractText(response);
    const cleanedText = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Match calculation error:", error);
    throw new Error(`Failed to calculate match: ${error.message}`);
  }
};
