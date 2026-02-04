import { CrawlPageResult } from "./crawler";

export type IssueSeverity = "error" | "warning" | "info";

export interface IssueInput {
  affectedUrl: string;
  ruleCode: string;
  severity: IssueSeverity;
  category: string;
  title: string;
  description: string;
  fixHint: string;
  impactScore: number;
}

export interface RuleResult {
  issues: IssueInput[];
  siteScore: number;
  errorCount: number;
}

// Deterministic rule runner. Extend with real SEO checks as needed.
export const runSeoRules = (pages: CrawlPageResult[]): RuleResult => {
  const issues: IssueInput[] = [];
  let errorCount = 0;

  for (const page of pages) {
    const hasTitle = /<title>.*?<\/title>/i.test(page.html);
    if (!hasTitle) {
      issues.push({
        affectedUrl: page.url,
        ruleCode: "TITLE_MISSING",
        severity: "error",
        category: "metadata",
        title: "Missing title tag",
        description: "The page is missing a <title> tag.",
        fixHint: "Add a descriptive <title> tag to the page.",
        impactScore: 5
      });
      errorCount += 1;
    }

    const hasMetaDescription = /<meta\s+name=["']description["']/i.test(page.html);
    if (!hasMetaDescription) {
      issues.push({
        affectedUrl: page.url,
        ruleCode: "META_DESCRIPTION_MISSING",
        severity: "warning",
        category: "metadata",
        title: "Missing meta description",
        description: "The page is missing a meta description tag.",
        fixHint: "Add a concise meta description tag.",
        impactScore: 2
      });
    }
  }

  const siteScore = Math.max(0, 100 - errorCount * 5);

  return {
    issues,
    siteScore,
    errorCount
  };
};
