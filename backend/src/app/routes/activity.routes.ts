import { Router } from "express";
import { ActivityLogController } from "../controllers/activity.controller.js";
import { authenticateJwt } from "../middlewares/auth.middleware.js";

const activityRouter = Router();
const activityController = new ActivityLogController();

activityRouter.use(authenticateJwt);

activityRouter.get("/", activityController.handleGetActivityFeed.bind(activityController));

activityRouter.get("/project/:projectId", activityController.handleGetProjectActivity.bind(activityController));

export const activityRoutes: Router = activityRouter;
