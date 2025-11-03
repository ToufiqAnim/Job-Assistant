// test-generateCustomAnswer.js

import { generateCustomAnswers } from "./agents/Coach/answerGenerator.js";

// ✅ Import the function to test

// ✅ Mock AI utilities globally (so no real API calls)
global.generateContent = async (prompt) => {
  console.log(
    "🧠 Mock generateContent called with prompt snippet:\n",
    prompt.slice(0, 200)
  );
  return {
    text: JSON.stringify({
      answers: [
        {
          question: "Tell me about yourself",
          category: "behavioral",
          suggestedAnswer:
            "I'm a full-stack developer with a strong foundation in MERN technologies. I enjoy solving real-world problems and improving systems.",
          keyPoints: [
            "Experience in React and Node.js",
            "Strong problem-solving",
          ],
          tips: ["Use STAR method", "Be concise and confident"],
        },
      ],
    }),
  };
};

global.extractText = (response) => response.text;

// ✅ Define a small test function
async function runTest() {
  console.log("🧪 Starting generateCustomAnswers test...\n");

  const mockQuestions = [
    { question: "Tell me about yourself", category: "behavioral" },
    { question: "What are your technical strengths?", category: "technical" },
  ];

  const mockUserProfile = {
    name: "John Doe",
    summary: "Full-stack developer with 3 years of experience in MERN stack.",
    skills: ["React", "Node.js", "MongoDB", "Express"],
    experience: [
      { company: "TechCorp", role: "Frontend Developer", duration: "2 years" },
      { company: "Webify", role: "Full Stack Developer", duration: "1 year" },
    ],
    projects: [{ name: "Project A", description: "Task management system" }],
  };

  const mockJobDetails = {
    title: "MERN Stack Developer",
    company: "InnovateX",
    requirements: ["React", "Node.js", "MongoDB", "API design"],
  };

  try {
    const result = await generateCustomAnswers(
      mockQuestions,
      mockUserProfile,
      mockJobDetails
    );

    console.log("\n✅ Test Completed Successfully!");
    console.log("Generated Answers:\n", JSON.stringify(result, null, 2));

    if (Array.isArray(result) && result.length > 0) {
      console.log("✅ Passed: Result is a non-empty array");
    } else {
      console.error("❌ Failed: Result is empty or invalid");
    }
  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
  }
}

runTest();
