// 'use client'

// import React, { useState, useCallback, useEffect } from 'react'
// import { fetchCarts, deleteCart, createCart } from '@/api/cart-api'
// import { useAtom } from 'jotai'
// import { tokenAtom, useInitializeUser } from '@/utils/user'
// import { GetCart } from '@/utils/type'
// import { Button } from '@/components/ui/button'
// import { Minus, Plus } from 'lucide-react'
// import Image from 'next/image'

// const CartsPage = () => {
//   useInitializeUser() // initialize user info

//   const [token] = useAtom(tokenAtom)
//   const [carts, setCarts] = useState<GetCart[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   // ✅ Fetch all carts
//   const loadCarts = useCallback(async () => {
//     if (!token) {
//       setError('Please log in to view your cart.')
//       setLoading(false)
//       return
//     }

//     try {
//       setLoading(true)
//       setError(null)
//       const res = await fetchCarts(token)

//       if (!res || !res.data) {
//         setError('No carts found.')
//         return
//       }

//       setCarts(res.data)
//     } catch (err) {
//       console.error('Failed to load carts:', err)
//       setError('Failed to load carts.')
//     } finally {
//       setLoading(false)
//     }
//   }, [token])

//   // ✅ Delete a specific cart item
//   const handleDelete = useCallback(
//     async (productId: number) => {
//       if (!token) {
//         setError('Please log in to delete cart items.')
//         return
//       }

//       try {
//         await deleteCart(token, productId)
//         // refresh cart after delete
//         await loadCarts()
//       } catch (err) {
//         console.error('Failed to delete cart:', err)
//         setError('Failed to delete cart.')
//       }
//     },
//     [token, loadCarts]
//   )

//   // ✅ Decrease quantity (delete if quantity becomes 0)
//   const handleDecrease = useCallback(
//     async (productId: number) => {
//       if (!token) return

//       try {
//         // For now, just delete the item when clicking minus
//         // You may need to add an updateCart API if you want to decrease quantity
//         await deleteCart(token, productId)
//         await loadCarts()
//       } catch (err) {
//         console.error('Failed to decrease quantity:', err)
//         setError('Failed to update cart.')
//       }
//     },
//     [token, loadCarts]
//   )

//   // ✅ Increase quantity
//   const handleIncrease = useCallback(
//     async (productId: number) => {
//       if (!token) {
//         setError('Please log in to update cart.')
//         return
//       }

//       try {
//         console.log('Adding product to cart:', productId)

//         const response = await createCart(token, { productId })

//         console.log('Cart response:', response)

//         if (response?.data) {
//           // Reload cart from database
//           await loadCarts()
//         } else {
//           setError('Failed to add product to cart.')
//         }
//       } catch (err: any) {
//         console.error('Failed to add to cart:', err)
//         setError(err.message || 'Failed to update cart.')
//       }
//     },
//     [token, loadCarts]
//   )

//   useEffect(() => {
//     loadCarts()
//   }, [loadCarts])

//   if (loading) return <p className="text-gray-600">Loading carts...</p>
//   if (error) return <p className="text-red-500">{error}</p>

//   return (
//     <div>
//       <h1 className="text-2xl font-semibold text-gray-800 mb-4">My Cart</h1>
//       <div className="bg-white rounded-lg shadow p-6">
//         {carts.length === 0 ? (
//           <p className="text-gray-600">Your cart is empty.</p>
//         ) : (
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr>
//                 <th className="border-b p-3 w-16">#</th>
//                 <th className="border-b p-3">Image</th>
//                 <th className="border-b p-3">Product Name</th>
//                 <th className="border-b p-3">Price</th>
//                 <th className="border-b p-3">Added On</th>
//                 <th className="border-b p-3 text-center">Quantity</th>
//               </tr>
//             </thead>
//             <tbody>
//               {carts.map((item, index) => (
//                 <tr key={item.cartId} className="hover:bg-gray-50">
//                   <td className="p-3">{index + 1}</td>
//                   <td className="px-4 py-2 border">
//                     <div className="w-20 h-20 relative mx-auto">
//                       <Image
//                         src={item.url}
//                         alt={item.name}
//                         fill
//                         className="object-cover rounded"
//                       />
//                     </div>
//                   </td>
//                   <td className="p-3">{item.name}</td>
//                   <td className="p-3">৳ {item.price * item.quantity}</td>
//                   <td className="p-3">
//                     {new Date(item.createdAt).toLocaleDateString()}
//                   </td>
//                   <td className="p-3">
//                     <div className="flex items-center justify-center gap-3">
//                       <Button
//                         variant="outline"
//                         size="icon"
//                         className="h-8 w-8 border-gray-300 hover:bg-gray-100"
//                         onClick={() => handleDecrease(item.productId)}
//                       >
//                         <Minus className="w-4 h-4" />
//                       </Button>
//                       <span className="text-lg font-medium min-w-[2rem] text-center">
//                         {item.quantity}
//                       </span>
//                       <Button
//                         variant="outline"
//                         size="icon"
//                         className="h-8 w-8 border-gray-300 hover:bg-gray-100"
//                         onClick={() => handleIncrease(item.productId)}
//                       >
//                         <Plus className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   )
// }

