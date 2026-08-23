import { Router } from "express";
import * as adminController from "./admin.controller.js";
import { authMiddleware, requireRole } from "../../middlewares/index.js";

const router = Router();

// Apply auth and super_admin role middleware to all routes in this module
router.use(authMiddleware);
router.use(requireRole("super_admin"));

router.get("/users", adminController.getAllAdmins);
router.patch("/users/:id/approve", adminController.approveAdmin);
router.patch("/users/:id/reject", adminController.rejectAdmin);

export { router as adminRoutes };
