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

export const approveAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await adminService.updateAdminStatus(id, "approved");
    return res.status(200).json({ success: true, message: "Admin approved successfully", data: user });
  } catch (error: any) {
    if (error.code === 'P2025' || error.message === 'Admin not found') {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }
    next(error);
  }
};

export const rejectAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await adminService.updateAdminStatus(id, "rejected");
    return res.status(200).json({ success: true, message: "Admin rejected successfully", data: user });
  } catch (error: any) {
    if (error.code === 'P2025' || error.message === 'Admin not found') {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await adminService.deleteAdminAccount(id);
    return res.status(200).json({ success: true, message: result.message });
  } catch (error: any) {
    if (error.code === 'P2025' || error.message === 'Admin not found') {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }
    next(error);
  }
};
