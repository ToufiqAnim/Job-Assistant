import express from "express";
import { AuthController } from "../controllers/authControllers.js";

const router = express.Router();

router.post("/register", AuthController.registerUser);
// router.post("/login");

export default router;
