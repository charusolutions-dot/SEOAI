import { request, requestBlob } from "./client";

export interface Issue {
  id: string;
  severity: "error" | "warning" | "info";
  category: string;
  title: string;
  affectedUrl: string;
  fixHint: string;
  impactScore: number;
  description?: string;
}

interface IssuesResponse {
  issues: Issue[];
}

export const fetchScanIssues = async (scanId: string): Promise<Issue[]> => {
  const data = await request<IssuesResponse>(`/scans/${encodeURIComponent(scanId)}/issues`);
  return data.issues;
};

export const exportScanIssuesCsv = async (scanId: string): Promise<Blob> => {
  return requestBlob(`/scans/${encodeURIComponent(scanId)}/issues/export.csv`);
};
