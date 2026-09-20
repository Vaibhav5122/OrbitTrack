import { api } from "./axios";
import type { ApiResponse } from "./auth";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  isOverdue: boolean;
  projectId: string;
  assignedToId?: string | null;
  createdAt: string;
  updatedAt: string;
  project: {
    id: string;
    name: string;
    ownerId: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

export interface TaskFilterParams {
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId?: string;
  assignedToId?: string;
  isOverdue?: boolean;
  dueDateFrom?: string;
  dueDateTo?: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate: string;
  assignedToId?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

export async function getTasks(filters?: TaskFilterParams): Promise<Task[]> {
  const params: Record<string, string> = {};
  if (filters?.status) params.status = filters.status;
  if (filters?.priority) params.priority = filters.priority;
  if (filters?.projectId) params.projectId = filters.projectId;
  if (filters?.assignedToId) params.assignedToId = filters.assignedToId;
  if (typeof filters?.isOverdue === "boolean") params.isOverdue = String(filters.isOverdue);
  if (filters?.dueDateFrom) params.dueDateFrom = filters.dueDateFrom;
  if (filters?.dueDateTo) params.dueDateTo = filters.dueDateTo;

  const response = await api.get<ApiResponse<Task[]>>("/tasks", { params });
  return response.data.data;
}

export async function getTaskById(id: string): Promise<Task> {
  const response = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
  return response.data.data;
}

export async function createTask(projectId: string, payload: CreateTaskPayload): Promise<Task> {
  const response = await api.post<ApiResponse<Task>>(`/tasks/project/${projectId}`, payload);
  return response.data.data;
}

export async function updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
  const response = await api.patch<ApiResponse<Task>>(`/tasks/${id}/status`, { status });
  return response.data.data;
}

export async function updateTask(id: string, payload: Partial<CreateTaskPayload & { status: TaskStatus }>): Promise<Task> {
  const response = await api.patch<ApiResponse<Task>>(`/tasks/${id}`, payload);
  return response.data.data;
}

export async function deleteTask(id: string): Promise<void> {
  await api.delete(`/tasks/${id}`);
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const response = await api.get<ApiResponse<TeamMember[]>>("/auth/team");
  return response.data.data;
}
