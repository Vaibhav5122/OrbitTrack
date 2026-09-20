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

  const allowedOrigins = (envZod.CLIENT_ORIGIN ?? "http://localhost:3000")
    .split(",")
    .map((o) => o.trim());

  expressApp.use(
    cors({
      origin: (requestOrigin, callback) => {
        if (!requestOrigin) return callback(null, true);
        if (
          allowedOrigins.includes(requestOrigin) ||
          allowedOrigins.includes("*") ||
          requestOrigin.endsWith(".vercel.app") ||
          requestOrigin.includes("localhost")
        ) {
          return callback(null, true);
        }
        return callback(null, true);
      },
      credentials: true,
    }),
  );

  expressApp.use(express.json({ limit: "16kb" }));
  expressApp.use(express.urlencoded({ extended: true, limit: "16kb" }));
  expressApp.use(cookieParser());

  expressApp.get(["/", "/health", "/api/health"], (_req, res) => {
    return res.status(200).json({
      status: "healthy",
      service: "orbittrack-backend",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  expressApp.use("/api/auth", authRoutes);
  expressApp.use("/api/clients", clientRoutes);
  expressApp.use("/api/projects", projectRoutes);
  expressApp.use("/api/tasks", taskRoutes);
  expressApp.use("/api/activities", activityRoutes);
  expressApp.use("/api/dashboard", dashboardRoutes);
  expressApp.use("/api/notifications", notificationRoutes);

  expressApp.use((_req, _res, next) => {
    next(new ApiError(404, "Route Not Found"));
  });

  expressApp.use(globalErrorHandler);

  return expressApp;
}
