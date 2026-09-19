import { Router } from "express";
import { Role } from "@prisma/client";
import { ProjectController } from "../controllers/project.controller.js";
import { authenticateJwt } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../validations/project.validation.js";

const projectRouter = Router();
const projectController = new ProjectController();

projectRouter.use(authenticateJwt);

projectRouter.post(
  "/",
  authorizeRoles(Role.ADMIN, Role.PROJECT_MANAGER),
  validateBody(createProjectSchema),
  projectController.handleCreateProject.bind(projectController),
);

projectRouter.get("/", projectController.handleGetProjects.bind(projectController));

projectRouter.get("/:id", projectController.handleGetProjectById.bind(projectController));

projectRouter.put(
  "/:id",
  authorizeRoles(Role.ADMIN, Role.PROJECT_MANAGER),
  validateBody(updateProjectSchema),
  projectController.handleUpdateProject.bind(projectController),
);

projectRouter.delete(
  "/:id",
  authorizeRoles(Role.ADMIN, Role.PROJECT_MANAGER),
  projectController.handleDeleteProject.bind(projectController),
);

export const projectRoutes: Router = projectRouter;
