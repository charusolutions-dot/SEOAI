import { PrismaClient } from "@prisma/client";

export const workerPrisma = new PrismaClient({
  log: ["error", "warn"]
});
