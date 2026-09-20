"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTaskStatus,
  updateTask,
  deleteTask,
  getTeamMembers,
  type Task,
  type TaskFilterParams,
  type CreateTaskPayload,
  type TaskStatus,
  type TeamMember,
} from "../api/tasks";

export function useTasks(filters?: TaskFilterParams) {
  return useQuery<Task[], Error>({
    queryKey: ["tasks", filters],
    queryFn: () => getTasks(filters),
    staleTime: 10 * 1000,
  });
}

export function useTask(id: string) {
  return useQuery<Task, Error>({
    queryKey: ["tasks", "detail", id],
    queryFn: () => getTaskById(id),
    enabled: !!id,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, { projectId: string; payload: CreateTaskPayload }>({
    mutationFn: ({ projectId, payload }) => createTask(projectId, payload),
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Task created successfully", {
        description: `"${newTask.title}" is now added to the board.`,
      });
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const message = error.response?.data?.message || error.message || "Failed to create task";
      toast.error("Task creation failed", { description: message });
    },
  });
}

export function useChangeTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, { id: string; status: TaskStatus }>({
    mutationFn: ({ id, status }) => updateTaskStatus(id, status),
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Task status updated", {
        description: `"${updatedTask.title}" moved to ${updatedTask.status.replace("_", " ")}`,
      });
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const message = error.response?.data?.message || error.message || "Status change disallowed";
      toast.error("Permission Denied", { description: message });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, { id: string; payload: Partial<CreateTaskPayload & { status: TaskStatus }> }>({
    mutationFn: ({ id, payload }) => updateTask(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Task updated successfully");
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error("Failed to update task", {
        description: error.response?.data?.message || error.message,
      });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Task deleted successfully");
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error("Failed to delete task", {
        description: error.response?.data?.message || error.message,
      });
    },
  });
}

export function useTeamMembers() {
  return useQuery<TeamMember[], Error>({
    queryKey: ["team", "members"],
    queryFn: () => getTeamMembers(),
    staleTime: 60 * 1000,
  });
}
