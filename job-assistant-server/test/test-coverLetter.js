import { generateCoverLetter } from "../agents/writer/coverLetterGenerator.js";

const userProfile = {
  name: "Toufiq Anim",
  location: "Dhaka, Bangladesh",
};

const jobDetails = {
  title: "Frontend Developer",
  company: "TechNova",
  location: "Remote",
  requirements: ["React", "Next.js", "REST APIs"],
  responsibilities: [
    "Build UI",
    "Collaborate with backend",
    "Optimize performance",
  ],
};

const tailoredResume = {
  summary: "MERN stack developer with focus on interactive UI and performance.",
  skills: {
    technical: [
      "React",
      "Next.js",
      "MongoDB",
      "Express",
      "Node.js",
      "TailwindCSS",
    ],
  },
  experience: [
    {
      title: "Frontend Developer",
      company: "DevCollab",
      achievements: [
        "Built real-time collaborative UI",
        "Improved load speed by 40%",
      ],
    },
  ],
};

const run = async () => {
  const coverLetter = await generateCoverLetter(
    userProfile,
    jobDetails,
    tailoredResume
  );
  console.log("\n📝 Generated Cover Letter:\n");
  console.log(coverLetter);
};

run();
