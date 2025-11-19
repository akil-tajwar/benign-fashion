
import { eq } from "drizzle-orm";
import { db } from "../config/database";
import { orders, payments } from "../schemas";

export const createPayment = async (
  userId: number,
  orderId: number,
  method: "cash" | "bkash",
  amount: number,
  transactionId?: string
) => {
  const validMethods = ["cash", "bkash"];
  if (!validMethods.includes(method)) {
    throw new Error("Invalid payment method");
  }

  // Check order exists
  const order = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order[0]) {
    throw new Error("Order not found");
  }

  // Insert payment
  const [payment] = await db
    .insert(payments)
    .values({
      userId,
      orderId,
      method,
      amount,
      transactionId,
      status: "pending",
    })
    .$returningId();

  return { message: "Payment created", payment };
};

export const getPaymentsByUser = async (userId: number) => {
  return await db.select().from(payments).where(eq(payments.userId, userId));
};

export const updatePaymentStatus = async (
  paymentId: number,
  status: "pending" | "completed" | "failed"
) => {
  const validStatuses = ["pending", "completed", "failed"];
  if (!validStatuses.includes(status)) {
    throw new Error("Invalid status");
  }

  await db.update(payments).set({ status }).where(eq(payments.id, paymentId));

  return { message: `Payment ${paymentId} updated to ${status}` };
};
