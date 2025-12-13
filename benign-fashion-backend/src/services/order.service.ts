
import { eq, desc } from 'drizzle-orm'
import { db } from '../config/database'
import { ordersDetailsModel, ordersMasterModel } from '../schemas'
import { CreateOrderType } from '../controllers/order.controller'

/**
 * CREATE ORDER (MASTER + DETAILS)
 */
export const createOrder = async (
  payload: CreateOrderType
) => {
  return await db.transaction(async (trx) => {
    // 1️⃣ Insert order master
    const [master] = await trx
      .insert(ordersMasterModel)
      .values({
        userId: payload.orderMaster.userId ?? null,
        fullName: payload.orderMaster.fullName,
        division: payload.orderMaster.division,
        district: payload.orderMaster.district,
        address: payload.orderMaster.address,
        phone: payload.orderMaster.phone,
        email: payload.orderMaster.email ?? null,
        status: payload.orderMaster.status,
        method: payload.orderMaster.method,
        transactionId: payload.orderMaster.transactionId ?? null,
        totalAmount: payload.orderMaster.totalAmount,
      })
      .$returningId()

    const ordersMasterId = master.id

    // 2️⃣ Insert order details
    const detailsData = payload.orderDetails.map((item) => ({
      ordersMasterId,
      productId: item.productId,
      size: item.size,
      quantity: item.quantity,
      amount: item.amount,
    }))

    await trx.insert(ordersDetailsModel).values(detailsData)

    return {
      ordersMasterId,
      message: 'Order created successfully',
    }
  })
}

/**
 * GET ALL ORDERS (MASTER + DETAILS)
 */
export const getAllOrders = async () => {
  const masters = await db
    .select()
    .from(ordersMasterModel)
    .orderBy(desc(ordersMasterModel.createdAt))

  const orders = await Promise.all(
    masters.map(async (master) => {
      const details = await db
        .select()
        .from(ordersDetailsModel)
        .where(eq(ordersDetailsModel.ordersMasterId, master.id))

      return {
        orderMaster: master,
        orderDetails: details,
      }
    })
  )

  return orders
}

export const getOrdersByUserId = async (
  userId: number
) => {
  const masters = await db
    .select()
    .from(ordersMasterModel)
    .where(eq(ordersMasterModel.userId, userId))
    .orderBy(desc(ordersMasterModel.createdAt))

  const orders = await Promise.all(
    masters.map(async (master) => {
      const details = await db
        .select()
        .from(ordersDetailsModel)
        .where(eq(ordersDetailsModel.ordersMasterId, master.id))

      return {
        orderMaster: master,
        orderDetails: details,
      }
    })
  )

  return orders
}