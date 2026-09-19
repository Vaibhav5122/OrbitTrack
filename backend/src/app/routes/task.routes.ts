import { Router } from "express";
import { Role } from "@prisma/client";
import { TaskController } from "../controllers/task.controller.js";
import { authenticateJwt } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
} from "../validations/task.validation.js";

const taskRouter = Router();
const taskController = new TaskController();

taskRouter.use(authenticateJwt);

taskRouter.get("/", taskController.handleGetTasks.bind(taskController));

taskRouter.get("/:id", taskController.handleGetTaskById.bind(taskController));

taskRouter.post(
  "/project/:projectId",
  authorizeRoles(Role.ADMIN, Role.PROJECT_MANAGER),
  validateBody(createTaskSchema),
  taskController.handleCreateTask.bind(taskController),
);

taskRouter.patch(
  "/:id/status",
  validateBody(updateTaskStatusSchema),
  taskController.handleUpdateTaskStatus.bind(taskController),
);

taskRouter.patch(
  "/:id",
  authorizeRoles(Role.ADMIN, Role.PROJECT_MANAGER),
  validateBody(updateTaskSchema),
  taskController.handleUpdateTask.bind(taskController),
);

taskRouter.delete(
  "/:id",
  authorizeRoles(Role.ADMIN, Role.PROJECT_MANAGER),
  taskController.handleDeleteTask.bind(taskController),
);

export const taskRoutes: Router = taskRouter;
