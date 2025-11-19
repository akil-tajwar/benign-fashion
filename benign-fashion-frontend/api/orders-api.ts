import { fetchApi } from '@/utils/http'
import { CreateOrderRequest, GetAllOrdersType } from '@/utils/type'

//get all products api
export async function fetchOrders(token: string) {
  return fetchApi<GetAllOrdersType[]>({
    url: 'api/orders/all-orders',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
  })
}

// Update Order Status API
export async function updateOrderStatus(
  token: string,
  orderId: number,
  status: string
) {
  console.log('Calling updateOrderStatus API', orderId, status)
  return fetchApi<GetAllOrdersType>({
    url: `api/orders/update-orders/${orderId}/status`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
    body: { status }, // pass object directly
  })
}


// // create a new order
// export async function createOrderApi(
//   token: string,
//   data: {
//     userId: number
//     items: { productId: number; qty: number }[]
//   }
// ) {
//   return fetchApi<CreateOrderRequest[]>({
//     url: 'api/orders/create-orders',
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `${token}`,
//     },
//     body: data, // Send JSON object directly
//   })
// }


//get  product by users api
export async function fetchOrdersByUsers(token: string) {
  return fetchApi<GetAllOrdersType[]>({
    url: 'api/orders/get-orders-by-users',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
  })
}






// order-api.ts

interface CreateOrderResponse {
  message: string
  totalOrderAmount: number
}

interface OrderItem {
  productId: number
  qty: number
}

interface CreateOrderData {
  userId: number
  items: OrderItem[]
}



// Create a new order
export async function createOrderApi(
  token: string,
  data: CreateOrderData
) {
  return fetchApi<CreateOrderResponse>({
    url: 'api/orders/create-orders',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
    body: data,
  })
}