'use client'

import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { tokenAtom, useInitializeUser } from '@/utils/user'
import type { GetProductType } from '@/utils/type'
import { fetchProductById, fetchProducts } from '@/utils/api'
import { useToast } from '@/hooks/use-toast'
import { ChevronRight, Minus, Plus } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '../ui/button'
import size from '../../public/size.jpeg'
import { useCart } from '@/hooks/use-cart'

export default function ProductDetails() {
  useInitializeUser()
  const params = useParams()
  const { addToCart } = useCart()
  const { toast } = useToast()
  const id = Number(params.id)
  const [token] = useAtom(tokenAtom)
  const [product, setProduct] = useState<GetProductType | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<GetProductType[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)

  const getProductbyId = useCallback(async () => {
    if (!token) return

    const product = await fetchProductById(token, id)

    if (product.error || !product.data) {
      console.error('Error getting product:', product.error)
      toast({
        title: 'Error',
        description: product.error?.message || 'Failed to get product',
      })
    } else {
      setProduct(product.data)
    }
  }, [token, id, toast])

  const getRelatedProducts = useCallback(
    async (currentProduct: GetProductType) => {
      if (!token) return

      const products = await fetchProducts(token)

      if (products.error || !products.data) {
        console.error('Error getting products:', products.error)
      } else {
        const filtered = products.data.filter(
          (p) =>
            p.product.categoryId === currentProduct.product.categoryId &&
            p.product.subCategoryId === currentProduct.product.subCategoryId &&
            p.product.id !== currentProduct.product.id
        )
        setRelatedProducts(filtered)
      }
    },
    [token]
  )

  useEffect(() => {
    setLoading(true)
    getProductbyId()
  }, [getProductbyId])

  useEffect(() => {
    if (product) {
      getRelatedProducts(product)
      setLoading(false)
    }
  }, [product, getRelatedProducts])

  if (loading || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    )
  }

  const images = product.photoUrls || []
  const discountedPrice =
    product.product.price * (1 - product.product.discount / 100)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const image = document.getElementById('zoom-image') as HTMLElement
    if (!image) return

    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()

    const x = ((e.pageX - left) / width) * 100
    const y = ((e.pageY - top) / height) * 100

    image.style.transform = `scale(1.8)`
    image.style.transformOrigin = `${x}% ${y}%`
  }

  const resetZoom = () => {
    const image = document.getElementById('zoom-image') as HTMLElement
    if (!image) return
    image.style.transform = `scale(1)`
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: 'Size Required',
        description: 'Please select a size before adding to cart.',
        variant: 'destructive',
      })
      return
    }

    if (!product) return

    addToCart(product, selectedSize, quantity)

    toast({
      title: 'Added to Cart',
      description: `${product.product.name} (Size: ${selectedSize}, Qty: ${quantity}) has been added to your cart.`,
    })

    // Reset selections
    setSelectedSize('')
    setQuantity(1)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Product Gallery */}
          <div className="flex gap-4">
            {/* Thumbnails */}
            <div className="flex flex-col gap-2 order-first">
              {images.length > 0 ? (
                images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-16 h-20 rounded overflow-hidden border-2 transition-colors ${
                      selectedImage === idx
                        ? 'border-foreground'
                        : 'border-muted-foreground/20'
                    }`}
                  >
                    <Image
                      src={image?.url}
                      alt="product"
                      className="w-full h-full object-cover border"
                      width={1280}
                      height={1280}
                    />
                  </button>
                ))
              ) : (
                <div className="w-16 h-20 bg-muted rounded flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">
                    No images
                  </span>
                </div>
              )}
            </div>

            {/* Main Image */}
            <div className="flex-1 relative">
              {product.product.discount > 0 && (
                <div className="absolute top-4 left-4 text-white bg-red-600 px-3 py-1 rounded text-sm font-semibold z-10">
                  -{product.product.discount}%
                </div>
              )}
              {images.length > 0 ? (
                <div
                  className="h-full overflow-hidden cursor-crosshair"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={resetZoom}
                >
                  <Image
                    src={images[selectedImage]?.url || '/placeholder.svg'}
                    alt={product.product.name}
                    className="w-full h-full object-cover rounded border transition-transform duration-300 ease-in-out"
                    width={1280}
                    height={1280}
                    id="zoom-image"
                  />
                </div>
              ) : (
                <div className="w-full h-96 bg-muted rounded flex items-center justify-center">
                  <span className="text-muted-foreground">
                    No image available
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-pretty">
                  {product.product.name}
                </h1>
              </div>
              <p className="text-sm text-muted-foreground">
                Product Code: {product.product.productCode}
              </p>
              <p className="text-sm text-muted-foreground">
                Category: {product.categoryName}
              </p>
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                {product.product.discount > 0 && (
                  <span className="text-lg text-muted-foreground line-through">
                    ৳ {product.product.price.toFixed(2)}
                  </span>
                )}
                <span className="text-3xl font-bold text-blue-600">
                  ৳ {discountedPrice.toFixed(2)}
                </span>
              </div>
              {product.product.discount > 0 && (
                <p className="text-sm text-green-600 font-medium">
                  You Save ৳
                  {(product.product.price - discountedPrice).toFixed(2)} (
                  {product.product.discount}%)
                </p>
              )}
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold">
                SELECT SIZE:{' '}
                {selectedSize && (
                  <span className="text-blue-600">({selectedSize})</span>
                )}
              </label>
              <div className="flex gap-2 flex-wrap">
                {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-5 py-2 border-2 rounded font-medium transition-all duration-200 ${
                      selectedSize === size
                        ? 'border-blue-600 bg-blue-600 text-white scale-105'
                        : 'border-gray-300 text-foreground hover:border-blue-400 hover:bg-blue-50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 border-2 border-gray-300 rounded px-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className=" hover:bg-gray-100 transition-colors border-r-2 pr-2 py-1 border-gray-300"
                  >
                    <Minus className="w-9 h-9 p-2" />
                  </button>
                  <span className="text-lg font-semibold w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className=" hover:bg-gray-100 transition-colors border-l-2 pl-2 py-1 border-gray-300"
                  >
                    <Plus className="w-9 h-9 p-2" />
                  </button>
                </div>

                <Button
                  variant={'default'}
                  className="flex-1 bg-blue-600 text-white py-6 text-lg rounded hover:bg-blue-700 transition-colors font-semibold"
                  onClick={handleAddToCart}
                  disabled={!selectedSize}
                >
                  ADD TO CART
                </Button>
              </div>

              {!selectedSize && (
                <p className="text-sm text-red-500">
                  ⚠️ Please select a size to add to cart
                </p>
              )}

              <div className="mt-6">
                <h3 className="font-semibold mb-2">Size Chart</h3>
                <Image
                  src={size}
                  alt="Size chart"
                  className="w-full h-full object-cover rounded border"
                  width={1280}
                  height={1280}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mb-16">
          <div className="border-b">
            <div className="py-8">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Product Description:</h3>
                  <p className="text-sm text-muted-foreground">
                    {product.product.description || 'No description available'}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Care & Washing:</h3>
                  <p className="text-sm text-muted-foreground">
                    Machine wash cold, gentle cycle. Do not bleach. Tumble dry
                    low or hang dry when needed.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Note:</h3>
                  <p className="text-sm text-red-500">
                    The color of the product may look slightly different because
                    of lighting and your device&apos;s screen settings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Related Products
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {relatedProducts.map((relatedProduct) => {
                const relatedDiscountedPrice =
                  relatedProduct.product.price *
                  (1 - relatedProduct.product.discount / 100)
                const mainImage = relatedProduct.photoUrls?.[0]?.url

                return (
                  <Link
                    key={relatedProduct.product.id}
                    href={`/product-details/${relatedProduct.product.id}`}
                  >
                    <div className="space-y-3 cursor-pointer group">
                      <div className="relative bg-muted rounded overflow-hidden aspect-square">
                        {relatedProduct.product.discount > 0 && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold z-10">
                            -{relatedProduct.product.discount}%
                          </div>
                        )}
                        {mainImage ? (
                          <Image
                            src={mainImage || '/placeholder.svg'}
                            alt={relatedProduct.product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            width={1280}
                            height={1280}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <span className="text-xs text-muted-foreground">
                              No image
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium line-clamp-2">
                          {relatedProduct.product.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {relatedProduct.product.discount > 0 && (
                            <span className="text-xs text-muted-foreground line-through">
                              ৳ {relatedProduct.product.price.toFixed(2)}
                            </span>
                          )}
                          <span className="text-sm font-bold">
                            ৳ {relatedDiscountedPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
