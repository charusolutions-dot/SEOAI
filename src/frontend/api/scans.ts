import { parseApiError } from "./apiError";
import { Scan } from "./projectScans";

interface CreateScanResponse {
  scanId: string;
  status: string;
}

export const createScan = async (projectId: string): Promise<CreateScanResponse> => {
  const response = await fetch(`/projects/${encodeURIComponent(projectId)}/scans`, {
    method: "POST"
  });

  if (!response.ok) {
    throw await parseApiError(response);
  }

  return response.json();
};

export const normalizeScanFromCreate = (scanId: string): Scan => ({
  id: scanId,
  status: "queued",
  siteScore: null,
  totalPages: null,
  errorCount: null,
  createdAt: new Date().toISOString()
});
