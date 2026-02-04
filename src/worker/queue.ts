import { Queue, Worker, JobsOptions } from "bullmq";
import IORedis from "ioredis";
import { workerEnv } from "./config/env";
import { processScanJob } from "./scanProcessor";
import { logError, logInfo } from "./utils/logger";

export const connection = new IORedis(workerEnv.REDIS_URL, {
  maxRetriesPerRequest: null
});

export const scanQueueName = "scan-jobs";

export const scanJobOptions: JobsOptions = {
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 30_000
  },
  removeOnComplete: true,
  removeOnFail: false
};

export const scanQueue = new Queue(scanQueueName, {
  connection,
  defaultJobOptions: scanJobOptions
});

export const scanWorker = new Worker(
  scanQueueName,
  async (job) => {
    await processScanJob(job.data);
  },
  { connection }
);

scanWorker.on("completed", (job) => {
  logInfo("Scan job completed", { jobId: job.id });
});

scanWorker.on("failed", (job, error) => {
  logError("Scan job failed", { jobId: job?.id, error });
});
