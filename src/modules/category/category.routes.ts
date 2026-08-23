import { Router } from "express";
import * as categoryController from "./category.controller.js";
import { authMiddleware, requireRole } from "../../middlewares/index.js";

const router = Router();

// Public routes
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);

// Protected Admin routes
router.use(authMiddleware);
router.use(requireRole("admin", "super_admin"));

router.post("/", categoryController.createCategory);
router.patch("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

export { router as categoryRoutes };
