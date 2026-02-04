export interface Issue {
  id: string;
  severity: "error" | "warning" | "info";
  category: string;
  title: string;
  affectedUrl: string;
  fixHint: string;
  impactScore: number;
}

interface IssuesResponse {
  issues: Issue[];
}

export const fetchScanIssues = async (scanId: string): Promise<Issue[]> => {
  const response = await fetch(`/scans/${encodeURIComponent(scanId)}/issues`);

  if (!response.ok) {
    throw new Error("Failed to load scan issues");
  }

  const data: IssuesResponse = await response.json();
  return data.issues;
};
