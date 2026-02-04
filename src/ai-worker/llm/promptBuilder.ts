import { IssueSeverity } from "@prisma/client";

interface PromptIssueInput {
  ruleCode: string;
  category: string;
  severity: IssueSeverity;
  impactScore: number;
  affectedUrl: string;
  fixHint: string;
}

export const buildPromptMessages = (issue: PromptIssueInput) => {
  const system =
    "You are an SEO expert and technical writer. " +
    "Your task is to explain an existing SEO issue in clear, non-technical language. " +
    "You must explain why the issue matters, what can go wrong if it is ignored, and how to fix it using the provided fix_hint. " +
    "Never invent issues, never add new fixes, and never contradict the provided fix_hint. " +
    "Do not change severity or impact_score. " +
    "Output must be a single paragraph with no bullets, headings, URLs, emojis, or code blocks.";

  const user =
    "Explain the following SEO issue using ONLY the information provided.\n\n" +
    JSON.stringify({
      rule_code: issue.ruleCode,
      category: issue.category,
      severity: issue.severity,
      impact_score: issue.impactScore,
      affected_url: issue.affectedUrl,
      fix_hint: issue.fixHint
    });

  return [
    { role: "system" as const, content: system },
    { role: "user" as const, content: user }
  ];
};
