export interface Scan {
  id: string;
  status: "queued" | "running" | "completed" | "failed";
  siteScore: number | null;
  totalPages: number | null;
  errorCount: number | null;
  createdAt: string;
}

interface ScansResponse {
  scans: Scan[];
}

export const fetchProjectScans = async (projectId: string): Promise<Scan[]> => {
  const response = await fetch(`/projects/${encodeURIComponent(projectId)}/scans`);

  if (!response.ok) {
    throw new Error("Failed to load project scans");
  }

  const data: ScansResponse = await response.json();
  return data.scans;
};
