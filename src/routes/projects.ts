import { Router } from "express";
import { z } from "zod";
import { authenticate, AuthenticatedRequest } from "../middleware/auth";
import { requireProjectOwnership } from "../middleware/ownership";
import { createProject, listProjects } from "../services/projectService";
import { createScan, listScansByProject } from "../services/scanService";

const router = Router();

const projectSchema = z.object({
  name: z.string().min(1),
  url: z.string().url()
});

router.post("/", authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { name, url } = projectSchema.parse(req.body);
    const project = await createProject(req.user!.id, name, url);
    res.status(201).json({ project });
  } catch (error) {
    next(error);
  }
});

router.get("/", authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const projects = await listProjects(req.user!.id);
    res.status(200).json({ projects });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/:projectId/scans",
  authenticate,
  requireProjectOwnership,
  async (req: AuthenticatedRequest, res, next) => {
  try {
    const { projectId } = req.params;
    const scan = await createScan(projectId);
    res.status(201).json({ scanId: scan.id, status: scan.status });
  } catch (error) {
    next(error);
  }
  }
);

router.get(
  "/:projectId/scans",
  authenticate,
  requireProjectOwnership,
  async (req: AuthenticatedRequest, res, next) => {
  try {
    const { projectId } = req.params;
    const scans = await listScansByProject(projectId);
    res.status(200).json({ scans });
  } catch (error) {
    next(error);
  }
  }
);

export default router;
