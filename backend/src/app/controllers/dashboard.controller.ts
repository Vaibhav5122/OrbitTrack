import type { Request, Response } from "express";
import { Role, TaskPriority, TaskStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../common/utils/ApiError.js";
import { ApiResponse } from "../../common/utils/ApiResponse.js";
import { getLiveActiveUsersCount } from "../../lib/socket.js";

export class DashboardController {
  public async handleGetAdminDashboard(req: Request, res: Response) {
    const user = req.user;
    if (!user || user.role !== Role.ADMIN) {
      throw ApiError.forbidden("Access denied: Admin role required");
    }

    const [
      totalProjects,
      totalUsers,
      todoCount,
      inProgressCount,
      inReviewCount,
      doneCount,
      overdueCount,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.user.count(),
      prisma.task.count({ where: { status: TaskStatus.TODO } }),
      prisma.task.count({ where: { status: TaskStatus.IN_PROGRESS } }),
      prisma.task.count({ where: { status: TaskStatus.IN_REVIEW } }),
      prisma.task.count({ where: { status: TaskStatus.DONE } }),
      prisma.task.count({ where: { isOverdue: true } }),
    ]);

    const activeUsersCount = getLiveActiveUsersCount();

    return ApiResponse.ok(res, "Admin dashboard metrics retrieved successfully", {
      totalProjects,
      totalUsers,
      tasksByStatus: {
        TODO: todoCount,
        IN_PROGRESS: inProgressCount,
        IN_REVIEW: inReviewCount,
        DONE: doneCount,
      },
      overdueTaskCount: overdueCount,
      activeUsersCount,
    });
  }

  public async handleGetPmDashboard(req: Request, res: Response) {
    const user = req.user;
    if (!user) {
      throw ApiError.unauthorized("Authentication required");
    }

    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const ownedProjects = await prisma.project.findMany({
      where: { ownerId: user.id },
      include: {
        client: { select: { id: true, name: true } },
        tasks: {
          select: {
            id: true,
            status: true,
            priority: true,
            isOverdue: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const projectSummaries = ownedProjects.map((proj) => {
      const totalTasks = proj.tasks.length;
      const completedTasks = proj.tasks.filter((t) => t.status === TaskStatus.DONE).length;
      const overdueTasks = proj.tasks.filter((t) => t.isOverdue).length;
      return {
        id: proj.id,
        name: proj.name,
        clientName: proj.client.name,
        totalTasks,
        completedTasks,
        overdueTasks,
        progressPercentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      };
    });

    const [lowCount, mediumCount, highCount, criticalCount, upcomingTasks] = await Promise.all([
      prisma.task.count({
        where: {
          project: { ownerId: user.id },
          priority: TaskPriority.LOW,
        },
      }),
      prisma.task.count({
        where: {
          project: { ownerId: user.id },
          priority: TaskPriority.MEDIUM,
        },
      }),
      prisma.task.count({
        where: {
          project: { ownerId: user.id },
          priority: TaskPriority.HIGH,
        },
      }),
      prisma.task.count({
        where: {
          project: { ownerId: user.id },
          priority: TaskPriority.CRITICAL,
        },
      }),
      prisma.task.findMany({
        where: {
          project: { ownerId: user.id },
          status: { not: TaskStatus.DONE },
          dueDate: { gte: now, lte: nextWeek },
        },
        include: {
          project: { select: { id: true, name: true } },
          assignedTo: { select: { id: true, name: true, email: true } },
        },
        orderBy: { dueDate: "asc" },
      }),
    ]);

    return ApiResponse.ok(res, "PM dashboard metrics retrieved successfully", {
      projectsSummary: projectSummaries,
      tasksByPriority: {
        LOW: lowCount,
        MEDIUM: mediumCount,
        HIGH: highCount,
        CRITICAL: criticalCount,
      },
      upcomingDueDatesThisWeek: upcomingTasks,
    });
  }

  public async handleGetDeveloperDashboard(req: Request, res: Response) {
    const user = req.user;
    if (!user) {
      throw ApiError.unauthorized("Authentication required");
    }

    const assignedTasks = await prisma.task.findMany({
      where: { assignedToId: user.id },
      include: {
        project: { select: { id: true, name: true } },
      },
      orderBy: [
        { priority: "desc" },
        { dueDate: "asc" },
      ],
    });

    const totalAssigned = assignedTasks.length;
    const completedCount = assignedTasks.filter((t) => t.status === TaskStatus.DONE).length;
    const overdueCount = assignedTasks.filter((t) => t.isOverdue).length;
    const inProgressCount = assignedTasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length;

    return ApiResponse.ok(res, "Developer dashboard retrieved successfully", {
      metrics: {
        totalAssigned,
        completedCount,
        overdueCount,
        inProgressCount,
      },
      tasks: assignedTasks,
    });
  }
}