// export default CartsPage


'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { fetchCarts, deleteCart, createCart } from '@/api/cart-api'
import { useAtom } from 'jotai'
import { tokenAtom, useInitializeUser } from '@/utils/user'
import { GetCart } from '@/utils/type'
import { Button } from '@/components/ui/button'
import { Minus, Plus } from 'lucide-react'
import Image from 'next/image'

const CartsPage = () => {
  useInitializeUser() // initialize user info

  const [token] = useAtom(tokenAtom)
  const [carts, setCarts] = useState<GetCart[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ✅ Fetch all carts
  const loadCarts = useCallback(async () => {
    if (!token) {
      setError('Please log in to view your cart.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const res = await fetchCarts(token)

      if (!res || !res.data) {
        setError('No carts found.')
        return
      }

      setCarts(res.data)
    } catch (err) {
      console.error('Failed to load carts:', err)
      setError('Failed to load carts.')
    } finally {
      setLoading(false)
    }
  }, [token])

  // ✅ Delete a specific cart item
  const handleDelete = useCallback(
    async (productId: number) => {
      if (!token) {
        setError('Please log in to delete cart items.')
        return
      }

      try {
        await deleteCart(token, productId)
        // refresh cart after delete
        await loadCarts()
      } catch (err) {
        console.error('Failed to delete cart:', err)
        setError('Failed to delete cart.')
      }
    },
    [token, loadCarts]
  )

  // ✅ Decrease quantity (delete if quantity becomes 0)
  const handleDecrease = useCallback(
    async (productId: number) => {
      if (!token) return

      try {
        // For now, just delete the item when clicking minus
        // You may need to add an updateCart API if you want to decrease quantity
        await deleteCart(token, productId)
        await loadCarts()
      } catch (err) {
        console.error('Failed to decrease quantity:', err)
        setError('Failed to update cart.')
      }
    },
    [token, loadCarts]
  )

  // ✅ Increase quantity
  const handleIncrease = useCallback(
    async (productId: number) => {
      if (!token) {
        setError('Please log in to update cart.')
        return
      }

      try {
        console.log('Adding product to cart:', productId)

        const response = await createCart(token, { productId })

        console.log('Cart response:', response)

        if (response?.data) {
          // Reload cart from database
          await loadCarts()
        } else {
          setError('Failed to add product to cart.')
        }
      } catch (err: any) {
        console.error('Failed to add to cart:', err)
        setError(err.message || 'Failed to update cart.')
      }
    },
    [token, loadCarts]
  )

  useEffect(() => {
    loadCarts()
  }, [loadCarts])

  if (loading) return <p className="text-sm sm:text-base text-gray-600">Loading carts...</p>
  if (error) return <p className="text-sm sm:text-base text-red-500">{error}</p>

  return (
    <div className="w-full">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">My Cart</h1>
      <div className="bg-white rounded-lg shadow p-3 sm:p-6">
        {carts.length === 0 ? (
          <p className="text-sm sm:text-base text-gray-600">Your cart is empty.</p>
        ) : (
          <>
            {/* Mobile Card View - visible only on small screens */}
            <div className="block lg:hidden space-y-4">
              {carts.map((item, index) => (
                <div key={item.cartId} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex gap-3">
                    {/* Image */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 relative flex-shrink-0">
                      <Image
                        src={item.url}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-medium text-gray-800 truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        Price: ৳ {item.price * item.quantity}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 sm:h-8 sm:w-8 border-gray-300"
                          onClick={() => handleDecrease(item.productId)}
                        >
                          <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                        <span className="text-sm sm:text-base font-medium min-w-[1.5rem] text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 sm:h-8 sm:w-8 border-gray-300"
                          onClick={() => handleIncrease(item.productId)}
                        >
                          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
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
                    <th className="border-b p-3 w-16">#</th>
                    <th className="border-b p-3">Image</th>
                    <th className="border-b p-3">Product Name</th>
                    <th className="border-b p-3">Price</th>
                    <th className="border-b p-3">Added On</th>
                    <th className="border-b p-3 text-center">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {carts.map((item, index) => (
                    <tr key={item.cartId} className="hover:bg-gray-50">
                      <td className="p-3">{index + 1}</td>
                      <td className="px-4 py-2 border">
                        <div className="w-20 h-20 relative mx-auto">
                          <Image
                            src={item.url}
                            alt={item.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      </td>
                      <td className="p-3">{item.name}</td>
                      <td className="p-3">৳ {item.price * item.quantity}</td>
                      <td className="p-3">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-gray-300 hover:bg-gray-100"
                            onClick={() => handleDecrease(item.productId)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="text-lg font-medium min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-gray-300 hover:bg-gray-100"
                            onClick={() => handleIncrease(item.productId)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CartsPage