// Simple test file for generateInterviewQuestions (no Jest)

import { generateInterviewQuestions } from "./agents/Coach/questionGenerator.js";

const mockJobDetails = {
  title: "Frontend Developer",
  company: "TechNova",
  requirements: [
    "Proficient in React.js and JavaScript",
    "Experience with REST APIs",
    "Knowledge of responsive design and CSS frameworks",
  ],
};

const mockUserProfile = {
  name: "John Doe",
  summary:
    "Frontend developer with 2 years of experience in building web apps.",
  skills: ["JavaScript", "React", "CSS", "HTML"],
  experience: [
    {
      company: "Webify",
      role: "Frontend Developer",
      duration: "2022–2024",
      description: "Developed interactive UIs using React and Tailwind CSS.",
    },
  ],
};

// Wrap test in async IIFE so you can use await at top level
(async () => {
  console.log("🧪 Testing generateInterviewQuestions...\n");

  try {
    const questions = await generateInterviewQuestions(
      mockJobDetails,
      mockUserProfile
    );

    console.log("✅ AI returned questions successfully:\n");
    console.log(JSON.stringify(questions, null, 2));
  } catch (error) {
    console.error("❌ Test failed with error:\n", error.message);
  }
})();
