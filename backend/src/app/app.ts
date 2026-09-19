import express, { type Application } from "express";
import { globalErrorHandler } from "../common/utils/GlobalErrorHandler.js";

export async function expressApplication(): Promise<Application> {
  const expressApp = express();

  expressApp.get("/", (_req, res) => {
    return res.status(200).json({ Health: "Ok" });
  });

  expressApp.use(globalErrorHandler);
  return expressApp;
}
