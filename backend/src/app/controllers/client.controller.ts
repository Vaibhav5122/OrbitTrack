import type { Request, Response } from "express";
import type {
  CreateClientSchemaType,
  UpdateClientSchemaType,
} from "../validations/client.validation.js";
import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../common/utils/ApiError.js";
import { ApiResponse } from "../../common/utils/ApiResponse.js";

export class ClientController {
  public async handleCreateClient(
    req: Request<{}, {}, CreateClientSchemaType>,
    res: Response,
  ) {
    const { name, email, company } = req.body;

    const existingClient = await prisma.client.findUnique({
      where: { email },
    });

    if (existingClient) {
      throw ApiError.emailExists("Client with this email already exists");
    }

    const client = await prisma.client.create({
      data: {
        name,
        email,
        company: company ?? null,
      },
    });

    return ApiResponse.created(res, "Client created successfully", client);
  }

  public async handleGetClients(_req: Request, res: Response) {
    const clients = await prisma.client.findMany({
      include: {
        _count: {
          select: { projects: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return ApiResponse.ok(res, "Clients fetched successfully", clients);
  }

  public async handleGetClientById(req: Request, res: Response) {
    const id = req.params.id;

    if (!id || typeof id !== "string") {
      throw ApiError.badRequest("Valid Client ID is required");
    }

    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        projects: {
          select: {
            id: true,
            name: true,
            createdAt: true,
          },
        },
      },
    });

    if (!client) {
      throw ApiError.notFound("Client not found");
    }

    return ApiResponse.ok(res, "Client fetched successfully", client);
  }

  public async handleUpdateClient(
    req: Request<{ id?: string }, {}, UpdateClientSchemaType>,
    res: Response,
  ) {
    const id = req.params.id;

    if (!id || typeof id !== "string") {
      throw ApiError.badRequest("Valid Client ID is required");
    }

    const existing = await prisma.client.findUnique({ where: { id } });
    if (!existing) {
      throw ApiError.notFound("Client not found");
    }

    if (req.body.email && req.body.email !== existing.email) {
      const emailTaken = await prisma.client.findUnique({
        where: { email: req.body.email },
      });
      if (emailTaken) {
        throw ApiError.emailExists("Client with this email already exists");
      }
    }

    const updateData: Record<string, unknown> = {};
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.email !== undefined) updateData.email = req.body.email;
    if (req.body.company !== undefined) updateData.company = req.body.company ?? null;

    const updated = await prisma.client.update({
      where: { id },
      data: updateData,
    });

    return ApiResponse.ok(res, "Client updated successfully", updated);
  }

  public async handleDeleteClient(req: Request, res: Response) {
    const id = req.params.id;

    if (!id || typeof id !== "string") {
      throw ApiError.badRequest("Valid Client ID is required");
    }

    const existing = await prisma.client.findUnique({ where: { id } });
    if (!existing) {
      throw ApiError.notFound("Client not found");
    }

    await prisma.client.delete({ where: { id } });

    return ApiResponse.ok(res, "Client deleted successfully", null);
  }
}
