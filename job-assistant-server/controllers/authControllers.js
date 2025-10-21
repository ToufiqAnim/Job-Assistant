import { AuthService } from "../services/authService.js";

const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, userId } = await AuthService.registerUser(email, password);
    res.status(201).json({ token, userId });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration Failed", error: error.message });
  }
};

export const AuthController = {
  registerUser,
};
