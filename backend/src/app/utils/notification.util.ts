import { prisma } from "../../lib/prisma.js";
import { sendRealtimeNotification } from "../../lib/socket.js";

export interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  link?: string | null;
}

export async function createAndEmitNotification(params: CreateNotificationParams): Promise<void> {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: params.userId,
        title: params.title,
        message: params.message,
        link: params.link ?? null,
      },
    });

    const unreadCount = await prisma.notification.count({
      where: { userId: params.userId, isRead: false },
    });

    sendRealtimeNotification(
      params.userId,
      {
        id: notification.id,
        userId: notification.userId,
        title: notification.title,
        message: notification.message,
        isRead: notification.isRead,
        link: notification.link,
        createdAt: notification.createdAt.toISOString(),
      },
      unreadCount
    );
  } catch (err) {
    console.error("Failed to create/emit notification:", err);
  }
}
