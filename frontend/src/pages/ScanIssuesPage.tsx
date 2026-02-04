import type { CSSProperties } from "react";
import { useLocation, useParams } from "react-router-dom";
import { exportScanIssuesCsv, Issue } from "../api/issues";
import { CategoryScoreGrid } from "../components/CategoryScoreGrid";
import { FixThisFirstBanner } from "../components/FixThisFirstBanner";
import { SiteScoreCard } from "../components/SiteScoreCard";
import { useScanIssues } from "../hooks/useScanIssues";

const severityStyles: Record<string, CSSProperties> = {
  error: { backgroundColor: "#FEE2E2", color: "#991B1B" },
  warning: { backgroundColor: "#FEF3C7", color: "#92400E" },
  info: { backgroundColor: "#DBEAFE", color: "#1E40AF" }
};

const badgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "2px 8px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 600,
  textTransform: "uppercase"
};

const tableStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: 16
};

const cellStyle: CSSProperties = {
  borderBottom: "1px solid #E5E7EB",
  padding: "12px 8px",
  textAlign: "left",
  verticalAlign: "top"
};

const headerStyle: CSSProperties = {
  ...cellStyle,
  fontSize: 12,
  color: "#6B7280",
  textTransform: "uppercase",
  letterSpacing: "0.04em"
};

const bodyStyle: CSSProperties = {
  marginTop: 8,
  color: "#4B5563",
  lineHeight: 1.5
};

const exportButtonStyle: CSSProperties = {
  marginTop: 16
};

const scoreSectionStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 16,
  marginTop: 16
};

const normalizeCategory = (category: string) => category.toLowerCase();

const buildCategoryScores = (issues: Issue[]) => {
  const baseScores = {
    technical: 100,
    indexability: 100,
    content: 100,
    performance: 100
  };

  for (const issue of issues) {
    const key = normalizeCategory(issue.category);
    if (key in baseScores) {
      baseScores[key as keyof typeof baseScores] = Math.max(
        0,
        baseScores[key as keyof typeof baseScores] - issue.impactScore
      );
    }
  }

  return baseScores;
};

const calculateSiteScore = (scores: Record<string, number>) => {
  const values = Object.values(scores);
  if (values.length === 0) {
    return 0;
  }
  const total = values.reduce((sum, value) => sum + value, 0);
  return Math.round(total / values.length);
};

export const ScanIssuesPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const totalPages = (location.state as { totalPages?: number | null } | undefined)?.totalPages;
  const { issues, isLoading, error } = useScanIssues(id);

  if (!id) {
    return <div role="alert">Invalid scan reference.</div>;
  }

  if (isLoading) {
    return <div>Loading issues...</div>;
  }

  if (error) {
    return <div role="alert">{error}</div>;
  }

  const pagesLabel = totalPages ?? "—";
  const categoryScores = buildCategoryScores(issues);
  const siteScore = calculateSiteScore(categoryScores);

  const handleExport = async () => {
    const blob = await exportScanIssuesCsv(id);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `scan-${id}-issues.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section>
      <h1>Scan Issues</h1>
      <div style={bodyStyle}>Scanned {pagesLabel} pages (Free plan limit)</div>

      <div style={scoreSectionStyle}>
        <SiteScoreCard score={siteScore} />
      </div>

      <CategoryScoreGrid scores={categoryScores} />
      <FixThisFirstBanner categoryScores={categoryScores} issues={issues} />

      <button
        type="button"
        onClick={handleExport}
        disabled={issues.length === 0}
        style={exportButtonStyle}
      >
        Export CSV
      </button>

      {issues.length === 0 ? (
        <div style={bodyStyle}>No issues found for this scan.</div>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th scope="col" style={headerStyle}>Severity</th>
              <th scope="col" style={headerStyle}>Category</th>
              <th scope="col" style={headerStyle}>Title</th>
              <th scope="col" style={headerStyle}>Affected URL</th>
              <th scope="col" style={headerStyle}>Fix Hint</th>
              <th scope="col" style={headerStyle}>Impact Score</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue.id}>
                <td style={cellStyle}>
                  <span style={{ ...badgeStyle, ...severityStyles[issue.severity] }}>
                    {issue.severity}
                  </span>
                </td>
                <td style={cellStyle}>{issue.category}</td>
                <td style={cellStyle}>{issue.title}</td>
                <td style={cellStyle}>
                  <a href={issue.affectedUrl} target="_blank" rel="noopener noreferrer">
                    {issue.affectedUrl}
                  </a>
                </td>
                <td style={cellStyle}>{issue.fixHint}</td>
                <td style={cellStyle}>{issue.impactScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};
