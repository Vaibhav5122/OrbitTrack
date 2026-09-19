import { Router } from "express";
import { Role } from "@prisma/client";
import { DashboardController } from "../controllers/dashboard.controller.js";
import { authenticateJwt } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();
const controller = new DashboardController();

router.use(authenticateJwt);

router.get(
  "/admin",
  authorizeRoles(Role.ADMIN),
  controller.handleGetAdminDashboard.bind(controller)
);

router.get(
  "/pm",
  authorizeRoles(Role.ADMIN, Role.PROJECT_MANAGER),
  controller.handleGetPmDashboard.bind(controller)
);

router.get(
  "/developer",
  authorizeRoles(Role.DEVELOPER),
  controller.handleGetDeveloperDashboard.bind(controller)
);

export const dashboardRoutes: Router = router;
