


// 'use client'

// import React, { useEffect, useState, useCallback } from 'react'
// import { fetchCarts, createCart, deleteCart } from '@/api/cart-api'
// import { GetCart } from '@/utils/type'
// import { useAtom } from 'jotai'
// import { tokenAtom, useInitializeUser, userDataAtom } from '@/utils/user'

// const CartsPage = () => {
//   useInitializeUser()
//   const [token] = useAtom(tokenAtom)
//   const [userData] = useAtom(userDataAtom)
//   const [carts, setCarts] = useState<GetCart[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [productId, setProductId] = useState('')
//   const [userId, setUserId] = useState('')
//   console.log('userData:', userData)

//   // ✅ Fetch all carts
//   const getAllCarts = useCallback(async () => {
//     try {
//       setLoading(true)
//       const response = await fetchCarts(token)
//       setCarts(response.data || [])
//       console.log('Carts:', response.data || [])
//     } catch (err: any) {
//       setError('Failed to fetch carts.')
//       console.error(err)
//     } finally {
//       setLoading(false)
//     }
//   }, [token])

//   useEffect(() => {
//      getAllCarts()
//   }, [token, getAllCarts])

//   // ✅ Handle create cart
//   const handleCreateCart = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!userId || !productId)
//       return alert('Please enter both user ID and product ID')

//     try {
//       await createCart(token, {
//         userId: Number(userId),
//         productId: Number(productId),
//       })
//       setUserId('')
//       setProductId('')
//       await getAllCarts()
//     } catch (err) {
//       console.error(err)
//       alert('Failed to create cart')
//     }
//   }

//   // ✅ Handle delete cart
//   const handleDeleteCart = async (productId: number) => {
//     if (!confirm('Are you sure you want to delete this cart?')) return
//     try {
//       await deleteCart(token, productId)
//       await getAllCarts()
//     } catch (err) {
//       console.error(err)
//       alert('Failed to delete cart')
//     }
//   }

//   return (
//     <section>
//       <h1 className="text-2xl font-semibold mb-4">Manage Carts</h1>

//       {/* ✅ Create Cart Form */}
//       <form
//         onSubmit={handleCreateCart}
//         className="flex flex-wrap items-center gap-3 mb-6 bg-white p-4 rounded-lg shadow"
//       >
//         <input
//           type="number"
//           placeholder="Enter User ID"
//           value={userId}
//           onChange={(e) => setUserId(e.target.value)}
//           className="border border-gray-300 rounded px-3 py-2 w-1/4"
//         />
//         <input
//           type="number"
//           placeholder="Enter Product ID"
//           value={productId}
//           onChange={(e) => setProductId(e.target.value)}
//           className="border border-gray-300 rounded px-3 py-2 w-1/4"
//         />
//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           Add Cart
//         </button>
//       </form>

//       {/* ✅ Cart Table */}
//       <div className="bg-white rounded-lg shadow p-6">
//         {loading ? (
//           <p>Loading carts...</p>
//         ) : error ? (
//           <p className="text-red-500">{error}</p>
//         ) : carts.length === 0 ? (
//           <p>No carts found.</p>
//         ) : (
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="border-b">
//                 <th className="p-2">Cart ID</th>
//                 <th className="p-2">Product ID</th>
//                 <th className="p-2">Name</th>
//                 <th className="p-2">Price</th>
//                 <th className="p-2">Created At</th>
//                 <th className="p-2 text-right">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {carts.map((cart) => (
//                 <tr key={cart.cartId} className="border-b hover:bg-gray-50">
//                   <td className="p-2">{cart.cartId}</td>
//                   <td className="p-2">{cart.productId}</td>
//                   <td className="p-2">{cart.name}</td>
//                   <td className="p-2">${cart.price}</td>
//                   <td className="p-2">
//                     {new Date(cart.createdAt).toLocaleString()}
//                   </td>
//                   <td className="p-2 text-right">
//                     <button
//                       onClick={() => handleDeleteCart(cart.productId)}
//                       className="text-red-600 hover:text-red-800 font-medium"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </section>
//   )
// }

// export default CartsPage



'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { fetchCarts, createCart, deleteCart } from '@/api/cart-api'
import { GetCart } from '@/utils/type'
import { useAtom } from 'jotai'
import { tokenAtom, useInitializeUser, userDataAtom } from '@/utils/user'

const CartsPage = () => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const [userData] = useAtom(userDataAtom)
  const [carts, setCarts] = useState<GetCart[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [productId, setProductId] = useState('')
  console.log('userData:', userData)

  // ✅ Fetch all carts
  const getAllCarts = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetchCarts(token)
      setCarts(response.data || [])
      console.log('Carts:', response.data || [])
    } catch (err: any) {
      setError('Failed to fetch carts.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    getAllCarts()
  }, [token, getAllCarts])

  // ✅ Handle create cart
  const handleCreateCart = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!productId)
      return alert('Please enter product ID')

    try {
      await createCart(token, {
        productId: Number(productId),
      })
      setProductId('')
      await getAllCarts()
    } catch (err) {
      console.error(err)
      alert('Failed to create cart')
    }
  }

  // ✅ Handle delete cart
  const handleDeleteCart = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this cart?')) return
    try {
      await deleteCart(token, productId)
      await getAllCarts()
    } catch (err) {
      console.error(err)
      alert('Failed to delete cart')
    }
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">Manage Carts</h1>

      {/* ✅ Create Cart Form */}
      <form
        onSubmit={handleCreateCart}
        className="flex flex-wrap items-center gap-3 mb-6 bg-white p-4 rounded-lg shadow"
      >
        <input
          type="number"
          placeholder="Enter Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-1/3"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add to Cart
        </button>
      </form>

      {/* ✅ Cart Table */}
      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <p>Loading carts...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : carts.length === 0 ? (
          <p>No carts found.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2">Cart ID</th>
                <th className="p-2">Product ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Price</th>
                <th className="p-2">Created At</th>
                <th className="p-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {carts.map((cart) => (
                <tr key={cart.cartId} className="border-b hover:bg-gray-50">
                  <td className="p-2">{cart.cartId}</td>
                  <td className="p-2">{cart.productId}</td>
                  <td className="p-2">{cart.name}</td>
                  <td className="p-2">${cart.price}</td>
                  <td className="p-2">
                    {new Date(cart.createdAt).toLocaleString()}
                  </td>
                  <td className="p-2 text-right">
                    <button
                      onClick={() => handleDeleteCart(cart.productId)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}

export default CartsPage