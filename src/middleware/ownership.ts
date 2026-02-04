import { NextFunction, Response } from "express";
import { prisma } from "../db/prisma";
import { AuthenticatedRequest } from "./auth";

export const requireProjectOwnership = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { projectId } = req.params;
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, userId: true }
    });

    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    if (project.userId !== req.user!.id) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const requireScanOwnership = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { scanId } = req.params;
    const scan = await prisma.scan.findFirst({
      where: {
        id: scanId,
        project: {
          userId: req.user!.id
        }
      },
      select: { id: true }
    });

    if (!scan) {
      res.status(404).json({ error: "Scan not found" });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};
