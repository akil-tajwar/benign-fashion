'use client'

import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import type { GetProductType } from '@/utils/type'
import Link from 'next/link'

interface ProductCardProps {
  product: GetProductType
  onAddToCart: (product: GetProductType) => void
  onProductClick: (product: GetProductType) => void
}

export default function ProductCard({
  product,
  onAddToCart,
  onProductClick,
}: ProductCardProps) {
  const [isImageHovered, setIsImageHovered] = useState(false)
  const [isButtonHovered, setIsButtonHovered] = useState(false)

  const firstImage =
    product.photoUrls?.[0]?.url || '/diverse-products-still-life.png'

  const handleProductClick = () => {
    onProductClick(product)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden h-full flex flex-col">
      {/* Image Section with hover zoom */}
      <Link
        href={`/product-details/${product.product.id}`}
        className="aspect-square relative overflow-hidden bg-gray-100"
        onClick={handleProductClick}
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
      >
        <Image
          height={300}
          width={300}
          src={firstImage || '/placeholder.svg'}
          alt={product.product.name}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isImageHovered ? 'scale-110' : 'scale-100'
          }`}
        />
      </Link>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1" onClick={handleProductClick}>
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm md:text-base">
          {product.product.name}
        </h3>

        <p className="text-xs text-gray-500 mb-3 line-clamp-1">
          {product.categoryName}
        </p>

        <div className="flex items-center justify-between mb-3 mt-auto">
          <div className="flex items-center space-x-2">
            <span className="text-base md:text-lg font-bold text-gray-900">
              ৳{product.product.price}
            </span>
            {product.product.discount > 0 && (
              <span className="text-xs text-red-500 line-through">
                ৳{product.product.price + product.product.discount}
              </span>
            )}
          </div>
          <span
            className={`text-xs px-2 py-1 rounded ${
              product.product.isAvailable
                ? 'bg-blue-100 text-blue-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {product.product.isAvailable ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        <Button
          onClick={(e) => {
            e.stopPropagation()
            onAddToCart(product)
          }}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
          disabled={!product.product.isAvailable}
          className="w-full text-white disabled:bg-gray-300 transition-all duration-500 text-sm md:text-base h-9 md:h-10 bg-blue-600 hover:bg-blue-700"
        >
          <div className="relative flex items-center justify-center overflow-hidden h-5">
            {/* Text */}
            <div
              className={`transition-transform duration-500 ease-in-out ${
                isButtonHovered ? '-translate-y-full' : 'translate-y-0'
              }`}
            >
              <span className="block">Add to Cart</span>
            </div>

            {/* Shopping Cart */}
            <div
              className={`absolute transition-transform duration-500 ease-in-out ${
                isButtonHovered ? 'translate-y-0' : 'translate-y-full'
              }`}
            >
              <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
            </div>
          </div>
        </Button>
      </div>
    </div>
  )
}
