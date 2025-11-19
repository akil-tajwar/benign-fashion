// // 'use client'

// // import '../../globals.css'
// // import ProductDetails from '@/components/product/product-details'
// // import { products } from '@/data/products'
// // import { useState } from 'react'
// // import { use } from 'react' // ✅ new React API

// // export default function ProductPage({
// //   params,
// // }: {
// //   params: Promise<{ id: string }>
// // }) {
// //   const { id } = use(params) // ✅ unwrap with React.use()
// //   const [isOpen, setIsOpen] = useState(true)

// //   const product = products.find((p) => p.id === parseInt(id))

// //   if (!product) return <div>Product not found</div>

// //   return (
// //     <ProductDetails
// //       product={product}
// //       isOpen={isOpen}
// //       onClose={() => setIsOpen(false)}
// //       onAddToCart={(p) => {
// //         console.log('Added to cart:', p)
// //       }}
// //     />
// //   )
// // }


// 'use client'

// import '../../globals.css'
// import ProductDetails from '@/components/product/product-details'
// import { useState, useEffect } from 'react'
// import { use } from 'react'
// import { fetchProducts } from '@/api/product-api'
// import { useAtom } from 'jotai'
// import { tokenAtom, useInitializeUser } from '@/utils/user'
// import { GetProduct } from '@/utils/type'

// export default function ProductPage({
//   params,
// }: {
//   params: Promise<{ id: string }>
// }) {
//   const { id } = use(params)
//   useInitializeUser()
//   const [token] = useAtom(tokenAtom)

//   const [product, setProduct] = useState<GetProduct | null>(null)
//   const [isOpen, setIsOpen] = useState(true)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const loadProduct = async () => {
//       try {
//         const response = await fetchProducts(token)
//         if (response?.data) {
//           const found = response.data.find((p) => p.id === parseInt(id))
//           setProduct(found || null)
//         }
//       } catch (error) {
//         console.error('Error fetching products:', error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     if (token) {
//       loadProduct()
//     }
//   }, [token, id])

//   if (loading) return <div>Loading product...</div>
//   if (!product) return <div>Product not found</div>

//   return (
//     <ProductDetails
//       product={product}
//       isOpen={isOpen}
//       onClose={() => setIsOpen(false)}
//       onAddToCart={(p) => {
//         console.log('Added to cart:', p)
//       }}
//     />
//   )
// }

'use client'
import '../../globals.css'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ProductDetails from '@/components/product/product-details'
import { fetchProducts } from '@/api/product-api'
import { GetProduct } from '@/utils/type'
import { useAtom } from 'jotai'
import { tokenAtom, useInitializeUser } from '@/utils/user'
import { Toaster } from '@/components/ui/toaster'

export default function ProductDetailsPage() {
  useInitializeUser()
  const params = useParams()
  const [token] = useAtom(tokenAtom)
  const [product, setProduct] = useState<GetProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productId = Number(params.id)
        const res = await fetchProducts(token)
        const foundProduct = res.data?.find((p: GetProduct) => p.id === productId)
        
        if (foundProduct) {
          // Fix image URL
          const productWithUrl = {
            ...foundProduct,
            url: foundProduct.url.startsWith('http')
              ? foundProduct.url
              : `https://anukabd.com/api/${foundProduct.url}`,
          }
          setProduct(productWithUrl)
        } else {
          setError('Product not found')
        }
      } catch (err) {
        console.error(err)
        setError('Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadProduct()
    }
  }, [params.id, token])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading product...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-red-600">{error || 'Product not found'}</p>
      </div>
    )
  }

  return (
    <>
      <ProductDetails product={product} />
      <Toaster />
    </>
  )
}