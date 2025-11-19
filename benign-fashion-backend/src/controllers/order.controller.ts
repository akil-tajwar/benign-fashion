import { Request, Response, NextFunction } from "express";
import * as orderService from "../services/order.service";

export const createOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.userId;
    const { items } = req.body;

    if (!userId || !items) {
      res.status(400).json({ message: "userId and items are required" });
      return;
    }

    const result = await orderService.createOrder(userId, items);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// get all orders - admin

export const getAllOrdersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await orderService.getAllOrders();
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// get orders by user
export const getOrdersByUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.userId;
    const result = await orderService.getOrdersByUser(userId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateOrderStatusController = async (
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

    const result = await orderService.updateOrderStatus(Number(id), status);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
