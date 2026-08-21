import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../shared/apiResponse.js";

export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return errorResponse(res, "Unauthorized", 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(res, "Forbidden - Insufficient permissions", 403);
    }

    next();
  };
};
