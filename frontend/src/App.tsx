import type { CSSProperties } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ProjectScansPage } from "./pages/ProjectScansPage";
import { ScanIssuesPage } from "./pages/ScanIssuesPage";

const appStyle: CSSProperties = {
  maxWidth: 960,
  margin: "0 auto",
  padding: "24px 16px",
  fontFamily: "Inter, system-ui, -apple-system, sans-serif"
};

export const App = () => {
  return (
    <div style={appStyle}>
      <Routes>
        <Route path="/" element={<ProjectsPage />} />
        <Route path="/projects/:id/scans" element={<ProjectScansPage />} />
        <Route path="/scans/:id/issues" element={<ScanIssuesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};
