import { generateContent, extractText } from "./aiClient.js";
import { CONFIG } from "./config.js";

export const generateCoverLetter = async (
  userProfile,
  jobDetails,
  tailoredResume
) => {
  try {
    const prompt = `You are an expert cover letter writer. Write a compelling, personalized cover letter for this job application.

Candidate Information:
Name: ${userProfile.name}
Location: ${userProfile.location}

Job Details:
Title: ${jobDetails.title}
Company: ${jobDetails.company}
Location: ${jobDetails.location}
Requirements: ${JSON.stringify(jobDetails.requirements, null, 2)}
Responsibilities: ${JSON.stringify(jobDetails.responsibilities, null, 2)}

Candidate's Relevant Experience:
Summary: ${tailoredResume.summary}
Key Skills: ${tailoredResume.skills?.technical?.slice(0, 8).join(", ")}
Top Experience: ${JSON.stringify(
      tailoredResume.experience?.slice(0, 2),
      null,
      2
    )}

Instructions:
1. Opening paragraph: Express genuine interest in the role and company (2-3 sentences)
2. Body paragraphs (2-3 paragraphs):
   - Highlight 2-3 most relevant experiences that match job requirements
   - Show enthusiasm and explain why you're a good fit
   - Demonstrate knowledge of or interest in the company
3. Closing paragraph: Strong call to action, express eagerness to discuss further
4. Keep it concise (250-350 words total)
5. Professional but warm and authentic tone
6. Avoid clichés like "I am writing to apply" or "I would be a great fit"
7. Make it personal and specific to this job

Format:
${userProfile.name}
${userProfile.location}
${new Date().toLocaleDateString()}

Hiring Manager
${jobDetails.company}

[Cover letter content in paragraphs]

Sincerely,
${userProfile.name}

Return ONLY the formatted cover letter text, no JSON, no additional commentary.`;

    const response = await generateContent(prompt);
    return extractText(response);
  } catch (error) {
    console.error("Cover letter generation error:", error);
    throw new Error(`Failed to generate cover letter: ${error.message}`);
  }
};
