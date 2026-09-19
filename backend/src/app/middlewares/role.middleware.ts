import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { Role } from "@prisma/client";
import { ApiError } from "../../common/utils/ApiError.js";

export function authorizeRoles(...allowedRoles: Role[]): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized("Authentication required"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          `Forbidden: ${req.user.role} is not permitted to access this resource`,
        ),
      );
    }

    next();
  };
}
