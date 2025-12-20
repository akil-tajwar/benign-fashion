import { Request, Response } from "express";
import {
  completeOrder,
  confirmOrder,
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrdersByUserId,
} from "../services/order.service";
import { z } from "zod";

export const ordersSchema = z.object({
  orderMaster: z.object({
    id: z.number().optional(),
    userId: z.number().nullable().optional(),
    fullName: z.string().max(255),
    division: z.string().max(15),
    district: z.string().max(15),
    address: z.string().max(100),
    phone: z.string().max(14),
    email: z.string().max(50).nullable().optional(),
    status: z.enum(["pending", "delivered"]).default("pending"),
    method: z.enum(["bkash", "nagad", "rocket"]),
    transactionId: z.string().max(255).nullable().optional(),
    totalAmount: z.number(),
    createdAt: z.string().optional(),
  }),

  orderDetails: z.array(
    z.object({
      id: z.number().optional(),
      ordersMasterId: z.number(),
      productId: z.number(),
      size: z.enum(["M", "L", "XL", "XXL"]),
      quantity: z.number().default(1),
      amount: z.number(),
      createdAt: z.string().optional(),
    })
  ),
});
export type CreateOrderType = z.infer<typeof ordersSchema>;
export type GetOrderType = z.infer<typeof ordersSchema>;

export const createOrderController = async (req: Request, res: Response) => {
  try {
    const result = await createOrder(req.body);
    console.log("🚀 ~ createOrderController ~ req.body:", req.body);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};

/**
 * GET ALL ORDERS
 */
export const getAllOrdersController = async (req: Request, res: Response) => {
  try {
    const result = await getAllOrders();

    res.status(200).json(result);
  } catch (error) {
    console.error("Get Orders Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

export const getOrdersByUserIdController = async (
  req: Request,
  res: Response
) => {
  try {
    let userIdParam = req.params.userId

    const userId = Number(userIdParam)

    if (!Number.isInteger(userId)) {
      res.status(400).json({
        success: false,
        message: "Invalid userId",
      })
    }

    const result = await getOrdersByUserId(userId)
    res.status(200).json(result)
  } catch (error) {
    console.error("Get Orders By User ID Error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch user orders",
    })
  }
}

export const deleteOrderController = async (
  req: Request,
  res: Response
) => {
  try {
    const orderMasterId = Number(req.params.orderMasterId)

    const result = await deleteOrder(orderMasterId)

    res.status(200).json({
      success: true,
      message: result.message,
      orderMasterId: result.orderMasterId,
    })
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to delete order',
    })
  }
}

export const confirmOrderController = async (req: Request, res: Response) => {
  try {
    const orderMasterId = Number(req.params.id)
    console.log("🚀 ~ confirmOrderController ~ req.params.id:", req.params.id)

    const result = await confirmOrder(orderMasterId)

    res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to confirm order',
    })
  }
}

export const completeOrderController = async (req: Request, res: Response) => {
  try {
    const orderMasterId = Number(req.params.id)

    const result = await completeOrder(orderMasterId)

    res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to complete order',
    })
  }
}