import { extractText, generateContent } from "../common/aiClient";

export const tailorResume = async (masterResume, jobDetails, gapAnalysis) => {
  try {
    const prompt = `You are an expert resume writer. Tailor this resume based on the job description and gap analysis.
    
    Master Resume:
    ${JSON.stringify(masterResume, null, 2)}

    Job Details:
    Title: ${jobDetails.title}
    Company: ${jobDetails.company}
    Requirements: ${(jobDetails.requirements, null, 2)}

    Gap Analysis:
    ${JSON.stringify(gapAnalysis, null, 2)}

    Instructions:
    1. Rewrite the summary to align with the job requirements
    2. Reorder and emphasize relevant experience
    3. Highlight achievements that match job requirements
    4. Emphasize relevant skills and technologies from the must-have list
    5. Adjust descriptions to show relevant experience
    6. Keep all information TRUTHFUL - do not fabricate experience
    7. Use keywords from the job requirements naturally
    8. Maintain professional tone
    
    Return ONLY valid JSON with the complete tailored resume in the same structure as the master resume.
    Do not add any text before or after the JSON.
    `;
    const response = await generateContent(prompt);
    const text = extractText(response);
    const cleanedText = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Resume tailoring error:", error.message);
    throw new Error(`Resume tailoring failed: ${error.message}`);
  }
};
