import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../common/utils/ApiError.js";
import { ApiResponse } from "../../common/utils/ApiResponse.js";

export class NotificationController {
  public async handleGetNotifications(req: Request, res: Response) {
    const user = req.user;
    if (!user) {
      throw ApiError.unauthorized("Authentication required");
    }

    const unreadOnly = req.query.unreadOnly === "true";
    const limitParam = typeof req.query.limit === "string" ? req.query.limit : undefined;
    const limit = Math.min(
      Math.max(parseInt(limitParam ?? "20", 10) || 20, 1),
      50,
    );

    const notifications = await prisma.notification.findMany({
      where: {
        userId: user.id,
        ...(unreadOnly ? { isRead: false } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return ApiResponse.ok(res, "Notifications fetched successfully", notifications);
  }

  public async handleGetUnreadCount(req: Request, res: Response) {
    const user = req.user;
    if (!user) {
      throw ApiError.unauthorized("Authentication required");
    }

    const unreadCount = await prisma.notification.count({
      where: {
        userId: user.id,
        isRead: false,
      },
    });

    return ApiResponse.ok(res, "Unread count fetched successfully", { unreadCount });
  }

  public async handleMarkAsRead(req: Request, res: Response) {
    const user = req.user;
    if (!user) {
      throw ApiError.unauthorized("Authentication required");
    }

    const id = req.params.id;
    if (!id || typeof id !== "string") {
      throw ApiError.badRequest("Valid Notification ID is required");
    }

    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw ApiError.notFound("Notification not found");
    }

    if (notification.userId !== user.id) {
      throw ApiError.forbidden("Access denied: You cannot modify another user's notification");
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return ApiResponse.ok(res, "Notification marked as read", updated);
  }

  public async handleMarkAllAsRead(req: Request, res: Response) {
    const user = req.user;
    if (!user) {
      throw ApiError.unauthorized("Authentication required");
    }

    await prisma.notification.updateMany({
      where: {
        userId: user.id,
        isRead: false,
      },
      data: { isRead: true },
    });

    return ApiResponse.ok(res, "All notifications marked as read", null);
  }
}
