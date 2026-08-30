import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../shared/apiResponse.js";
import { ZodError } from "zod";
import multer from "multer";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    return errorResponse(res, "Validation Error", 400, err.format());
  }

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return errorResponse(res, "File size exceeds the limit (5MB)", 400);
    }
    return errorResponse(res, err.message, 400);
  }

  if (err.message === "Unsupported file format. Only JPEG, PNG, and WebP are allowed.") {
    return errorResponse(res, err.message, 400);
  }

  if (err.name === "UnauthorizedError" || err.name === "JsonWebTokenError") {
    return errorResponse(res, "Unauthorized", 401);
  }

  // Handle JSON SyntaxError from body-parser (malformed JSON)
  if (err instanceof SyntaxError && (err as any).status === 400 && "body" in err) {
    return errorResponse(res, "Invalid JSON payload format", 400);
  }

  console.error("🔥 Error Handler:", err);

  // Fallback for unhandled errors
  return errorResponse(res, "Internal Server Error", 500, {
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};
