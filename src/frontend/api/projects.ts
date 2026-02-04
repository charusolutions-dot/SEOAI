import { parseApiError } from "./apiError";

export interface Project {
  id: string;
  name: string;
  url: string;
  normalizedUrl: string;
  isActive: boolean;
  lastScanAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ProjectsResponse {
  projects: Project[];
}

interface CreateProjectResponse {
  project: Project;
}

export const fetchProjects = async (): Promise<Project[]> => {
  const response = await fetch("/projects");

  if (!response.ok) {
    throw await parseApiError(response);
  }

  const data: ProjectsResponse = await response.json();
  return data.projects;
};

export const createProject = async (payload: { name: string; url: string }): Promise<Project> => {
  const response = await fetch("/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw await parseApiError(response);
  }

  const data: CreateProjectResponse = await response.json();
  return data.project;
};
