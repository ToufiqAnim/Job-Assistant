import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: String,
  url: String,
  rawDescription: String,
  parsed: {
    requirments: {
      mustHave: [String],
      niceToHave: [String],
      yearsOfExperience: Number,
    },
    responsibilities: [String],
    benefits: [String],
    technologies: [String],
    salary: {
      min: Number,
      max: Number,
      currency: String,
    },
  },
  status: {
    type: String,
    enum: [
      "saved",
      "analyzing",
      "ready",
      "applied",
      "interview",
      "rejected",
      "offer",
    ],
    default: "saved",
  },
  matchScore: Number,
  createdAt: { type: Date, default: Date.now },
});

const Job = mongoose.model("Job", jobSchema);

export default Job;
