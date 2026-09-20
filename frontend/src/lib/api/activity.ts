import { api } from "./axios";

export interface ActivityUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface ActivityProject {
  id: string;
  name: string;
}

export interface ActivityTask {
  id: string;
  title: string;
  status: string;
  priority: string;
}

export interface ActivityItem {
  id: string;
  projectId: string;
  taskId: string | null;
  userId: string;
  action: string;
  description: string;
  metadata?: unknown;
  createdAt: string;
  user: ActivityUser;
  project?: ActivityProject;
  task?: ActivityTask | null;
}

export async function getActivityFeed(limit = 20): Promise<ActivityItem[]> {
  const res = await api.get<{ success: boolean; data: ActivityItem[] }>(
    `/activities?limit=${limit}`
  );
  return res.data.data;
}

export async function getProjectActivity(
  projectId: string,
  limit = 20
): Promise<ActivityItem[]> {
  const res = await api.get<{ success: boolean; data: ActivityItem[] }>(
    `/activities/project/${projectId}?limit=${limit}`
  );
  return res.data.data;
}
