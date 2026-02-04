import { Router } from "express";
import { z } from "zod";
import { loginUser, registerUser } from "../services/authService";

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = registerSchema.parse(req.body);
    const user = await registerUser(email, password);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await loginUser(email, password);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
