import { db } from "../config/database";
import { orders, products, userModel } from "../schemas";
import { eq } from "drizzle-orm";

export const createOrder = async (
  userId: number,
  items: { productId: number; qty: number }[]
) => {
  if (!items || items.length === 0) {
    throw new Error("Order must contain at least one item");
  }

  let totalOrderAmount = 0;

  // loop through items
  for (const item of items) {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, item.productId));

    if (!product) throw new Error(`Product ${item.productId} not found`);
    if (product.stock == null || product.stock < item.qty)
      throw new Error(`Not enough stock for product ${item.productId}`);

    const lineAmount = product.price * item.qty;
    totalOrderAmount += lineAmount;

    // deduct stock
    await db
      .update(products)
      .set({ stock: product.stock - item.qty })
      .where(eq(products.id, item.productId));

    // insert row in orders
    await db.insert(orders).values({
      userId,
      productId: item.productId,
      productQuantity: item.qty,
      status: "pending",
      totalAmount: lineAmount,
    });
  }

  return { message: "Order created successfully", totalOrderAmount };
};

// get all orders - admin
// export const getAllOrders = async () => {
//   return await db.select().from(orders);
// }
export const getAllOrders = async () => {
  return await db
    .select({
      id: orders.id,
      userId: orders.userId,
      productId:orders.productId,
      productQuantity: orders.productQuantity,
      totalAmount: orders.totalAmount,
      status: orders.status,
      createdAt: orders.createdAt,
      userName: userModel.username, // or userModel.username
    })
    .from(orders)
    .leftJoin(userModel, eq(orders.userId, userModel.userId))
}


// get orders by user

export const getOrdersByUser = async (userId: number) => {
  return await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId));
};

export const updateOrderStatus = async (orderId: number, status: string) => {
  const validStatuses = ["pending", "paid", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) {
    throw new Error("Invalid status");
  }

  await db.update(orders).set({ status: status as "pending" | "paid" | "delivered" | "cancelled" }).where(eq(orders.id, orderId));

  return { message: `Order ${orderId} updated to ${status}` };
};
