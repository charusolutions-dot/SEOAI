import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "../api/client";
import { createProject, fetchProjects, Project } from "../api/projects";

interface UseProjectsResult {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  limitMessage: string | null;
  addProject: (payload: { name: string; url: string }) => Promise<void>;
}

export const useProjects = (): UseProjectsResult => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limitMessage, setLimitMessage] = useState<string | null>(null);
  const hasLoadedOnce = useRef(false);

  const loadProjects = useCallback(async () => {
    if (!hasLoadedOnce.current) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      hasLoadedOnce.current = true;
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const addProject = useCallback(async (payload: { name: string; url: string }) => {
    setLimitMessage(null);
    try {
      const project = await createProject(payload);
      setProjects((prev) => [project, ...prev]);
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.code === "PROJECT_LIMIT_REACHED") {
        setLimitMessage("Free plan allows up to 3 projects.");
        return;
      }
      setError(apiError.message);
    }
  }, []);

  return { projects, isLoading, error, limitMessage, addProject };
};
