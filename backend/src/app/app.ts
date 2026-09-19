import express, { type Application } from "express";
import { globalErrorHandler } from "../common/utils/GlobalErrorHandler.js";
import { ApiError } from "../common/utils/ApiError.js";

export async function expressApplication(): Promise<Application> {
  const expressApp = express();

  expressApp.get("/", (_req, res) => {
    return res.status(200).json({ Health: "Ok" });
  });

  expressApp.use((_req, _res, next) => {
    next(new ApiError(404, "Route Not Found"));
  });

  expressApp.use(globalErrorHandler);
  return expressApp;
}
