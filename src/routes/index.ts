import { Router } from "express";
import { authRoutes } from "../modules/auth/index.js";
import { adminRoutes } from "../modules/admin/index.js";
import { categoryRoutes } from "../modules/category/index.js";
import { productRoutes } from "../modules/product/index.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);

// Category routes
router.use("/categories", categoryRoutes);

// Product routes
router.use("/products", productRoutes);

// Other routes will be mounted here in future sprints

export default router;
