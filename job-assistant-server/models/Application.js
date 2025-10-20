import mongoose from "mongoose";
const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  tailoredResume: {
    content: Object,
    version: Number,
    generatedAt: Date,
  },
  coverLetter: {
    content: String,
    version: Number,
    generatedAt: Date,
  },
  interviewPrep: {
    questions: [
      {
        question: String,
        category: String,
        suggestedAnswers: String,
        tips: [String],
      },
    ],
    companyRecharch: String,
    generatedAt: Date,
  },
  gapAnalysis: {
    strengths: [String],
    gaps: [String],
    recommendations: [String],
  },
  appliedAt: Date,
  followUpDate: Date,
  notes: String,
  createdAt: { type: Date, default: Date.now },
});

const Application = mongoose.model("Application", applicationSchema);

export default Application;
