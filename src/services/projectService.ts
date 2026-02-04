import { prisma } from "../db/prisma";
import { normalizeUrl } from "../utils/normalizeUrl";

export const createProject = async (userId: string, name: string, url: string) => {
  const normalizedUrl = normalizeUrl(url);
  return prisma.project.create({
    data: {
      userId,
      name,
      url,
      normalizedUrl
    },
    select: {
      id: true,
      name: true,
      url: true,
      normalizedUrl: true,
      isActive: true,
      lastScanAt: true,
      createdAt: true,
      updatedAt: true
    }
  });
};

export const listProjects = async (userId: string) => {
  return prisma.project.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      url: true,
      normalizedUrl: true,
      isActive: true,
      lastScanAt: true,
      createdAt: true,
      updatedAt: true
    }
  });
};
