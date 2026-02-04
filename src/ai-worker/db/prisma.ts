import { PrismaClient } from "@prisma/client";

export const aiWorkerPrisma = new PrismaClient({
  log: ["error", "warn"]
});
