"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getActivityFeed,
  getProjectActivity,
  type ActivityItem,
} from "@/lib/api/activity";
import { useSocket } from "@/components/providers/socket-provider";
import type { ActivityBroadcastPayload } from "@/lib/socket";

export function useActivityFeed(limit = 20) {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  const query = useQuery<ActivityItem[], Error>({
    queryKey: ["activities", "feed", limit],
    queryFn: () => getActivityFeed(limit),
    staleTime: 30 * 1000,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (!socket) return;

    const handleNewActivity = (payload: ActivityBroadcastPayload) => {
      const incomingItem: ActivityItem = {
        id: payload.id,
        projectId: payload.projectId,
        taskId: payload.taskId,
        userId: payload.userId,
        action: payload.action,
        description: payload.description,
        metadata: payload.metadata,
        createdAt: payload.createdAt,
        user: {
          id: payload.userId,
          name: payload.userName,
          email: payload.userEmail,
          role: "USER",
        },
        project: {
          id: payload.projectId,
          name: payload.projectName,
        },
        task: payload.taskId
          ? {
              id: payload.taskId,
              title: payload.taskTitle || "Task",
              status: "UPDATED",
              priority: "MEDIUM",
            }
          : null,
      };

      queryClient.setQueryData<ActivityItem[]>(
        ["activities", "feed", limit],
        (old = []) => {
          // Check if already exists
          if (old.some((item) => item.id === incomingItem.id)) {
            return old;
          }
          return [incomingItem, ...old].slice(0, 50);
        }
      );
    };

    socket.on("activity:new", handleNewActivity);

    return () => {
      socket.off("activity:new", handleNewActivity);
    };
  }, [socket, queryClient, limit]);

  return query;
}

export function useProjectActivity(projectId: string, limit = 20) {
  const queryClient = useQueryClient();
  const { socket, joinProject, leaveProject } = useSocket();

  const query = useQuery<ActivityItem[], Error>({
    queryKey: ["activities", "project", projectId, limit],
    queryFn: () => getProjectActivity(projectId, limit),
    enabled: Boolean(projectId),
    staleTime: 30 * 1000,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (!projectId) return;
    joinProject(projectId);

    return () => {
      leaveProject(projectId);
    };
  }, [projectId, joinProject, leaveProject]);

  useEffect(() => {
    if (!socket || !projectId) return;

    const handleNewActivity = (payload: ActivityBroadcastPayload) => {
      if (payload.projectId !== projectId) return;

      const incomingItem: ActivityItem = {
        id: payload.id,
        projectId: payload.projectId,
        taskId: payload.taskId,
        userId: payload.userId,
        action: payload.action,
        description: payload.description,
        metadata: payload.metadata,
        createdAt: payload.createdAt,
        user: {
          id: payload.userId,
          name: payload.userName,
          email: payload.userEmail,
          role: "USER",
        },
        project: {
          id: payload.projectId,
          name: payload.projectName,
        },
        task: payload.taskId
          ? {
              id: payload.taskId,
              title: payload.taskTitle || "Task",
              status: "UPDATED",
              priority: "MEDIUM",
            }
          : null,
      };

      queryClient.setQueryData<ActivityItem[]>(
        ["activities", "project", projectId, limit],
        (old = []) => {
          if (old.some((item) => item.id === incomingItem.id)) {
            return old;
          }
          return [incomingItem, ...old].slice(0, 50);
        }
      );
    };

    socket.on("activity:new", handleNewActivity);

    return () => {
      socket.off("activity:new", handleNewActivity);
    };
  }, [socket, queryClient, projectId, limit]);

  return query;
}
