import { Router } from "express";
import {
  createOrderController,
  getAllOrdersController,
  getOrdersByUserController,
  updateOrderStatusController,
} from "../controllers/order.controller";
import { authenticateUser } from "../middlewares/auth.middleware";


const router = Router();

router.post("/create-orders", authenticateUser, createOrderController);
router.get("/all-orders", authenticateUser, getAllOrdersController);
router.get("/get-orders-by-users", authenticateUser, getOrdersByUserController);
router.put("/update-orders/:id/status", authenticateUser, updateOrderStatusController);

export default router;
