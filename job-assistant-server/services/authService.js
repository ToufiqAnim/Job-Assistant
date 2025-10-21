import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = async (email, password) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  //   Hash password
  const hashesPassword = await bcrypt.hash(password, 10);

  const user = new User({
    email,
    password: hashesPassword,
  });
  await user.save();
  //   Generate JWT
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  return { token, userId: user._id };
};
export const AuthService = {
  registerUser,
};
