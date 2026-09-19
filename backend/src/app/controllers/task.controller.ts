import type { Request, Response } from "express";
import { Role, TaskPriority, TaskStatus } from "@prisma/client";
import type {
  CreateTaskSchemaType,
  TaskQueryFilterSchemaType,
  UpdateTaskSchemaType,
  UpdateTaskStatusSchemaType,
} from "../validations/task.validation.js";
import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../common/utils/ApiError.js";
import { ApiResponse } from "../../common/utils/ApiResponse.js";
import { broadcastActivityLog, broadcastTaskStatusUpdate } from "../../lib/socket.js";

export function formatStatusLabel(status: TaskStatus): string {
  switch (status) {
    case TaskStatus.TODO:
      return "To Do";
    case TaskStatus.IN_PROGRESS:
      return "In Progress";
    case TaskStatus.IN_REVIEW:
      return "In Review";
    case TaskStatus.DONE:
      return "Done";
  }
}

export class TaskController {
  public async handleCreateTask(
    req: Request<{ projectId?: string }, {}, CreateTaskSchemaType>,
    res: Response,
  ) {
    const user = req.user;
    if (!user) {
      throw ApiError.unauthorized("Authentication required");
    }

    const projectId = req.params.projectId;
    if (!projectId || typeof projectId !== "string") {
      throw ApiError.badRequest("Valid Project ID is required");
    }

    const { title, description, status, priority, dueDate, assignedToId } =
      req.body;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw ApiError.notFound("Project not found");
    }

    if (user.role === Role.PROJECT_MANAGER && project.ownerId !== user.id) {
      throw ApiError.forbidden(
        "Access denied: You can only create tasks in projects you created",
      );
    }

    if (assignedToId) {
      const assignedUser = await prisma.user.findUnique({
        where: { id: assignedToId },
      });
      if (!assignedUser) {
        throw ApiError.notFound("Assigned developer not found");
      }
    }

    const parsedDueDate = new Date(dueDate);
    const isOverdue =
      parsedDueDate < new Date() && status !== TaskStatus.DONE;

