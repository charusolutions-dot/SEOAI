import { Router } from "express";
import authRoutes from "./auth";
import projectRoutes from "./projects";
import issueRoutes from "./issues";

const router = Router();

router.use("/auth", authRoutes);
router.use("/projects", projectRoutes);
router.use("/scans", issueRoutes);

export default router;
