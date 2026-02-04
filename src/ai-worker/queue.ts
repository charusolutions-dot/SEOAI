import { Queue, Worker, JobsOptions } from "bullmq";
import IORedis from "ioredis";
import { aiWorkerEnv } from "./config/env";
import { processAiEnrichmentJob } from "./processor";

export const connection = new IORedis(aiWorkerEnv.REDIS_URL, {
  maxRetriesPerRequest: null
});

export const aiEnrichmentQueueName = "ai-enrichment-jobs";

export const aiEnrichmentJobOptions: JobsOptions = {
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 30_000
  },
  removeOnComplete: true,
  removeOnFail: false
};

export const aiEnrichmentQueue = new Queue(aiEnrichmentQueueName, {
  connection,
  defaultJobOptions: aiEnrichmentJobOptions
});

export const aiEnrichmentWorker = new Worker(
  aiEnrichmentQueueName,
  async (job) => {
    await processAiEnrichmentJob(job.data);
  },
  { connection }
);

aiEnrichmentWorker.on("failed", (job, error) => {
  console.error("[ai-worker] job failed", { jobId: job?.id, error });
});
