


// 'use client'

// import React, { useCallback, useEffect, useState } from 'react'
// import { fetchOrdersByUsers } from '@/api/orders-api'

// import { useAtom } from 'jotai'
// import { tokenAtom, useInitializeUser, userDataAtom } from '@/utils/user'
// import { GetAllOrdersType, GetProduct } from '@/utils/type'
// import { fetchProducts } from '@/api/product-api'

// const OrdersPage = () => {
//   useInitializeUser()
//   const [token] = useAtom(tokenAtom)
//   const [userData] = useAtom(userDataAtom)

//   const [orders, setOrders] = useState<GetAllOrdersType[]>([])

//   const [products, setProducts] = useState<GetProduct[]>([])

//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   // ✅ Fetch all products once
//   const getProducts = useCallback(async () => {
//     if (!token) return
//     try {
//       const response = await fetchProducts(token)
//       setProducts(response.data ?? [])
//     } catch (err: any) {
//       console.error(err)
//       setError(err.message || 'Failed to fetch products')
//     }
//   }, [token])

//   // ✅ Fetch user orders
//   const loadOrders = useCallback(async () => {
//     if (!token || !userData?.userId) return

//     setLoading(true)
//     setError(null)

//     try {
//       const res = await fetchOrdersByUsers(token)
//       if (!res || !res.data || res.data.length === 0) {
//         setError('No orders found.')
//         setOrders([])
//         return
//       }
//       setOrders(res.data)
//     } catch (err: any) {
//       console.error(err)
//       if (err?.status === 401 || err?.status === 403) {
//         setError('Unauthorized. Please log in again.')
//       } else {
//         setError('Failed to fetch orders.')
//       }
//     } finally {
//       setLoading(false)
//     }
//   }, [token, userData?.userId])

//   // ✅ Fetch both products and orders once token is ready
//   useEffect(() => {
//     if (token && userData?.userId) {
//       Promise.all([getProducts(), loadOrders()])
//     }
//   }, [token, userData?.userId, getProducts, loadOrders])

//   // ✅ Helper to get product name by ID
//   const getProductName = (id: string | number) => {
//     const product = products.find((p) => p.id === id)
//     return product ? product.name : 'Unknown Product'
//   }

//   if (loading) return <p className="text-gray-600">Loading orders...</p>
//   if (error) return <p className="text-red-600">{error}</p>

//   return (
//     <div>
//       <h1 className="text-2xl font-semibold text-gray-800 mb-4">My Orders</h1>

//       <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
//         {orders.length > 0 ? (
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr>
//                   <th className="border-b p-3">SL</th>
//                 <th className="border-b p-3">Product Name</th>
//                 <th className="border-b p-3">Quantity</th>
//                 <th className="border-b p-3">Status</th>
//                 <th className="border-b p-3">Total</th>
//               </tr>
//             </thead>
//             <tbody>
//              {orders.map((order, index) => (
//                 <tr key={order.id} className="hover:bg-gray-50">
//                    <td className="p-3">{index + 1}</td>
//                   <td className="p-3">{getProductName(order.productId)}</td>
//                   <td className="p-3">{order.productQuantity}</td>
//                   <td
//                     className={`p-3 font-medium ${
//                       order.status.toLowerCase() === 'delivered'
//                         ? 'text-blue-600'
//                         : order.status.toLowerCase() === 'pending'
//                           ? 'text-yellow-600'
//                           : 'text-gray-600'
//                     }`}
//                   >
//                     {order.status}
//                   </td>
//                   <td className="p-3">৳ {order.totalAmount}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <p className="text-gray-500 text-center py-4">No orders found.</p>
//         )}
//       </div>
//     </div>
//   )
// }

// export default OrdersPage


'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { fetchOrdersByUsers } from '@/api/orders-api'
import { useAtom } from 'jotai'
import { tokenAtom, useInitializeUser, userDataAtom } from '@/utils/user'
import { GetAllOrdersType, GetProduct } from '@/utils/type'
import { fetchProducts } from '@/api/product-api'

const OrdersPage = () => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const [userData] = useAtom(userDataAtom)

  const [orders, setOrders] = useState<GetAllOrdersType[]>([])
  const [products, setProducts] = useState<GetProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ✅ Fetch all products once
  const getProducts = useCallback(async () => {
    if (!token) return
    try {
      const response = await fetchProducts(token)
      setProducts(response.data ?? [])
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to fetch products')
    }
  }, [token])

  // ✅ Fetch user orders
  const loadOrders = useCallback(async () => {
    if (!token || !userData?.userId) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetchOrdersByUsers(token)
      if (!res || !res.data || res.data.length === 0) {
        setError('No orders found.')
        setOrders([])
        return
      }
      setOrders(res.data)
    } catch (err: any) {
      console.error(err)
      if (err?.status === 401 || err?.status === 403) {
        setError('Unauthorized. Please log in again.')
      } else {
        setError('Failed to fetch orders.')
      }
    } finally {
      setLoading(false)
    }
  }, [token, userData?.userId])

  // ✅ Fetch both products and orders once token is ready
  useEffect(() => {
    if (token && userData?.userId) {
      Promise.all([getProducts(), loadOrders()])
    }
  }, [token, userData?.userId, getProducts, loadOrders])

  // ✅ Helper to get product name by ID
  const getProductName = (id: string | number) => {
    const product = products.find((p) => p.id === id)
    return product ? product.name : 'Unknown Product'
  }

  if (loading) return <p className="text-sm sm:text-base text-gray-600">Loading orders...</p>
  if (error) return <p className="text-sm sm:text-base text-red-600">{error}</p>

  return (
    <div className="w-full">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">My Orders</h1>

      <div className="bg-white rounded-lg shadow p-3 sm:p-6">
        {orders.length > 0 ? (
          <>
            {/* Mobile Card View - visible only on small screens */}
            <div className="block lg:hidden space-y-3 sm:space-y-4">
              {orders.map((order, index) => (
                <div key={order.id} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                          #{index + 1}
                        </span>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded ${
                            order.status.toLowerCase() === 'delivered'
                              ? 'bg-blue-100 text-blue-700'
                              : order.status.toLowerCase() === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-medium text-gray-800">
                        {getProductName(order.productId)}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs sm:text-sm">
                    <div>
                      <span className="text-gray-500">Quantity:</span>
                      <span className="ml-1 font-medium text-gray-800">{order.productQuantity}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-500">Total:</span>
                      <span className="ml-1 font-semibold text-gray-900">৳ {order.totalAmount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View - hidden on small screens */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="border-b p-3">SL</th>
                    <th className="border-b p-3">Product Name</th>
                    <th className="border-b p-3">Quantity</th>
                    <th className="border-b p-3">Status</th>
                    <th className="border-b p-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{getProductName(order.productId)}</td>
                      <td className="p-3">{order.productQuantity}</td>
                      <td
                        className={`p-3 font-medium ${
                          order.status.toLowerCase() === 'delivered'
                            ? 'text-blue-600'
                            : order.status.toLowerCase() === 'pending'
                              ? 'text-yellow-600'
                              : 'text-gray-600'
                        }`}
                      >
                        {order.status}
                      </td>
                      <td className="p-3">৳ {order.totalAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center py-4 text-sm sm:text-base">No orders found.</p>
        )}
      </div>
    </div>
  )
}

export default OrdersPage