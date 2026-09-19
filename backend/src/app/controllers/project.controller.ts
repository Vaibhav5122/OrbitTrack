import type { Request, Response } from "express";
import { Role } from "@prisma/client";
import type {
  CreateProjectSchemaType,
  UpdateProjectSchemaType,
} from "../validations/project.validation.js";
import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../common/utils/ApiError.js";
import { ApiResponse } from "../../common/utils/ApiResponse.js";

export class ProjectController {
  public async handleCreateProject(
    req: Request<{}, {}, CreateProjectSchemaType>,
    res: Response,
  ) {
    const user = req.user;
    if (!user) {
      throw ApiError.unauthorized("Authentication required");
    }

    const { name, description, clientId } = req.body;

    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw ApiError.notFound("Client not found");
    }

    const project = await prisma.project.create({
      data: {
        name,
        description: description ?? null,
        clientId,
        ownerId: user.id,
      },
      include: {
        client: true,
        owner: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    await prisma.activityLog.create({
      data: {
        projectId: project.id,
        userId: user.id,
        action: "PROJECT_CREATED",
        description: `${project.owner.name} created project '${project.name}'`,
      },
    });

    return ApiResponse.created(res, "Project created successfully", project);
  }

  public async handleGetProjects(req: Request, res: Response) {
    const user = req.user;
    if (!user) {
      throw ApiError.unauthorized("Authentication required");
    }

    let whereClause = {};

    if (user.role === Role.ADMIN) {
      whereClause = {};
    } else if (user.role === Role.PROJECT_MANAGER) {
      whereClause = { ownerId: user.id };
    } else if (user.role === Role.DEVELOPER) {
      whereClause = {
        tasks: {
          some: { assignedToId: user.id },
        },
      };
    }

    const projects = await prisma.project.findMany({
      where: whereClause,
      include: {
        client: true,
        owner: {
          select: { id: true, name: true, email: true, role: true },
        },
        _count: {
          select: { tasks: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return ApiResponse.ok(res, "Projects fetched successfully", projects);
  }

  public async handleGetProjectById(req: Request, res: Response) {
    const user = req.user;
    if (!user) {
      throw ApiError.unauthorized("Authentication required");
    }

    const id = req.params.id;
    if (!id || typeof id !== "string") {
      throw ApiError.badRequest("Valid Project ID is required");
    }

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        client: true,
        owner: {
          select: { id: true, name: true, email: true, role: true },
        },
        tasks: {
          include: {
            assignedTo: {
              select: { id: true, name: true, email: true, role: true },
            },
          },
          orderBy: { dueDate: "asc" },
        },
      },
    });

    if (!project) {
      throw ApiError.notFound("Project not found");
    }

    if (user.role === Role.PROJECT_MANAGER && project.ownerId !== user.id) {
      throw ApiError.forbidden("Access denied: You can only view projects you created");
    }

    if (user.role === Role.DEVELOPER) {
      const hasTask = project.tasks.some((task) => task.assignedToId === user.id);
      if (!hasTask) {
        throw ApiError.forbidden("Access denied: You are not assigned to this project");
      }
    }

    return ApiResponse.ok(res, "Project fetched successfully", project);
  }

  public async handleUpdateProject(
    req: Request<{ id?: string }, {}, UpdateProjectSchemaType>,
    res: Response,
  ) {
    const user = req.user;
    if (!user) {
      throw ApiError.unauthorized("Authentication required");
    }

    const id = req.params.id;
    if (!id || typeof id !== "string") {
      throw ApiError.badRequest("Valid Project ID is required");
    }

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      throw ApiError.notFound("Project not found");
    }

    if (user.role === Role.PROJECT_MANAGER && project.ownerId !== user.id) {
      throw ApiError.forbidden("Access denied: You cannot edit another PM's project");
    }

    if (req.body.clientId) {
      const client = await prisma.client.findUnique({
        where: { id: req.body.clientId },
      });
      if (!client) {
        throw ApiError.notFound("Client not found");
      }
    }

    const updateData: Record<string, unknown> = {};
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.description !== undefined) {
      updateData.description = req.body.description ?? null;
    }
    if (req.body.clientId !== undefined) updateData.clientId = req.body.clientId;

    const updated = await prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        client: true,
        owner: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    return ApiResponse.ok(res, "Project updated successfully", updated);
  }

  public async handleDeleteProject(req: Request, res: Response) {
    const user = req.user;
    if (!user) {
      throw ApiError.unauthorized("Authentication required");
    }

    const id = req.params.id;
    if (!id || typeof id !== "string") {
      throw ApiError.badRequest("Valid Project ID is required");
    }

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      throw ApiError.notFound("Project not found");
    }

    if (user.role === Role.PROJECT_MANAGER && project.ownerId !== user.id) {
      throw ApiError.forbidden("Access denied: You cannot delete another PM's project");
    }

    await prisma.project.delete({ where: { id } });

    return ApiResponse.ok(res, "Project deleted successfully", null);
  }
}
