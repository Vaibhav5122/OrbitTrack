import type { Server as HttpServer } from "node:http";
import { Server, Socket } from "socket.io";
import { Role } from "@prisma/client";
import { envZod } from "../common/utils/envSanitization.js";
import { verifyAccessToken, type TokenUserPayload } from "../app/utils/token.util.js";
import { prisma } from "./prisma.js";

export interface SocketData {
  user: TokenUserPayload;
}

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
  metadata: unknown;
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

let io: Server | null = null;
const userSocketCounts = new Map<string, number>();

export function getLiveActiveUsersCount(): number {
  return userSocketCounts.size;
}

export function initSocketServer(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: envZod.CLIENT_ORIGIN ?? "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    },
  });

  io.use((socket: Socket, next: (err?: Error) => void) => {
    try {
      const authHeader = socket.handshake.headers.authorization;
      const rawToken =
        (socket.handshake.auth.token as string | undefined) ??
        (authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined);

      if (!rawToken) {
        return next(new Error("Authentication error: Token required"));
      }

      const decoded = verifyAccessToken(rawToken);
      socket.data.user = decoded;
      next();
    } catch {
      next(new Error("Authentication error: Invalid or expired token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const user = socket.data.user as TokenUserPayload | undefined;
    if (!user) {
      socket.disconnect();
      return;
    }

    const currentCount = userSocketCounts.get(user.id) ?? 0;
    userSocketCounts.set(user.id, currentCount + 1);

    socket.join(`user:${user.id}`);
    if (user.role === Role.ADMIN) {
      socket.join("admin_room");
      socket.emit("presence:count", { activeUsersCount: getLiveActiveUsersCount() });
    }

    if (currentCount === 0 && io) {
      io.to("admin_room").emit("presence:count", { activeUsersCount: getLiveActiveUsersCount() });
    }

    socket.on("project:join", async (data: { projectId?: string }) => {
      const projectId = data?.projectId;
      if (!projectId || typeof projectId !== "string") return;

      try {
        if (user.role === Role.ADMIN) {
          socket.join(`project:${projectId}`);
          socket.emit("project:joined", { projectId });
          return;
        }

        const project = await prisma.project.findUnique({
          where: { id: projectId },
          select: {
            id: true,
            ownerId: true,
            tasks: {
              where: { assignedToId: user.id },
              select: { id: true },
              take: 1,
            },
          },
        });

        if (!project) return;

        if (user.role === Role.PROJECT_MANAGER && project.ownerId === user.id) {
          socket.join(`project:${projectId}`);
          socket.emit("project:joined", { projectId });
          return;
        }

        if (user.role === Role.DEVELOPER && project.tasks.length > 0) {
          socket.join(`project:${projectId}`);
          socket.emit("project:joined", { projectId });
          return;
        }
      } catch (err) {
        console.error("Failed to join project room:", err);
      }
    });

    socket.on("project:leave", (data: { projectId?: string }) => {
      const projectId = data?.projectId;
      if (projectId && typeof projectId === "string") {
        socket.leave(`project:${projectId}`);
        socket.emit("project:left", { projectId });
      }
    });

    socket.on("presence:get", () => {
      if (user.role === Role.ADMIN) {
        socket.emit("presence:count", { activeUsersCount: getLiveActiveUsersCount() });
      }
    });

    socket.on("disconnect", () => {
      const activeCount = userSocketCounts.get(user.id) ?? 1;
      if (activeCount <= 1) {
        userSocketCounts.delete(user.id);
        if (io) {
          io.to("admin_room").emit("presence:count", { activeUsersCount: getLiveActiveUsersCount() });
        }
      } else {
        userSocketCounts.set(user.id, activeCount - 1);
      }
    });
  });

  return io;
}

export function getSocketServer(): Server | null {
  return io;
}

export function broadcastActivityLog(
  payload: ActivityBroadcastPayload,
  projectOwnerId: string,
  assignedToId: string | null
): void {
  if (!io) return;

  io.to(`project:${payload.projectId}`).emit("activity:new", payload);
  io.to("admin_room").emit("activity:new", payload);
  io.to(`user:${projectOwnerId}`).emit("activity:new", payload);

  if (assignedToId && assignedToId !== projectOwnerId) {
    io.to(`user:${assignedToId}`).emit("activity:new", payload);
  }
}

export function broadcastTaskStatusUpdate(
  payload: TaskStatusUpdatedPayload,
  projectOwnerId: string,
  assignedToId: string | null
): void {
  if (!io) return;

  io.to(`project:${payload.projectId}`).emit("task:status_updated", payload);
  io.to("admin_room").emit("task:status_updated", payload);
  io.to(`user:${projectOwnerId}`).emit("task:status_updated", payload);

  if (assignedToId && assignedToId !== projectOwnerId) {
    io.to(`user:${assignedToId}`).emit("task:status_updated", payload);
  }
}
