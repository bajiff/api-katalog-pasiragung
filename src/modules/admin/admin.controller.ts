import { Request, Response, NextFunction } from "express";
import * as adminService from "./admin.service.js";
import { paginatedResponse } from "../../shared/apiResponse.js";
import { getPaginationOptions } from "../../shared/paginationUtils.js";

export const getAllAdmins = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, skip } = getPaginationOptions(req.query.page, req.query.limit);
    
    const { users, totalItems } = await adminService.getAllAdmins(skip, limit);
    
    return paginatedResponse(res, users, totalItems, page, limit, "Successfully fetched admins");
  } catch (error) {
    next(error);
  }
};
