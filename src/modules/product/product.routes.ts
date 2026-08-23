import { Router } from "express";
import * as productController from "./product.controller.js";
import { authMiddleware, requireRole, uploadMiddleware } from "../../middlewares/index.js";

const router = Router();

// Public routes
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

// Protected Admin routes
router.use(authMiddleware);
router.use(requireRole("admin", "super_admin"));

router.post("/", uploadMiddleware.single("image"), productController.createProduct);
router.patch("/:id", uploadMiddleware.single("image"), productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

export { router as productRoutes };
