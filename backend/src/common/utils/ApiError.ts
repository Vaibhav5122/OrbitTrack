import type { ZodError } from "zod";

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
  static badRequest(message: string = "Bad Request"): ApiError {
    return new ApiError(400, message);
  }
  static unauthorized(message: string = "Unauthorized"): ApiError {
    return new ApiError(401, message);
  }
  static emailExists(message: string = "Email Already Exists"): ApiError {
    return new ApiError(409, message);
  }
  static serverError(message: string = "Internal Server Error"): ApiError {
    return new ApiError(500, message);
  }
  static jwtNotFoundError(
    message: string = "Authentication Required",
  ): ApiError {
    return new ApiError(401, message);
  }
  static notFound(message: string = "Not Found"): ApiError {
    return new ApiError(404, message);
  }
  static forbidden(message: string = "Forbidden"): ApiError {
    return new ApiError(403, message);
  }
  static fromZod(error: ZodError): ApiError {
    const combinedMessage = error.issues
      .map((e) =>
        e.path.length > 0 ? `${e.path.join(".")}: ${e.message}` : e.message,
      )
      .join(". ");

    return new ApiError(400, combinedMessage || "Validation failed");
  }
}
