"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useUser } from "@/lib/hooks/useAuth";
import {
  initSocket,
  disconnectSocket,
  getSocket,
  type NewNotificationEventPayload,
  type TaskStatusUpdatedPayload,
  type PresenceCountPayload,
} from "@/lib/socket";

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  activeUsersCount: number;
  joinProject: (projectId: string) => void;
  leaveProject: (projectId: string) => void;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
  activeUsersCount: 1,
  joinProject: () => {},
  leaveProject: () => {},
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeUsersCount, setActiveUsersCount] = useState(1);

  useEffect(() => {
    if (!user) {
      disconnectSocket();
      setSocket(null);
      setIsConnected(false);
      return;
    }

    const s = initSocket();
    setSocket(s);

    if (s.connected) {
      setIsConnected(true);
    }

    const handleConnect = () => {
      setIsConnected(true);
      if (user.role === "ADMIN") {
        s.emit("presence:get");
      }
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handlePresenceCount = (payload: PresenceCountPayload) => {
      if (typeof payload?.activeUsersCount === "number") {
        setActiveUsersCount(payload.activeUsersCount);
      }
    };

    const handleNewNotification = (data: NewNotificationEventPayload) => {
      const { notification, unreadCount } = data;

      // Update TanStack query cache for unread count
      queryClient.setQueryData(["notifications", "unread-count"], {
        unreadCount,
      });

      // Invalidate notifications query to fetch latest list on dropdown open
      queryClient.invalidateQueries({ queryKey: ["notifications"] });

      // Trigger interactive Sonner notification
      toast(notification.title, {
        description: notification.message,
        duration: 5000,
        action: notification.link
          ? {
              label: "View",
              onClick: () => {
                window.location.href = notification.link!;
              },
            }
          : undefined,
      });
    };

    const handleTaskStatusUpdated = (payload: TaskStatusUpdatedPayload) => {
      // Invalidate task queries so Kanban board updates automatically across clients
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });

      // Notify if this status change was made by someone else
      if (payload.updatedById !== user.id) {
        toast.info("Task Board Updated", {
          description: `${payload.updatedByName} updated task status to ${payload.status.replace("_", " ")}`,
          duration: 3500,
        });
      }
    };

    const handleActivityLog = (payload: { action: string; description: string }) => {
      if (payload.action === "TASK_CREATED" || payload.action === "FLAGGED_OVERDUE") {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      }
    };

    s.on("connect", handleConnect);
    s.on("disconnect", handleDisconnect);
    s.on("presence:count", handlePresenceCount);
    s.on("notification:new", handleNewNotification);
    s.on("task:status_updated", handleTaskStatusUpdated);
    s.on("activity:new", handleActivityLog);

    // Initial check
    if (!s.connected) {
      s.connect();
    }

    return () => {
      s.off("connect", handleConnect);
      s.off("disconnect", handleDisconnect);
      s.off("presence:count", handlePresenceCount);
      s.off("notification:new", handleNewNotification);
      s.off("task:status_updated", handleTaskStatusUpdated);
      s.off("activity:new", handleActivityLog);
    };
  }, [user, queryClient]);

  const joinProject = (projectId: string) => {
    const s = getSocket();
    if (s && s.connected) {
      s.emit("project:join", { projectId });
    }
  };

  const leaveProject = (projectId: string) => {
    const s = getSocket();
    if (s && s.connected) {
      s.emit("project:leave", { projectId });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        activeUsersCount,
        joinProject,
        leaveProject,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
