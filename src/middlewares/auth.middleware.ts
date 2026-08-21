import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../shared/tokenUtils.js";
import { errorResponse } from "../shared/apiResponse.js";
import { prisma } from "../config/prisma.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, "Missing or invalid token", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    // Verify user still exists and is approved
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true, status: true },
    });

    if (!user || user.status !== "approved") {
      return errorResponse(res, "User not found or not approved", 401);
    }

    req.user = {
      userId: user.id,
      role: user.role,
    };

    next();
  } catch (error) {
    return errorResponse(res, "Invalid or expired token", 401);
  }
};
