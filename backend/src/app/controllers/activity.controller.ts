import type { Request, Response } from "express";
import { Role } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../common/utils/ApiError.js";
import { ApiResponse } from "../../common/utils/ApiResponse.js";

export class ActivityLogController {
  public async handleGetActivityFeed(req: Request, res: Response) {
    const user = req.user;
    if (!user) {
      throw ApiError.unauthorized("Authentication required");
    }

    const limitParam = typeof req.query.limit === "string" ? req.query.limit : undefined;
    const limit = Math.min(
      Math.max(parseInt(limitParam ?? "20", 10) || 20, 1),
      50,
    );

    let whereClause: Record<string, unknown> = {};

    if (user.role === Role.ADMIN) {
      whereClause = {};
    } else if (user.role === Role.PROJECT_MANAGER) {
      whereClause = {
        project: {
          ownerId: user.id,
        },
      };
    } else if (user.role === Role.DEVELOPER) {
      whereClause = {
        task: {
          assignedToId: user.id,
        },
      };
    }

    const activities = await prisma.activityLog.findMany({
      where: whereClause,
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
        project: {
          select: { id: true, name: true },
        },
        task: {
          select: { id: true, title: true, status: true, priority: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return ApiResponse.ok(res, "Activity feed fetched successfully", activities);
  }

  public async handleGetProjectActivity(req: Request, res: Response) {
    const user = req.user;
    if (!user) {
      throw ApiError.unauthorized("Authentication required");
    }

    const projectId = req.params.projectId;
    if (!projectId || typeof projectId !== "string") {
      throw ApiError.badRequest("Valid Project ID is required");
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        tasks: {
          select: { assignedToId: true },
        },
      },
    });

    if (!project) {
      throw ApiError.notFound("Project not found");
    }

    if (user.role === Role.PROJECT_MANAGER && project.ownerId !== user.id) {
      throw ApiError.forbidden("Access denied: You cannot view activity for another PM's project");
    }

    if (user.role === Role.DEVELOPER) {
      const isAssigned = project.tasks.some((t) => t.assignedToId === user.id);
      if (!isAssigned) {
        throw ApiError.forbidden("Access denied: You are not assigned to this project");
      }
    }

    const limitParam = typeof req.query.limit === "string" ? req.query.limit : undefined;
    const limit = Math.min(
      Math.max(parseInt(limitParam ?? "20", 10) || 20, 1),
      50,
    );

    const activities = await prisma.activityLog.findMany({
      where: { projectId },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
        task: {
          select: { id: true, title: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return ApiResponse.ok(res, "Project activity fetched successfully", activities);
  }
}
