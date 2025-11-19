import { Router } from "express";
import {
  createPaymentController,
  getPaymentsByUserController,
  updatePaymentStatusController,
} from "../controllers/payment.controller";
import { authenticateUser } from "../middlewares/auth.middleware";


const router = Router();

router.post("/create-payments", authenticateUser, createPaymentController);
router.get("/get-payments", authenticateUser, getPaymentsByUserController);
router.put("/update-payments/:id/status", authenticateUser, updatePaymentStatusController);

export default router;
