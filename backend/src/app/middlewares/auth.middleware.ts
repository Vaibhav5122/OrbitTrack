import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../../common/utils/ApiError.js";
import { verifyAccessToken } from "../utils/token.util.js";

export async function authenticateJwt(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw ApiError.unauthorized("Authentication required: Access token missing");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw ApiError.unauthorized("Authentication required: Access token invalid");
    }

    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return next(error);
    }
    if (error instanceof Error && error.name === "TokenExpiredError") {
      return next(ApiError.unauthorized("Access token has expired"));
    }
    return next(ApiError.unauthorized("Invalid access token"));
  }
}
