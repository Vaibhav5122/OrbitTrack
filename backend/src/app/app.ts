import express, { type Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "../common/utils/GlobalErrorHandler.js";
import { ApiError } from "../common/utils/ApiError.js";
import { envZod } from "../common/utils/envSanitization.js";
import { authRoutes } from "./routes/auth.routes.js";
import { clientRoutes } from "./routes/client.routes.js";
import { projectRoutes } from "./routes/project.routes.js";
import { taskRoutes } from "./routes/task.routes.js";
import { activityRoutes } from "./routes/activity.routes.js";
import { dashboardRoutes } from "./routes/dashboard.routes.js";
import { notificationRoutes } from "./routes/notification.routes.js";

export async function expressApplication(): Promise<Application> {
  const expressApp = express();

  expressApp.use(
    cors({
      origin: envZod.CLIENT_ORIGIN,
      credentials: true,
    }),
  );

  expressApp.use(express.json({ limit: "16kb" }));
  expressApp.use(express.urlencoded({ extended: true, limit: "16kb" }));
  expressApp.use(cookieParser());

  // Health check
  expressApp.get("/", (_req, res) => {
    return res.status(200).json({ Health: "Ok" });
  });

  // API Routes
  expressApp.use("/api/auth", authRoutes);
  expressApp.use("/api/clients", clientRoutes);
  expressApp.use("/api/projects", projectRoutes);
  expressApp.use("/api/tasks", taskRoutes);
  expressApp.use("/api/activities", activityRoutes);
  expressApp.use("/api/dashboard", dashboardRoutes);
  expressApp.use("/api/notifications", notificationRoutes);

  // 404 Route handler
  expressApp.use((_req, _res, next) => {
    next(new ApiError(404, "Route Not Found"));
  });

  // Global Error Handler
  expressApp.use(globalErrorHandler);

  return expressApp;
}
