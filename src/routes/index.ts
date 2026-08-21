import { Router } from "express";
import { authRoutes } from "../modules/auth/index.js";

const router = Router();

router.use("/auth", authRoutes);

// Other routes will be mounted here in future sprints
// router.use("/admin", adminRoutes);
// router.use("/categories", categoryRoutes);
// router.use("/products", productRoutes);

export default router;
