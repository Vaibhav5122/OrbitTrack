"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAdminDashboard,
  getPmDashboard,
  getDeveloperDashboard,
  getUnreadNotificationsCount,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  updateTaskStatus,
  type AdminDashboardData,
  type PmDashboardData,
  type DeveloperDashboardData,
  type NotificationItem,
} from "../api/dashboard";

export function useAdminDashboard() {
  return useQuery<AdminDashboardData, Error>({
    queryKey: ["dashboard", "admin"],
    queryFn: () => getAdminDashboard(),
    staleTime: 30 * 1000,
  });
}

export function usePmDashboard() {
  return useQuery<PmDashboardData, Error>({
    queryKey: ["dashboard", "pm"],
    queryFn: () => getPmDashboard(),
    staleTime: 30 * 1000,
  });
}

export function useDeveloperDashboard() {
  return useQuery<DeveloperDashboardData, Error>({
    queryKey: ["dashboard", "developer"],
    queryFn: () => getDeveloperDashboard(),
    staleTime: 30 * 1000,
  });
}

export function useUnreadNotificationsCount() {
  return useQuery<{ unreadCount: number }, Error>({
    queryKey: ["notifications", "unread-count"],
    queryFn: () => getUnreadNotificationsCount(),
    staleTime: 15 * 1000,
  });
}

export function useNotifications() {
  return useQuery<NotificationItem[], Error>({
    queryKey: ["notifications", "list"],
    queryFn: () => getNotifications(),
    staleTime: 15 * 1000,
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { taskId: string; status: string }>({
    mutationFn: ({ taskId, status }) => updateTaskStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task status updated successfully");
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const message = error.response?.data?.message || error.message || "Failed to update task status";
      toast.error("Status update failed", { description: message });
    },
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: () => markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All notifications marked as read");
    },
  });
}
