import { api } from "./axios";
import type { ApiResponse } from "./auth";

export interface AdminDashboardData {
  totalProjects: number;
  totalUsers: number;
  tasksByStatus: {
    TODO: number;
    IN_PROGRESS: number;
    IN_REVIEW: number;
    DONE: number;
  };
  overdueTaskCount: number;
  activeUsersCount: number;
}

export interface ProjectSummary {
  id: string;
  name: string;
  clientName: string;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  progressPercentage: number;
}

export interface UpcomingTask {
  id: string;
  title: string;
  dueDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
  isOverdue: boolean;
  project: { id: string; name: string };
  assignedTo?: { id: string; name: string; email: string } | null;
}

export interface PmDashboardData {
  projectsSummary: ProjectSummary[];
  tasksByPriority: {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
    CRITICAL: number;
  };
  upcomingDueDatesThisWeek: UpcomingTask[];
}

export interface DeveloperTask {
  id: string;
  title: string;
  description?: string | null;
  status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  dueDate: string;
  isOverdue: boolean;
  createdAt: string;
  project: { id: string; name: string };
}

export interface DeveloperDashboardData {
  metrics: {
    totalAssigned: number;
    completedCount: number;
    overdueCount: number;
    inProgressCount: number;
  };
  tasks: DeveloperTask[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  userId: string;
}

export async function getAdminDashboard(): Promise<AdminDashboardData> {
  const response = await api.get<ApiResponse<AdminDashboardData>>("/dashboard/admin");
  return response.data.data;
}

export async function getPmDashboard(): Promise<PmDashboardData> {
  const response = await api.get<ApiResponse<PmDashboardData>>("/dashboard/pm");
  return response.data.data;
}

export async function getDeveloperDashboard(): Promise<DeveloperDashboardData> {
  const response = await api.get<ApiResponse<DeveloperDashboardData>>("/dashboard/developer");
  return response.data.data;
}

export async function getUnreadNotificationsCount(): Promise<{ unreadCount: number }> {
  const response = await api.get<ApiResponse<{ unreadCount: number }>>("/notifications/unread-count");
  return response.data.data;
}

export async function getNotifications(): Promise<NotificationItem[]> {
  const response = await api.get<ApiResponse<NotificationItem[]>>("/notifications");
  return response.data.data;
}

export async function markNotificationAsRead(id: string): Promise<void> {
  await api.patch(`/notifications/${id}/read`);
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await api.patch("/notifications/mark-all-read");
}

export async function updateTaskStatus(taskId: string, status: string): Promise<void> {
  await api.patch(`/tasks/${taskId}/status`, { status });
}
