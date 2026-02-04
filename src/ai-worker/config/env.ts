import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  AI_ENRICHMENT_ENABLED: z
    .string()
    .default("false")
    .transform((value) => value.toLowerCase() === "true"),
  AI_ENRICHMENT_LIMIT: z.coerce.number().int().positive().default(10),
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_MODEL: z.string().min(1),
  OPENAI_BASE_URL: z.string().url().default("https://api.openai.com/v1"),
  OPENAI_TIMEOUT_MS: z.coerce.number().int().positive().default(15000)
});

export const aiWorkerEnv = envSchema.parse(process.env);
