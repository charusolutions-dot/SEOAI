import { Router } from "express";
import { authenticate, AuthenticatedRequest } from "../middleware/auth";
import { requireScanOwnership } from "../middleware/ownership";
import {
  assertScanOwnership,
  formatCsvRow,
  iterateIssuesForCsv,
  listIssuesByScan
} from "../services/issueService";

const router = Router();

router.get(
  "/:scanId/issues",
  authenticate,
  requireScanOwnership,
  async (req: AuthenticatedRequest, res, next) => {
  try {
    const { scanId } = req.params;
    const issues = await listIssuesByScan(scanId);
    res.status(200).json({ issues });
  } catch (error) {
    next(error);
  }
  }
);

router.get("/:scanId/issues/export", authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { scanId } = req.params;
    await assertScanOwnership(scanId, req.user!.id);

    res.status(200);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="scan-${scanId}-issues.csv"`);

    res.write(
      formatCsvRow([
        "severity",
        "category",
        "title",
        "affected_url",
        "fix_hint",
        "impact_score",
        "ai_explanation"
      ])
    );

    for await (const issue of iterateIssuesForCsv(scanId)) {
      res.write(
        formatCsvRow([
          issue.severity,
          issue.category,
          issue.title,
          issue.affectedUrl,
          issue.fixHint,
          issue.impactScore,
          issue.aiExplanation
        ])
      );
    }

    res.end();
  } catch (error) {
    next(error);
  }
});

export default router;
