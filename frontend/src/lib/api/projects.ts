import { api } from "./axios";
import type { ApiResponse } from "./auth";

export interface Client {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  clientId: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  client: Client;
  owner: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  _count?: {
    tasks: number;
  };
}

export interface CreateProjectPayload {
  name: string;
  description?: string;
  clientId: string;
}

export async function getProjects(): Promise<Project[]> {
  const response = await api.get<ApiResponse<Project[]>>("/projects");
  return response.data.data;
}

export async function getProjectById(id: string): Promise<Project> {
  const response = await api.get<ApiResponse<Project>>(`/projects/${id}`);
  return response.data.data;
}

export async function createProject(payload: CreateProjectPayload): Promise<Project> {
  const response = await api.post<ApiResponse<Project>>("/projects", payload);
  return response.data.data;
}

export async function getClients(): Promise<Client[]> {
  const response = await api.get<ApiResponse<Client[]>>("/clients");
  return response.data.data;
}
