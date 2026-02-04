import { request } from "./client";

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
  const data = await request<ProjectsResponse>("/projects");
  return data.projects;
};

export const createProject = async (payload: { name: string; url: string }): Promise<Project> => {
  const data = await request<CreateProjectResponse>("/projects", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  return data.project;
};
