import { Router } from "express";
import { addToCartController, getUserCartController, removeFromCartController } from "../controllers/cart.controller";
import { authenticateUser } from "../middlewares/auth.middleware";


const router = Router();

router.post("/create-cart", authenticateUser, addToCartController);
router.get("/get-cart",authenticateUser, getUserCartController);
router.delete("/delete-cart/:productId", authenticateUser, removeFromCartController);

export default router;
