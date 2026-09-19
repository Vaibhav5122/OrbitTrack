import type { NextFunction, Request, RequestHandler, Response } from "express";
import { ApiError } from "../../common/utils/ApiError.js";
import type z from "zod";

export function validateBody(schema: z.ZodTypeAny): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            return next(ApiError.fromZod(result.error));
        }
        req.body = result.data;
        next();
    };
}