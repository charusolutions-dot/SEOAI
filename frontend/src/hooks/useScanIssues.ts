import { useEffect, useMemo, useState } from "react";
import { fetchScanIssues, Issue } from "../api/issues";

interface UseScanIssuesResult {
  issues: Issue[];
  isLoading: boolean;
  error: string | null;
}

export const useScanIssues = (scanId: string | undefined): UseScanIssuesResult => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!scanId) {
      setIssues([]);
      setError("Missing scan reference.");
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    fetchScanIssues(scanId)
      .then((data) => {
        if (isMounted) {
          setIssues(data);
        }
      })
      .catch((err: Error) => {
        if (isMounted) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [scanId]);

  const sortedIssues = useMemo(() => {
    return [...issues].sort((a, b) => b.impactScore - a.impactScore);
  }, [issues]);

  return { issues: sortedIssues, isLoading, error };
};
