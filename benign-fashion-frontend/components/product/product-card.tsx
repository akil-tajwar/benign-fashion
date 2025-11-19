'use client'

import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GetProduct } from '@/utils/type'

interface ProductCardProps {
  product: GetProduct
  onAddToCart: (product: GetProduct) => void
  onProductClick: (product: GetProduct) => void
}

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  const [isImageHovered, setIsImageHovered] = useState(false)
  const [isButtonHovered, setIsButtonHovered] = useState(false)
  const router = useRouter()

  const handleProductClick = () => {
    router.push(`/product-details/${product.id}`)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
      {/* Image Section with hover zoom */}
      <div
        className="aspect-square relative overflow-hidden"
        onClick={handleProductClick}
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
      >
        <Image
          height={300}
          width={300}
          src={product.url || '/placeholder.svg'}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isImageHovered ? 'scale-100' : 'scale-110'
          }`}
        />
       
      </div>

      {/* Content Section */}
      <div className="p-4" onClick={handleProductClick}>
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm md:text-base">
          {product.name}
        </h3>


        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-base md:text-lg font-bold text-gray-900">
              ৳{product.price}
            </span>
          
          </div>
          <span
            className={`text-xs px-2 py-1 rounded ${
              product.stock
                ? 'bg-blue-100 text-blue-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {product.stock ? 'In Stock' : 'Out of Stock'}({product.stock})
          </span>
        </div>

        <Button
          onClick={(e) => {
            e.stopPropagation()
            onAddToCart(product)
          }}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
          disabled={!product.stock}
          className="min-w-full text-white disabled:bg-gray-300 transition-all duration-500 text-sm md:text-base h-9 md:h-10 
             bg-blue-500 hover:bg-blue-800"
        >
          <div className="relative flex items-center justify-center overflow-hidden h-5 md:h-5">
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
              <ShoppingCart className="w-4 h-3 md:w-6 md:h-6" />
            </div>
          </div>
        </Button>
      </div>
    </div>
  )
}



