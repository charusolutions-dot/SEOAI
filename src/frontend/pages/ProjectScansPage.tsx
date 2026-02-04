import type { CSSProperties } from "react";
import { Link, useParams } from "react-router-dom";
import { useProjectScans } from "../hooks/useProjectScans";

const MAX_SCANS_PER_MONTH = 5;
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

const statusStyles: Record<string, CSSProperties> = {
  queued: { backgroundColor: "#E0E7FF", color: "#3730A3" },
  running: { backgroundColor: "#FEF3C7", color: "#92400E" },
  completed: { backgroundColor: "#DCFCE7", color: "#166534" },
  failed: { backgroundColor: "#FEE2E2", color: "#991B1B" }
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

const helperStyle: CSSProperties = {
  marginTop: 8,
  fontSize: 13,
  color: "#6B7280"
};

export const ProjectScansPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { scans, isLoading, error, limitMessage, runScan, isRunningScan } = useProjectScans(projectId);

  if (!projectId) {
    return <div role="alert">Invalid project reference.</div>;
  }

  const limitReached = scans.length >= MAX_SCANS_PER_MONTH;
  const helperText =
    limitMessage ?? (limitReached ? "You’ve reached your free scan limit for this project this month." : null);

  if (isLoading) {
    return <div>Loading scans...</div>;
  }

  if (error) {
    return <div role="alert">{error}</div>;
  }

  return (
    <section>
      <h1>Project Scans</h1>
      <button
        type="button"
        onClick={() => runScan()}
        disabled={limitReached || isRunningScan}
      >
        Run Scan
      </button>
      {helperText ? <div style={helperStyle}>{helperText}</div> : null}
      {scans.length === 0 ? (
        <div>No scans available for this project.</div>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th scope="col" style={headerStyle}>Status</th>
              <th scope="col" style={headerStyle}>Site Score</th>
              <th scope="col" style={headerStyle}>Total Pages</th>
              <th scope="col" style={headerStyle}>Error Count</th>
              <th scope="col" style={headerStyle}>Created At</th>
              <th scope="col" style={headerStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {scans.map((scan) => (
              <tr key={scan.id}>
                <td style={cellStyle}>
                  <span style={{ ...badgeStyle, ...statusStyles[scan.status] }}>
                    {scan.status}
                  </span>
                </td>
                <td style={cellStyle}>{scan.siteScore ?? "-"}</td>
                <td style={cellStyle}>{scan.totalPages ?? "-"}</td>
                <td style={cellStyle}>{scan.errorCount ?? "-"}</td>
                <td style={cellStyle}>{new Date(scan.createdAt).toLocaleString()}</td>
                <td style={cellStyle}>
                  <Link to={`/scans/${scan.id}/issues`} state={{ totalPages: scan.totalPages }}>
                    View Issues
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};
