import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "../api/client";
import { createScan, fetchProjectScans, Scan } from "../api/scans";

interface UseProjectScansResult {
  scans: Scan[];
  isLoading: boolean;
  error: string | null;
  limitMessage: string | null;
  runScan: () => Promise<void>;
  isRunningScan: boolean;
}

const shouldPoll = (scans: Scan[]) =>
  scans.some((scan) => scan.status === "queued" || scan.status === "running");

export const useProjectScans = (projectId: string | undefined): UseProjectScansResult => {
  const [scans, setScans] = useState<Scan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limitMessage, setLimitMessage] = useState<string | null>(null);
  const [isRunningScan, setIsRunningScan] = useState(false);
  const pollTimer = useRef<number | null>(null);
  const hasLoadedOnce = useRef(false);

  const loadScans = useCallback(async () => {
    if (!projectId) {
      setScans([]);
      setError("Missing project reference.");
      return;
    }

    if (!hasLoadedOnce.current) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await fetchProjectScans(projectId);
      setScans(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      hasLoadedOnce.current = true;
      setIsLoading(false);
    }
  }, [projectId]);

  const runScan = useCallback(async () => {
    if (!projectId) {
      return;
    }

    setLimitMessage(null);
    setIsRunningScan(true);

    try {
      const result = await createScan(projectId);
      setScans((prev) => [
        {
          id: result.scanId,
          status: "queued",
          siteScore: null,
          totalPages: null,
          errorCount: null,
          createdAt: new Date().toISOString()
        },
        ...prev
      ]);
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.code === "SCAN_LIMIT_REACHED") {
        setLimitMessage("You’ve reached your free scan limit for this project this month.");
        return;
      }
      setError(apiError.message);
    } finally {
      setIsRunningScan(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadScans();
  }, [loadScans]);

  useEffect(() => {
    if (!projectId) {
      if (pollTimer.current) {
        window.clearInterval(pollTimer.current);
        pollTimer.current = null;
      }
      return;
    }

    if (shouldPoll(scans)) {
      if (!pollTimer.current) {
        pollTimer.current = window.setInterval(() => {
          loadScans();
        }, 5000);
      }
    } else if (pollTimer.current) {
      window.clearInterval(pollTimer.current);
      pollTimer.current = null;
    }

    return () => {
      if (pollTimer.current) {
        window.clearInterval(pollTimer.current);
        pollTimer.current = null;
      }
    };
  }, [projectId, scans, loadScans]);

  return { scans, isLoading, error, limitMessage, runScan, isRunningScan };
};
