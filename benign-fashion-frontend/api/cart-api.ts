import { fetchApi } from '@/utils/http'
import { AddToCartResponse, GetCart } from '@/utils/type'

//get all carts api
export async function fetchCarts(token: string) {
  return fetchApi<GetCart[]>({
    url: 'api/cart/get-cart',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
  })
}

export async function createCart(token: string, data: { productId: number }) {
  console.log("tokensdsdsd:", token)

  return fetchApi<AddToCartResponse>({
    url: 'api/cart/create-cart',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: ` ${token}`, // important
    },
    body: data,
  })
}
// export async function createCart(token: string, data: { productId: number }) {
//   console.log("Creating cart with product ID:", data.productId)

//   return fetchApi<AddToCartResponse>({
//     url: 'api/cart/create-cart',
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: token,
//     },
//     body: data, // ✅ Pass the object directly, let fetchApi stringify it
//   })
// }

// ✅ Delete a cart by productId
export async function deleteCart(token: string, productId: number) {
  return fetchApi({
    url: `api/cart/delete-cart/${productId}`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
  })
}
