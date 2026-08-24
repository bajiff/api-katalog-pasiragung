import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service.js";
import { registerSchema, loginSchema, verifyCodeSchema, updateProfileSchema, forgotPasswordSchema, resetPasswordSchema } from "./auth.validation.js";
import { successResponse, errorResponse } from "../../shared/apiResponse.js";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const result = await authService.register(validatedData);
    return successResponse(res, result, "Registration successful", 201);
  } catch (error: any) {
    if (error.message === "Email already registered") {
      return errorResponse(res, error.message, 409);
    }
    next(error);
  }
};

export const getStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;
    const result = await authService.getStatusByToken(token);
    return successResponse(res, result);
  } catch (error: any) {
    if (error.message === "Invalid registration token") {
      return errorResponse(res, error.message, 404);
    }
    next(error);
  }
};

export const verifyCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;
    const { verification_code } = verifyCodeSchema.parse(req.body);
    const result = await authService.verifyCode(token, verification_code);
    return successResponse(res, result);
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
};

export const resendCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;
    const result = await authService.resendCode(token);
    return successResponse(res, result);
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await authService.login(validatedData);
    return successResponse(res, result);
  } catch (error: any) {
    if (error.message.includes("Access denied")) {
      return errorResponse(res, error.message, 403);
    }
    return errorResponse(res, error.message, 401);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const result = await authService.getMe(userId);
    return successResponse(res, result);
  } catch (error: any) {
    next(error);
  }
};

export const deleteMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const result = await authService.deleteMyAccount(userId);
    return successResponse(res, result);
  } catch (error: any) {
    next(error);
  }
};

export const updateMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const validatedData = updateProfileSchema.parse(req.body);
    const result = await authService.updateMe(userId, validatedData);
    return successResponse(res, result);
  } catch (error: any) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = forgotPasswordSchema.parse(req.body);
    const result = await authService.forgotPassword(validatedData.email);
    return successResponse(res, result);
  } catch (error: any) {
    // If it throws an error like 'Account is not approved', we can catch it. 
    // Otherwise, we shouldn't reveal if email exists.
    return successResponse(res, { message: "If the email is registered, a reset code will be sent." });
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = resetPasswordSchema.parse(req.body);
    const result = await authService.resetPassword(validatedData);
    return successResponse(res, result);
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
};
