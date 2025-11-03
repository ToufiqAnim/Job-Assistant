import { extractText, generateContent } from "../utility/aiClient.js";
import { CONFIG } from "../utility/config.js";
import { parseJSON } from "../utility/parseJson.js";

export const generateCustomAnswers = async (
  questions,
  userProfile,
  jobDetails
) => {
  try {
    const answers = [];
    const batchSize = CONFIG.BATCH.SIZE;

    for (let i = 0; i < questions.length; i += batchSize) {
      const batch = questions.slice(i, i + batchSize);

      const prompt = `You are helping a candidate prepare personalized answers for interview questions.

      Candidate Profile:
      Name: ${userProfile.name || "Not provided"}
      Summary: ${userProfile.summary || "Not provided"}
      Skills: ${JSON.stringify(userProfile.skills, null, 2)}
      Experience: ${JSON.stringify(
        userProfile.experience?.slice(0, 3),
        null,
        2
      )}
      Projects: ${JSON.stringify(userProfile.projects?.slice(0, 2), null, 2)}

      Job Context:
      Title: ${jobDetails.title}
      Company: ${jobDetails.company}
      Requirements: ${JSON.stringify(jobDetails.requirements, null, 2)}

      Questions to Answer:
      ${JSON.stringify(batch, null, 2)}

      For each question, generate a personalized answer that:
      1. Uses STAR method (Situation, Task, Action, Result) for behavioral questions
      2. References specific experiences from the candidate's profile
      3. Aligns with the job requirements
      4. Sounds natural and authentic
      5. Is concise (would take 2-3 minutes to speak)
      6. Includes specific examples, metrics, or outcomes where possible
      7. Shows enthusiasm and cultural fit

      Return ONLY valid JSON:
      {
        "answers": [
          {
            "question": "Original question text",
            "category": "technical/behavioral/etc",
            "suggestedAnswer": "Your complete personalized answer here (2-4 paragraphs)",
            "keyPoints": ["main point 1", "main point 2"],
            "tips": ["delivery tip 1", "delivery tip 2"]
          }
        ]
      }

      Important: Return ONLY the JSON object, no additional text.`;

      const response = await generateContent(prompt);
      const text = extractText(response);

      if (!text) {
        console.warn(`Batch ${i / batchSize + 1} returned empty response`);
        continue;
      }

      const result = parseJSON(text);

      if (result.answers && Array.isArray(result.answers)) {
        answers.push(...result.answers);
      }

      if (i + batchSize < questions.length) {
        await new Promise((resolve) => setTimeout(resolve, CONFIG.BATCH.DELAY));
      }
    }

    return answers;
  } catch (error) {
    console.error("Answer generation error:", error.message);
    throw new Error(`Failed to generate answers: ${error.message}`);
  }
};
