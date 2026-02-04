import type { CSSProperties } from "react";

interface CategoryScores {
  technical: number;
  indexability: number;
  content: number;
  performance: number;
}

interface IssueSummary {
  category: string;
  title: string;
  impactScore: number;
}

interface FixThisFirstBannerProps {
  categoryScores: CategoryScores;
  issues: IssueSummary[];
}

const bannerStyle: CSSProperties = {
  border: "1px solid #E5E7EB",
  borderRadius: 12,
  padding: 16,
  backgroundColor: "#F9FAFB",
  marginTop: 16
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 16,
  fontWeight: 600
};

const bodyStyle: CSSProperties = {
  marginTop: 8,
  color: "#4B5563",
  lineHeight: 1.5
};

const labelStyle: CSSProperties = {
  display: "inline-block",
  marginTop: 8,
  fontSize: 12,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  color: "#6B7280"
};

export const FixThisFirstBanner = ({ categoryScores, issues }: FixThisFirstBannerProps) => {
  const categoryEntries = Object.entries(categoryScores) as Array<[keyof CategoryScores, number]>;

  if (categoryEntries.length === 0) {
    return null;
  }

  const [lowestCategory, lowestScore] = categoryEntries.reduce(
    (lowest, current) => (current[1] < lowest[1] ? current : lowest),
    categoryEntries[0]
  );

  const matchingIssues = issues.filter((issue) => issue.category === lowestCategory);
  if (matchingIssues.length === 0) {
    return null;
  }

  const highestImpactIssue = matchingIssues.reduce(
    (highest, current) => (current.impactScore > highest.impactScore ? current : highest),
    matchingIssues[0]
  );

  const formattedCategory = `${lowestCategory.charAt(0).toUpperCase()}${lowestCategory.slice(1)}`;

  return (
    <section style={bannerStyle} aria-live="polite">
      <h2 style={titleStyle}>Fix this first: {formattedCategory}</h2>
      <div style={labelStyle}>Category score: {lowestScore}</div>
      <p style={bodyStyle}>
        The most impactful issue in this category is “{highestImpactIssue.title}”. Addressing it first
        should improve the overall {formattedCategory.toLowerCase()} health and make subsequent
        optimizations more effective.
      </p>
    </section>
  );
};
