import { Request, Response, NextFunction } from "express";
import * as paymentService from "../services/payment.service";

export const createPaymentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.userId;
    const { orderId, method, amount, transactionId } = req.body;

    if (!userId || !orderId || !method || !amount) {
      res.status(400).json({ message: "userId, orderId, method, and amount are required" });
      return;
    }

    const result = await paymentService.createPayment(userId, orderId, method, amount, transactionId);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getPaymentsByUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.userId;
    const result = await paymentService.getPaymentsByUser(userId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePaymentStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      res.status(400).json({ message: "status is required" });
      return;
    }

    const result = await paymentService.updatePaymentStatus(Number(id), status);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
