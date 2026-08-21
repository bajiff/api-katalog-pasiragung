import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../shared/apiResponse.js";
import { ZodError } from "zod";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("🔥 Error Handler:", err);

  if (err instanceof ZodError) {
    return errorResponse(res, "Validation Error", 400, err.format());
  }

  if (err.name === "UnauthorizedError" || err.name === "JsonWebTokenError") {
    return errorResponse(res, "Unauthorized", 401);
  }

  // Fallback for unhandled errors
  return errorResponse(res, "Internal Server Error", 500, {
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};
