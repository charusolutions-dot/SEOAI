import { prisma } from "../db/prisma";

export const listIssuesByScan = async (scanId: string) => {
  return prisma.issue.findMany({
    where: { scanId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      affectedUrl: true,
      ruleCode: true,
      severity: true,
      category: true,
      title: true,
      description: true,
      fixHint: true,
      impactScore: true,
      createdAt: true
    }
  });
};

export const assertScanOwnership = async (scanId: string, userId: string) => {
  const scan = await prisma.scan.findUnique({
    where: { id: scanId },
    select: { id: true, project: { select: { userId: true } } }
  });

  if (!scan) {
    const error = new Error("Scan not found");
    (error as Error & { status?: number }).status = 404;
    throw error;
  }

  if (scan.project.userId !== userId) {
    const error = new Error("Forbidden");
    (error as Error & { status?: number }).status = 403;
    throw error;
  }
};

export interface CsvIssueRow {
  id: string;
  severity: string;
  category: string;
  title: string;
  affectedUrl: string;
  fixHint: string;
  impactScore: number;
  aiExplanation: string | null;
}

const escapeCsvValue = (value: string) => `"${value.replace(/\"/g, "\"\"")}"`;

export const formatCsvRow = (values: Array<string | number | null>) => {
  const normalized = values.map((value) => (value ?? "").toString());
  return `${normalized.map(escapeCsvValue).join(",")}\n`;
};

export const iterateIssuesForCsv = async function* (
  scanId: string,
  batchSize = 500
): AsyncGenerator<CsvIssueRow> {
  let cursor: string | undefined;

  while (true) {
    const issues = await prisma.issue.findMany({
      where: { scanId },
      orderBy: { id: "asc" },
      take: batchSize,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      select: {
        id: true,
        severity: true,
        category: true,
        title: true,
        affectedUrl: true,
        fixHint: true,
        impactScore: true,
        aiExplanation: true
      }
    });

    if (issues.length === 0) {
      break;
    }

    for (const issue of issues) {
      yield issue;
    }

    cursor = issues[issues.length - 1].id;
  }
};
