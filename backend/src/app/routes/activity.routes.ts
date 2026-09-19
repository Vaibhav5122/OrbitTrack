import { Router } from "express";
import { ActivityLogController } from "../controllers/activity.controller.js";
import { authenticateJwt } from "../middlewares/auth.middleware.js";

const activityRouter = Router();
const activityController = new ActivityLogController();

activityRouter.use(authenticateJwt);

// Role-filtered global activity feed (Admin: global, PM: owned projects, Dev: assigned tasks)
activityRouter.get("/", activityController.handleGetActivityFeed.bind(activityController));

// Project-scoped activity feed
activityRouter.get("/project/:projectId", activityController.handleGetProjectActivity.bind(activityController));

export const activityRoutes: Router = activityRouter;
