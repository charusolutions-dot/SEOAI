import { workerPrisma } from "./db/prisma";
import { crawlSite } from "./crawler";
import { runSeoRules } from "./rules";
import { logError, logInfo } from "./utils/logger";
import { workerEnv } from "./config/env";

interface ScanJobPayload {
  scanId: string;
  projectId: string;
}

export const processScanJob = async (payload: ScanJobPayload) => {
  const { scanId, projectId } = payload;

  const scan = await workerPrisma.scan.findUnique({
    where: { id: scanId },
    select: { id: true, status: true, projectId: true }
  });

  if (!scan || scan.projectId !== projectId) {
    logError("Scan not found or project mismatch", { scanId, projectId });
    throw new Error("Scan not found");
  }

  // Idempotency: if already completed, exit immediately.
  if (scan.status === "completed") {
    logInfo("Scan already completed, skipping", { scanId });
    return;
  }

  const project = await workerPrisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, url: true }
  });

  if (!project) {
    await workerPrisma.scan.update({
      where: { id: scanId },
      data: { status: "failed" }
    });
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  const rootFetch = await fetch(project.url, {
    redirect: "follow",
    headers: { "User-Agent": "SEOAI-Worker/1.0" },
    signal: controller.signal
  }).catch(() => null);
  clearTimeout(timeout);

  if (!rootFetch || !rootFetch.ok) {
    await workerPrisma.scan.update({
      where: { id: scanId },
      data: { status: "failed" }
    });
    return;
  }

  await workerPrisma.scan.update({
    where: { id: scanId },
    data: {
      status: "running",
      startedAt: new Date()
    }
  });

  try {
    const pages = await crawlSite(project.url, workerEnv.SCAN_PAGE_LIMIT);
    const ruleResult = runSeoRules(pages);

    // Idempotency: delete existing issues before inserting new ones.
    await workerPrisma.issue.deleteMany({ where: { scanId } });

    if (ruleResult.issues.length > 0) {
      await workerPrisma.issue.createMany({
        data: ruleResult.issues.map((issue) => ({
          scanId,
          affectedUrl: issue.affectedUrl,
          ruleCode: issue.ruleCode,
          severity: issue.severity,
          category: issue.category,
          title: issue.title,
          description: issue.description,
          fixHint: issue.fixHint,
          impactScore: issue.impactScore
        }))
      });
    }

    await workerPrisma.scan.update({
      where: { id: scanId },
      data: {
        status: "completed",
        completedAt: new Date(),
        siteScore: ruleResult.siteScore,
        totalPages: pages.length,
        errorCount: ruleResult.errorCount
      }
    });
  } catch (error) {
    await workerPrisma.scan.update({
      where: { id: scanId },
      data: { status: "failed" }
    });
    throw error;
  }
};
