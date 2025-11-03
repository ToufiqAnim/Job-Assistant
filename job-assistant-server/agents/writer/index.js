import { generateCoverLetter } from "./coverLetterGenerator.js";
import { tailorResume } from "./resumeTailor.js";

export const generateApplicationMaterials = async (
  userProfile,
  jobDetails,
  gapAnalysis
) => {
  try {
    console.log("Tailoring resume...");
    const tailoredResume = await tailorResume(
      userProfile.masterResume,
      jobDetails,
      gapAnalysis
    );

    console.log("Generating cover letter...");
    const coverLetter = await generateCoverLetter(
      userProfile,
      jobDetails,
      tailoredResume
    );

    return {
      tailoredResume,
      coverLetter,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Application materials generation error:", error);
    throw new Error(
      `Failed to generate application materials: ${error.message}`
    );
  }
};
