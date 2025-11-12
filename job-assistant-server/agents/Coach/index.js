import { generateCustomAnswers } from "./answerGenerator.js";
import { researchCompany } from "./companyResearch.js";
import {
  formatQuestion,
  groupQuestionsByCategory,
  validateQuestions,
} from "./helper.js";
import { generateInterviewQuestions } from "./questionGenerator.js";

export const createInterviewPrep = async (jobDetails, userProfile) => {
  try {
    console.log("🎤 Starting interview prep generation...");

    // Step 1: Generate interview questions
    console.log("🧠 Generating interview questions...");
    const questions = await generateInterviewQuestions(jobDetails, userProfile);

    // Validate questions
    const validation = validateQuestions(questions);
    if (!validation.isValid) {
      console.warn("⚠️ Some questions failed validation:", validation.errors);
    }

    console.log(`✅ Generated ${questions.length} questions`);

    // Step 2: Generate personalized answers
    console.log("✍️ Generating personalized answers...");
    const answersWithDetails = await generateCustomAnswers(
      questions,
      userProfile,
      jobDetails
    );

    console.log(
      `✅ Generated ${answersWithDetails.length} personalized answers`
    );

    // Step 3: Research company
    console.log("🔍 Researching company...");
    const companyResearch = await researchCompany(jobDetails.company);
    console.log("✅ Company research completed");

    // Format and organize results
    const result = {
      questions: answersWithDetails.map((q, i) => formatQuestion(q, i)),
      companyResearch,
      summary: {
        totalQuestions: answersWithDetails.length,
        categoryCounts: groupQuestionsByCategory(answersWithDetails),
        company: jobDetails.company,
        jobTitle: jobDetails.title,
      },
      generatedAt: new Date().toISOString(),
    };

    console.log("🎉 Interview prep generation complete!");
    return result;
  } catch (error) {
    console.error("❌ Interview prep creation failed:", error);
    throw error;
  }
};

/**
 * Generates only interview questions (faster, no answers)
 */
export const createQuickInterviewPrep = async (jobDetails, userProfile) => {
  try {
    console.log("⚡ Starting quick interview prep (questions only)...");

    const questions = await generateInterviewQuestions(jobDetails, userProfile);
    const companyResearch = await researchCompany(jobDetails.company);

    console.log("✅ Quick interview prep complete!");
    return {
      questions: questions.map((q, i) => formatQuestion(q, i)),
      companyResearch,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("❌ Quick interview prep failed:", error);
    throw error;
  }
};

/**
 * Regenerates only company research
 */
export const regenerateCompanyResearch = async (companyName) => {
  try {
    console.log(`🔄 Regenerating company research for ${companyName}...`);

    const companyResearch = await researchCompany(companyName);

    console.log("✅ Company research regenerated!");
    return {
      companyResearch,
      regeneratedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("❌ Company research regeneration failed:", error);
    throw error;
  }
};

/**
 * Generates additional questions for specific category
 */
export const generateAdditionalQuestions = async (
  jobDetails,
  userProfile,
  category,
  count = 5
) => {
  try {
    console.log(`➕ Generating ${count} additional ${category} questions...`);

    const allQuestions = await generateInterviewQuestions(
      jobDetails,
      userProfile
    );

    const categoryQuestions = allQuestions
      .filter((q) => q.category === category)
      .slice(0, count);

    const withAnswers = await generateCustomAnswers(
      categoryQuestions,
      userProfile,
      jobDetails
    );

    console.log(`✅ Generated ${withAnswers.length} additional questions`);
    return withAnswers.map((q, i) => formatQuestion(q, i));
  } catch (error) {
    console.error("❌ Additional questions generation failed:", error);
    throw error;
  }
};
