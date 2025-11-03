import { extractText, generateContent } from "../utility/aiClient.js";
import { createFallbackResearch } from "./fallbackReseachCompany.js";

export const researchCompany = async (companyName) => {
  try {
    const prompt = `You are a company research expert. Provide a detailed analysis of the company ${companyName}.
    
    Include the following sections:
    
    ## Company Overview
    - What they do (products/services)
    - Mission and values
    - Industry position

    ## Company Culture
    - Leadership
    - Work environment
    - Core values in practice
    - Employee reviews highlights
    
    ## Recent News & Achievements
    - Recent product launches or milestones (if you know any)
    - Awards or recognition
    - Growth trajectory
    
    ## Interview Process Insights
    - Typical interview stages
    - What they look for in candidates
    - Common assessment methods
    
    ## Common Interview Questions
    - 5-7 questions frequently asked at this company
    - Why they ask these questions
    
    ## Questions You Should Ask
    - 5-7 thoughtful questions to ask the interviewer
    - Shows genuine interest and research
    
    ## Interview Tips
    - Specific advice for interviewing at this company
    - Red flags to watch for
    - How to stand out
    
    Format the response with clear markdown headers and bullet points.
    Be concise but informative (500-700 words total).
    If you don't have recent or specific information, acknowledge it and provide general guidance based on the company type and industry.     
    `;

    const response = await generateContent(prompt);
    const text = extractText(response);
    if (!text) {
      return createFallbackResearch(companyName);
    }
    return text;
  } catch (error) {
    console.error("Company research error:", error);
    return createFallbackResearch(companyName);
  }
};
