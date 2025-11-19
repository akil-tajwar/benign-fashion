'use client'

import { Button } from '@/components/ui/button'
import { Heart, Share2, ShoppingCart, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { GetProduct } from '@/utils/type'
import { useAtom } from 'jotai'
import { tokenAtom } from '@/utils/user'
import { createCart, fetchCarts } from '@/api/cart-api'
import { useToast } from '@/hooks/use-toast'

interface ProductDetailsProps {
  product: GetProduct
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter()
  const [token] = useAtom(tokenAtom)
  const { toast } = useToast()

  const handleGoBack = () => {
    router.back()
  }

  // Add to cart function with API integration and redirect
  const addToCart = async () => {
    if (!token) {
      toast({
        title: 'Login Required',
        description: 'Please login to add items to cart.',
        variant: 'destructive',
      })
      return
    }

    try {
      console.log('Adding product to cart:', product.id)

      const response = await createCart(token, { productId: product.id })

      console.log('Cart response:', response)

      if (response?.data) {
        // Show success message
        const message =
          response.data.message || 'Product added to cart successfully!'
        toast({
          title: 'Success',
          description: message,
        })

        // Redirect to home page after successful cart addition
        setTimeout(() => {
          router.push('/')
        }, 1000) // Wait 1 second to show toast before redirecting
      } else {
        toast({
          title: 'Error',
          description: 'Failed to add product to cart.',
          variant: 'destructive',
        })
      }
    } catch (err: any) {
      console.error('Failed to add to cart:', err)

      // Show more detailed error message
      toast({
        title: 'Error',
        description:
          err.message || 'Failed to add product to cart. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <Button
          variant="ghost"
          onClick={handleGoBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </Button>
        <h2 className="text-lg font-semibold text-gray-900">Product Details</h2>
        <div className="w-16"></div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Side - Image */}
          <div className="flex justify-center items-start">
            <div className="relative overflow-hidden rounded-lg bg-gray-100 w-full max-w-md">
              <Image
                height={800}
                width={800}
                src={product.url || '/placeholder.svg'}
                alt={product.name}
                className="w-full h-auto max-h-[500px] object-contain"
                priority
              />
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="space-y-6">
            {/* Title & Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {product.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    product.stock
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {product.stock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-blue-600">
                ৳{product.price}
              </span>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed text-base">
                {product.description ||
                  'No description available for this product.'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={addToCart}
                disabled={!product.stock}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 h-12"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="text-gray-600 hover:text-red-500 h-12 w-12"
                >
                  <Heart className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-gray-600 hover:text-blue-500 h-12 w-12"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Additional Info */}
          </div>
        </div>

        {/* Related Products */}
        {/* <div className="mt-16 pt-8 border-t border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Related Products
          </h3>
          <p className="text-gray-600">
            Related products will be shown here based on category or similar
            items.
          </p>
        </div> */}
      </div>
    </div>
  )
}
