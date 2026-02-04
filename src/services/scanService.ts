import { prisma } from "../db/prisma";

export const createScan = async (projectId: string) => {
  return prisma.scan.create({
    data: {
      projectId,
      status: "queued"
    },
    select: {
      id: true,
      status: true,
      createdAt: true
    }
  });
};

export const listScansByProject = async (projectId: string) => {
  return prisma.scan.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      siteScore: true,
      totalPages: true,
      errorCount: true,
      startedAt: true,
      completedAt: true,
      createdAt: true
    }
  });
};
