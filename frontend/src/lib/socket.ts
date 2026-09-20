import { io, Socket } from "socket.io-client";
import { getAccessToken } from "./api/axios";

export interface ActivityBroadcastPayload {
  id: string;
  projectId: string;
  projectName: string;
  taskId: string | null;
  taskTitle: string | null;
  userId: string;
  userName: string;
  userEmail: string;
  action: string;
  description: string;
  metadata?: unknown;
  createdAt: string;
}

export interface TaskStatusUpdatedPayload {
  taskId: string;
  projectId: string;
  status: string;
  previousStatus: string;
  updatedById: string;
  updatedByName: string;
}

export interface NotificationBroadcastPayload {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  link: string | null;
  createdAt: string;
}

export interface NewNotificationEventPayload {
  notification: NotificationBroadcastPayload;
  unreadCount: number;
}

export interface PresenceCountPayload {
  activeUsersCount: number;
}

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8000";

let socketInstance: Socket | null = null;

export function getSocket(): Socket | null {
  return socketInstance;
}

export function initSocket(customToken?: string): Socket {
  const token = customToken || getAccessToken();

  if (socketInstance) {
    if (token) {
      socketInstance.auth = { token };
      if (!socketInstance.connected) {
        socketInstance.connect();
      }
    }
    return socketInstance;
  }

  socketInstance = io(SOCKET_URL, {
    auth: {
      token: token ?? "",
    },
    withCredentials: true,
    transports: ["websocket", "polling"],
    autoConnect: Boolean(token),
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  socketInstance.on("connect", () => {
    // Socket connected
  });

  socketInstance.on("connect_error", () => {
    // Socket connection error
  });

  socketInstance.on("disconnect", () => {
    // Socket disconnected
  });

  return socketInstance;
}

export function disconnectSocket(): void {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
}
