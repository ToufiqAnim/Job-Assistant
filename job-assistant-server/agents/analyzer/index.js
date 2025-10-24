import { CONFIG } from "./config";
import { parseJobDescription } from "./jobParser";
import { scrapeJobUrl } from "./jobScraper";
import { calculateMatchScore } from "./matchCalculator";

export const analyzeJob = async (jobInput, userProfile) => {
  let description;
  if (jobInput.startsWith("http")) {
    description = await scrapeJobUrl(jobInput);
    console.log("Scraping job description from URL...");
  } else {
    description = jobInput;
  }
  console.log("Parsing job description...");
  const parsed = await parseJobDescription(description);
  console.log("Calculating match score...");
  const matchScore = await calculateMatchScore(parsed, userProfile);
  return {
    parsed,
    matchScore,
    rawDescription: description.subString(0, CONFIG.AI.MAX_RAW_DESCRIPTION),
  };
};
