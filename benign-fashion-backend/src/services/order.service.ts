
import { eq, desc, and, isNotNull } from 'drizzle-orm'
import { db } from '../config/database'
import { ordersDetailsModel, ordersMasterModel, productsModel } from '../schemas'
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
        userId: payload.orderMaster.userId ?? 0,
        fullName: payload.orderMaster.fullName,
        division: payload.orderMaster.division,
        district: payload.orderMaster.district,
        address: payload.orderMaster.address,
        phone: payload.orderMaster.phone,
        email: payload.orderMaster.email ?? null,
        status: payload.orderMaster.status,
        method: payload.orderMaster.method,
        billingPhone: payload.orderMaster.phone,
        transactionId: payload.orderMaster.transactionId ?? '',
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

export const getOrdersByUserId = async (userId: number) => {
  if (!userId || Number.isNaN(userId)) {
    return []
  }

  const masters = await db
    .select()
    .from(ordersMasterModel)
    .where(
      and(
        eq(ordersMasterModel.userId, userId),
        isNotNull(ordersMasterModel.userId)
      )
    )
    .orderBy(desc(ordersMasterModel.createdAt))

    const orders = await Promise.all(
      masters.map(async (master) => {
        const details = await db
          .select({
            id: ordersDetailsModel.id,
            ordersMasterId: ordersDetailsModel.ordersMasterId,
            productId: ordersDetailsModel.productId,
            productName: productsModel.name,
            size: ordersDetailsModel.size,
            quantity: ordersDetailsModel.quantity,
            amount: ordersDetailsModel.amount,
            createdAt: ordersDetailsModel.createdAt,
          })
          .from(ordersDetailsModel)
          .leftJoin(
            productsModel,
            eq(ordersDetailsModel.productId, productsModel.id)
          )
          .where(eq(ordersDetailsModel.ordersMasterId, master.id))
  
        return {
          orderMaster: master,
          orderDetails: details,
        }
    })
  )

  return orders
}

export const deleteOrder = async (orderMasterId: number) => {
  if (!orderMasterId || Number.isNaN(orderMasterId)) {
    throw new Error('Invalid orderMasterId')
  }

  return await db.transaction(async (trx) => {
    // 1️⃣ Delete order details first
    await trx
      .delete(ordersDetailsModel)
      .where(eq(ordersDetailsModel.ordersMasterId, orderMasterId))

    // 2️⃣ Delete order master
    const result = await trx
      .delete(ordersMasterModel)
      .where(eq(ordersMasterModel.id, orderMasterId))

    return {
      orderMasterId,
      message: 'Order deleted successfully',
    }
  })
}

export const confirmOrder = async (orderMasterId: number) => {
  if (!orderMasterId || Number.isNaN(orderMasterId)) {
    throw new Error('Invalid orderMasterId')
  }

  const result = await db
    .update(ordersMasterModel)
    .set({
      status: 'confirmed',
    })
    .where(eq(ordersMasterModel.id, orderMasterId))

  return {
    orderMasterId,
    status: 'confirmed',
    message: 'Order confirmed successfully',
  }
}

export const completeOrder = async (orderMasterId: number) => {
  if (!orderMasterId || Number.isNaN(orderMasterId)) {
    throw new Error('Invalid orderMasterId')
  }

  const result = await db
    .update(ordersMasterModel)
    .set({
      status: 'delivered',
    })
    .where(eq(ordersMasterModel.id, orderMasterId))

  return {
    orderMasterId,
    status: 'delivered',
    message: 'Order marked as delivered',
  }
}