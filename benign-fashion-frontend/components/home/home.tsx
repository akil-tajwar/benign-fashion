// app/page.tsx or components/home/page.tsx
'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import HeroSlider from './hero-slider'
import ProductCard from '../product/product-card'
import { fetchProducts } from '@/utils/api'
import { useToast } from '@/hooks/use-toast'
import { useAtom } from 'jotai'
import { tokenAtom, useInitializeUser } from '@/utils/user'
import type { GetProductType, GetCategoryType } from '@/utils/type'
import { Toaster } from '@/components/ui/toaster'
import { useSearch } from '@/hooks/use-search'
import { useRouter } from 'next/navigation'
import Loader from '@/utils/loader'
import { fetchCategories } from '@/utils/api'

export default function Home() {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const { toast } = useToast()
  const router = useRouter()
  const { searchQuery, filteredProducts, setAllProducts } = useSearch()

  const [products, setProducts] = useState<GetProductType[]>([])
  const [categories, setCategories] = useState<GetCategoryType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedProduct, setSelectedProduct] = useState<GetProductType | null>(
    null
  )
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)

  // Pagination state for categories
  const [categoryLimits, setCategoryLimits] = useState<Record<string, number>>(
    {}
  )

  // Refs for scrolling
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({})

  // Fetch categories
  const getCategories = useCallback(async () => {
    try {
      const res = await fetchCategories(token)
      setCategories(res.data ?? [])
    } catch (err) {
      console.error(err)
      setError('Failed to load categories')
    }
  }, [token])

  // Fetch products
  const getProducts = useCallback(async () => {
    try {
      const res = await fetchProducts(token)
      const productsData = res.data ?? []
      setProducts(productsData)
      setAllProducts(productsData)
    } catch (err) {
      console.error(err)
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [token, setAllProducts])

  useEffect(() => {
    getCategories()
    getProducts()
  }, [getCategories, getProducts])

  const menProducts = products.filter((product) => {
    const category = categories.find(
      (cat) => cat.id === product.product.categoryId
    )
    return category?.categoryType === 'men'
  })

  const kidsProducts = products.filter((product) => {
    const category = categories.find(
      (cat) => cat.id === product.product.categoryId
    )
    return category?.categoryType === 'kids'
  })

  const handleViewAll = (products: GetProductType[]) => {
    setCategoryLimits((prev) => ({
      ...prev,
      [products[0]?.product.categoryId]: products.length,
    }))
  }

  if (loading)
    return (
      <div className="text-center mt-10 min-h-[45vh] flex items-center justify-center">
        <Loader />
      </div>
    )
  if (error) return <p className="text-center text-red-500">{error}</p>

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Slider - Hidden when searching */}
      {!searchQuery && <HeroSlider />}

      {/* Search Results */}
      {searchQuery && (
        <section className="container mx-auto sm:px-3 pt-24 pb-8 md:pt-28 md:pb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Search Results for &quot;{searchQuery}&quot; (
            {filteredProducts.length} items)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Product Collections */}
      {!searchQuery && (
        <main className="container mx-auto sm:px-3 py-8 md:py-12">
          {menProducts.length > 0 && (
            <section
              ref={(el) => {
                categoryRefs.current['men'] = el
              }}
              id="men-collection"
              className="mb-12 md:mb-16"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Men&apos;s Collection
                </h2>
                {menProducts.length > 4 && (
                  <Button
                    variant="outline"
                    className="text-sm text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white bg-white px-4 py-2"
                    onClick={() => {
                      handleViewAll(menProducts)
                      router.push('/men-products')
                    }}
                  >
                    View All
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {menProducts
                  .slice(0, categoryLimits['men'] || 4)
                  .map((product) => (
                    <ProductCard key={product.product.id} product={product} />
                  ))}
              </div>
            </section>
          )}

          {kidsProducts.length > 0 && (
            <section
              ref={(el) => {
                categoryRefs.current['kids'] = el
              }}
              id="kids-collection"
              className="mb-12 md:mb-16"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Kid&apos;s Collection
                </h2>
                {kidsProducts.length > 4 && (
                  <Button
                    variant="outline"
                    className="text-sm text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white bg-white px-4 py-2"
                    onClick={() => {
                      handleViewAll(kidsProducts)
                      router.push('/men-products')
                    }}
                  >
                    View All
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {kidsProducts
                  .slice(0, categoryLimits['kids'] || 4)
                  .map((product) => (
                    <ProductCard key={product.product.id} product={product} />
                  ))}
              </div>
            </section>
          )}

          {menProducts.length === 0 && kidsProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No products available at the moment.
              </p>
            </div>
          )}
        </main>
      )}

      <Toaster />
    </div>
  )
}
