import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile: {
    name: String,
    phone: Number,
    location: String,
    linkedIn: String,
    github: String,
    portfolio: String,
  },
  masterResume: {
    summary: String,
    experience: [
      {
        title: String,
        company: String,
        location: String,
        startDate: Date,
        endDate: Date,
        description: [String],
        achivements: [String],
      },
    ],
    education: [
      {
        school: String,
        degree: String,
        graduationDate: Date,
        gpa: String,
      },
    ],
    skills: {
      technical: [String],
      soft: [String],
      languages: [String],
    },
    projects: [
      {
        title: String,
        description: String,
        link: String,
        technologies: [String],
        link: String,
        github: String,
      },
    ],
    certifications: [
      {
        title: String,
        company: String,
        date: Date,
        link: String,
      },
    ],
  },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);
export default User;