    const actor = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, name: true, email: true },
    });
    const actorName = actor?.name ?? "User";

    const task = await prisma.task.create({
      data: {
        title,
        description: description ?? null,
        status: status as TaskStatus,
        priority: priority as TaskPriority,
        dueDate: parsedDueDate,
        isOverdue,
        projectId,
        assignedToId: assignedToId ?? null,
      },
      include: {
        project: {
          select: { id: true, name: true, ownerId: true },
        },
        assignedTo: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    const activityLog = await prisma.activityLog.create({
      data: {
        projectId,
        taskId: task.id,
        userId: user.id,
        action: "TASK_CREATED",
        description: `${actorName} created Task '${task.title}'`,
        metadata: {
          priority: task.priority,
          status: task.status,
          assignedTo: task.assignedTo?.name ?? null,
        },
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    broadcastActivityLog(
      {
        id: activityLog.id,
        projectId,
        projectName: task.project.name,
        taskId: task.id,
        taskTitle: task.title,
        userId: user.id,
        userName: actorName,
        userEmail: actor?.email ?? "",
        action: activityLog.action,
        description: activityLog.description,
        metadata: activityLog.metadata,
        createdAt: activityLog.createdAt.toISOString(),
      },
      task.project.ownerId,
      task.assignedToId,
    );

    return ApiResponse.created(res, "Task created successfully", task);
  }

  public async handleGetTasks(req: Request, res: Response) {
    const user = req.user;
    if (!user) {
      throw ApiError.unauthorized("Authentication required");
    }

    const {
      status,
      priority,
      dueDateFrom,
      dueDateTo,
      projectId,
      assignedToId,
      isOverdue,
    } = req.query as TaskQueryFilterSchemaType;

    const whereConditions: Record<string, unknown> = {};

    if (status) {
      whereConditions.status = status;
    }
    if (priority) {
      whereConditions.priority = priority;
    }
    if (projectId) {
      whereConditions.projectId = projectId;
    }
    if (typeof isOverdue === "boolean") {
      whereConditions.isOverdue = isOverdue;
    }
    if (dueDateFrom || dueDateTo) {
      const dateFilter: Record<string, Date> = {};
      if (dueDateFrom) dateFilter.gte = new Date(dueDateFrom);
      if (dueDateTo) dateFilter.lte = new Date(dueDateTo);
      whereConditions.dueDate = dateFilter;
    }

    if (user.role === Role.ADMIN) {
      if (assignedToId) {
        whereConditions.assignedToId = assignedToId;
      }
    } else if (user.role === Role.PROJECT_MANAGER) {
      whereConditions.project = {
        ownerId: user.id,
      };
      if (assignedToId) {
        whereConditions.assignedToId = assignedToId;
      }
    } else if (user.role === Role.DEVELOPER) {
      whereConditions.assignedToId = user.id;
    }

    const tasks = await prisma.task.findMany({
      where: whereConditions,
      include: {
        project: {
          select: { id: true, name: true, ownerId: true },
        },
        assignedTo: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
      orderBy: [
        { priority: "desc" },
        { dueDate: "asc" },
      ],
    });

    return ApiResponse.ok(res, "Tasks fetched successfully", tasks);
  }

  public async handleGetTaskById(req: Request, res: Response) {
    const user = req.user;
    if (!user) {
      throw ApiError.unauthorized("Authentication required");
    }

    const id = req.params.id;
    if (!id || typeof id !== "string") {
      throw ApiError.badRequest("Valid Task ID is required");
    }

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          select: { id: true, name: true, ownerId: true },
        },
        assignedTo: {
          select: { id: true, name: true, email: true, role: true },
        },
        activityLogs: {
          include: {
            user: {
              select: { id: true, name: true, email: true, role: true },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });

    if (!task) {
      throw ApiError.notFound("Task not found");
    }

    if (user.role === Role.PROJECT_MANAGER && task.project.ownerId !== user.id) {
      throw ApiError.forbidden("Access denied: You cannot view tasks in another PM's project");
    }

    if (user.role === Role.DEVELOPER && task.assignedToId !== user.id) {
      throw ApiError.forbidden("Access denied: You cannot view tasks not assigned to you");
    }

    return ApiResponse.ok(res, "Task fetched successfully", task);
  }

  public async handleUpdateTaskStatus(
    req: Request<{ id?: string }, {}, UpdateTaskStatusSchemaType>,
    res: Response,
  ) {
    const user = req.user;
    if (!user) {
      throw ApiError.unauthorized("Authentication required");
    }

    const id = req.params.id;
    if (!id || typeof id !== "string") {
      throw ApiError.badRequest("Valid Task ID is required");
    }

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          select: { id: true, name: true, ownerId: true },
        },
      },
    });

    if (!task) {
      throw ApiError.notFound("Task not found");
    }

    if (user.role === Role.PROJECT_MANAGER && task.project.ownerId !== user.id) {
      throw ApiError.forbidden("Access denied: You cannot update tasks in another PM's project");
    }

    if (user.role === Role.DEVELOPER && task.assignedToId !== user.id) {
      throw ApiError.forbidden("Access denied: You cannot update status of a task not assigned to you");
    }

    const oldStatus = task.status;
    const newStatus = req.body.status as TaskStatus;

    if (oldStatus === newStatus) {
      return ApiResponse.ok(res, "Task status unchanged", task);
    }

    const isOverdue =
      task.dueDate < new Date() && newStatus !== TaskStatus.DONE;

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        status: newStatus,
        isOverdue,
      },
      include: {
        project: {
          select: { id: true, name: true, ownerId: true },
        },
        assignedTo: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    const actor = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, name: true, email: true },
    });
    const actorName = actor?.name ?? "User";

    const description = `${actorName} moved Task '${task.title}' from ${formatStatusLabel(oldStatus)} → ${formatStatusLabel(newStatus)}`;

    const activityLog = await prisma.activityLog.create({
      data: {
        projectId: task.projectId,
        taskId: task.id,
        userId: user.id,
        action: "STATUS_UPDATED",
        description,
        metadata: {
          fromStatus: oldStatus,
          toStatus: newStatus,
        },
      },
    });

    broadcastActivityLog(
      {
        id: activityLog.id,
        projectId: task.projectId,
        projectName: updatedTask.project.name,
        taskId: task.id,
        taskTitle: task.title,
        userId: user.id,
        userName: actorName,
        userEmail: actor?.email ?? "",
        action: activityLog.action,
        description: activityLog.description,
        metadata: activityLog.metadata,
        createdAt: activityLog.createdAt.toISOString(),
      },
      task.project.ownerId,
      task.assignedToId,
    );

    broadcastTaskStatusUpdate(
      {
        taskId: task.id,
        projectId: task.projectId,
        status: newStatus,
        previousStatus: oldStatus,
        updatedById: user.id,
        updatedByName: actorName,
      },
      task.project.ownerId,
      task.assignedToId,
    );

    return ApiResponse.ok(res, "Task status updated successfully", updatedTask);
  }

  public async handleUpdateTask(
    req: Request<{ id?: string }, {}, UpdateTaskSchemaType>,
    res: Response,
  ) {
    const user = req.user;
    if (!user) {
      throw ApiError.unauthorized("Authentication required");
    }

    const id = req.params.id;
    if (!id || typeof id !== "string") {
      throw ApiError.badRequest("Valid Task ID is required");
    }

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          select: { id: true, name: true, ownerId: true },
        },
      },
    });

    if (!task) {
      throw ApiError.notFound("Task not found");
    }

    if (user.role === Role.DEVELOPER) {
      throw ApiError.forbidden("Access denied: Developers cannot edit task properties");
    }

    if (user.role === Role.PROJECT_MANAGER && task.project.ownerId !== user.id) {
      throw ApiError.forbidden("Access denied: You cannot edit tasks in another PM's project");
    }

    const { title, description, status, priority, dueDate, assignedToId } =
      req.body;

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description ?? null;
    if (priority !== undefined) updateData.priority = priority as TaskPriority;
    if (status !== undefined) {
      updateData.status = status as TaskStatus;
      const targetDueDate = dueDate ? new Date(dueDate) : task.dueDate;
      updateData.isOverdue =
        targetDueDate < new Date() && status !== TaskStatus.DONE;
    }
    if (dueDate !== undefined) {
      const parsed = new Date(dueDate);
      updateData.dueDate = parsed;
      const currentStatus = (status as TaskStatus) || task.status;
      updateData.isOverdue =
        parsed < new Date() && currentStatus !== TaskStatus.DONE;
    }
    if (assignedToId !== undefined) {
      updateData.assignedToId = assignedToId ?? null;
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        project: {
          select: { id: true, name: true, ownerId: true },
        },
        assignedTo: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    if (assignedToId !== undefined && assignedToId !== task.assignedToId) {
      const actor = await prisma.user.findUnique({
        where: { id: user.id },
        select: { id: true, name: true, email: true },
      });
      const actorName = actor?.name ?? "User";
      const newAssignee = updatedTask.assignedTo?.name ?? "Unassigned";

      const log = await prisma.activityLog.create({
        data: {
          projectId: task.projectId,
          taskId: task.id,
          userId: user.id,
          action: "TASK_ASSIGNED",
          description: `${actorName} assigned Task '${updatedTask.title}' to ${newAssignee}`,
          metadata: {
            assignedToId: updatedTask.assignedToId,
            assignedToName: newAssignee,
          },
        },
      });

      broadcastActivityLog(
        {
          id: log.id,
          projectId: task.projectId,
          projectName: updatedTask.project.name,
          taskId: task.id,
          taskTitle: task.title,
          userId: user.id,
          userName: actorName,
          userEmail: actor?.email ?? "",
          action: log.action,
          description: log.description,
          metadata: log.metadata,
          createdAt: log.createdAt.toISOString(),
        },
        task.project.ownerId,
        updatedTask.assignedToId,
      );
    }

    return ApiResponse.ok(res, "Task updated successfully", updatedTask);
  }

  public async handleDeleteTask(req: Request, res: Response) {
    const user = req.user;
    if (!user) {
      throw ApiError.unauthorized("Authentication required");
    }

    const id = req.params.id;
    if (!id || typeof id !== "string") {
      throw ApiError.badRequest("Valid Task ID is required");
    }

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          select: { ownerId: true },
        },
      },
    });

    if (!task) {
      throw ApiError.notFound("Task not found");
    }

    if (user.role === Role.DEVELOPER) {
      throw ApiError.forbidden("Access denied: Developers cannot delete tasks");
    }

    if (user.role === Role.PROJECT_MANAGER && task.project.ownerId !== user.id) {
      throw ApiError.forbidden("Access denied: You cannot delete tasks in another PM's project");
    }

    await prisma.task.delete({ where: { id } });

    return ApiResponse.ok(res, "Task deleted successfully", null);
  }
}
