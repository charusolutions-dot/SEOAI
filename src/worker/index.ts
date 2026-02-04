import { scanQueue, scanWorker } from "./queue";
import { logInfo } from "./utils/logger";

const shutdown = async () => {
  logInfo("Shutting down worker");
  await scanWorker.close();
  await scanQueue.close();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

logInfo("Worker started");
