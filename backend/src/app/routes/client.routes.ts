import { Router } from "express";
import { Role } from "@prisma/client";
import { ClientController } from "../controllers/client.controller.js";
import { authenticateJwt } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import {
  createClientSchema,
  updateClientSchema,
} from "../validations/client.validation.js";

const clientRouter = Router();
const clientController = new ClientController();

clientRouter.use(authenticateJwt, authorizeRoles(Role.ADMIN, Role.PROJECT_MANAGER));

clientRouter.post(
  "/",
  validateBody(createClientSchema),
  clientController.handleCreateClient.bind(clientController),
);

clientRouter.get("/", clientController.handleGetClients.bind(clientController));

clientRouter.get("/:id", clientController.handleGetClientById.bind(clientController));

clientRouter.put(
  "/:id",
  validateBody(updateClientSchema),
  clientController.handleUpdateClient.bind(clientController),
);

clientRouter.delete("/:id", clientController.handleDeleteClient.bind(clientController));

export const clientRoutes: Router = clientRouter;
