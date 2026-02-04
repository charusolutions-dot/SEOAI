import { aiWorkerPrisma } from "./db/prisma";
import { aiWorkerEnv } from "./config/env";
import { buildPromptMessages } from "./llm/promptBuilder";
import { generateCompletion } from "./llm/client";
import { isValidExplanation } from "./utils/validation";

interface EnrichmentPayload {
  scanId: string;
}

export const processAiEnrichmentJob = async (payload: EnrichmentPayload) => {
  const { scanId } = payload;

  const scan = await aiWorkerPrisma.scan.findUnique({
    where: { id: scanId },
    select: { id: true, status: true }
  });

  if (!scan || scan.status !== "completed") {
    return;
  }

  if (!aiWorkerEnv.AI_ENRICHMENT_ENABLED) {
    return;
  }

  const issues = await aiWorkerPrisma.issue.findMany({
    where: { scanId },
    orderBy: { impactScore: "desc" },
    take: aiWorkerEnv.AI_ENRICHMENT_LIMIT,
    select: {
      id: true,
      ruleCode: true,
      category: true,
      severity: true,
      impactScore: true,
      affectedUrl: true,
      fixHint: true,
      aiExplanation: true
    }
  });

  for (const issue of issues) {
    if (issue.aiExplanation) {
      continue;
    }

    try {
      const messages = buildPromptMessages({
        ruleCode: issue.ruleCode,
        category: issue.category,
        severity: issue.severity,
        impactScore: issue.impactScore,
        affectedUrl: issue.affectedUrl,
        fixHint: issue.fixHint
      });

      const response = await generateCompletion(messages);
      if (!isValidExplanation(response)) {
        continue;
      }

      await aiWorkerPrisma.issue.update({
        where: { id: issue.id },
        data: { aiExplanation: response }
      });
    } catch {
      // Skip failures per issue to keep job resilient and retry-safe.
      continue;
    }
  }
};
