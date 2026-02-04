import { aiEnrichmentQueue, aiEnrichmentWorker } from "./queue";

const shutdown = async () => {
  await aiEnrichmentWorker.close();
  await aiEnrichmentQueue.close();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

console.log("[ai-worker] started");
