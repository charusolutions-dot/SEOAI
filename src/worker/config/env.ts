import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  SCAN_PAGE_LIMIT: z.coerce.number().int().positive().default(50)
});

export const workerEnv = envSchema.parse(process.env);
