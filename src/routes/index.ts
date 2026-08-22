import { Router } from "express";
import { authRoutes } from "../modules/auth/index.js";
import { adminRoutes } from "../modules/admin/index.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);

// Other routes will be mounted here in future sprints
// router.use("/categories", categoryRoutes);
// router.use("/products", productRoutes);

export default router;
