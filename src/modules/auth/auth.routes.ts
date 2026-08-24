import { Router } from "express";
import * as authController from "./auth.controller.js";
import { authMiddleware, generalLimiter, authLimiter, resendLimiter } from "../../middlewares/index.js";

const router = Router();

router.post("/register", authLimiter, authController.register);
router.get("/status/:token", generalLimiter, authController.getStatus);
router.post("/status/:token/verify", authLimiter, authController.verifyCode);
router.post("/status/:token/resend", resendLimiter, authController.resendCode);
router.post("/login", authLimiter, authController.login);
router.get("/me", authMiddleware, authController.getMe);
router.patch("/me", authMiddleware, authController.updateMe);
router.delete("/me", authMiddleware, authController.deleteMe);

router.post("/forgot-password", authLimiter, authController.forgotPassword);
router.post("/reset-password", authLimiter, authController.resetPassword);

export { router as authRoutes };
