import type { NextFunction, Request, Response } from "express";
import { ApiError } from "./ApiError.js";
import { ZodError } from "zod";

export const globalErrorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  let finalizedError: ApiError;

  if (err instanceof ZodError) {
    finalizedError = ApiError.fromZod(err);
  } else if (err instanceof ApiError) {
    finalizedError = err;
  } else if (
    (typeof err === "object" &&
      err !== null &&
      "type" in err &&
      (err as { type: string }).type === "entity.parse.failed") ||
    err instanceof SyntaxError
  ) {
    finalizedError = ApiError.badRequest(
      "Invalid or empty JSON payload provided",
    );
  } else {
    finalizedError = ApiError.serverError("Internal server Error");
  }

  res.status(finalizedError.statusCode).json({
    success: false,
    message: finalizedError.message,
  });
};
