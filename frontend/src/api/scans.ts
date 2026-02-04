import { request } from "./client";

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

interface CreateScanResponse {
  scanId: string;
  status: string;
}

export const fetchProjectScans = async (projectId: string): Promise<Scan[]> => {
  const data = await request<ScansResponse>(`/projects/${encodeURIComponent(projectId)}/scans`);
  return data.scans;
};

export const createScan = async (projectId: string): Promise<CreateScanResponse> => {
  return request<CreateScanResponse>(`/projects/${encodeURIComponent(projectId)}/scans`, {
    method: "POST"
  });
};
