import { Router } from "express";

import authRoutes from "./auth.routes";
import categoryRoutes from "./categories.routes";
import productRoutes from "./product.routes";
import reviewRoutes from "./review.routes";
import cartRoutes from "./cart.routes";
import orderRoutes from "./order.routes";
import paymentRoutes from "./payment.routes";
import { authenticateUser } from "../middlewares/auth.middleware";


const router = Router();

router.use("/auth", authRoutes);
router.use("/categories",  categoryRoutes);
router.use("/products", productRoutes);
router.use("/reviews", reviewRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/payments", paymentRoutes);


export default router;
