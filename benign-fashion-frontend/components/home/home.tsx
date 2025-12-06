'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Plus, Minus, X } from 'lucide-react'
import Image from 'next/image'
import SignIn, { UserType } from './login-form'
import RegisterForm from './register-form'
import CheckoutForm from './checkout-form'
import HeroSlider from './hero-slider'
import Footer from '../shared/footer'
import ProductCard from '../product/product-card'
import ProductDetails from '../product/product-details'
// REMOVED: import Navbar from '../shared/navbar'
import { fetchProducts } from '@/api/product-api'
import { fetchCategories } from '@/api/categories-api'
import { createCart, fetchCarts, deleteCart } from '@/api/cart-api'
import { useToast } from '@/hooks/use-toast'

import { useAtom } from 'jotai'
import { tokenAtom, useInitializeUser, userDataAtom } from '@/utils/user'
import type { GetProductType, GetCart, GetCategoryType } from '@/utils/type'
import { createOrderApi } from '@/api/orders-api'
import { Toaster } from '@/components/ui/toaster'
import { useSearch } from '@/hooks/use-search'

export default function Home() {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const [userData] = useAtom(userDataAtom)
  const { toast } = useToast()
  const { searchQuery, filteredProducts, setAllProducts } = useSearch() // Use global search context
  const [products, setProducts] = useState<GetProductType[]>([])
  const [categories, setCategories] = useState<GetCategoryType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [cartItems, setCartItems] = useState<GetCart[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState('')
  const [roleId, setRoleId] = useState<number | null>(null)
  const [savedRoleId, setSavedRoleId] = useState<number | null>(null)

  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const [selectedProduct, setSelectedProduct] = useState<GetProductType | null>(
    null
  )
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)

  // Pagination state for categories
  const [categoryLimits, setCategoryLimits] = useState<Record<number, number>>(
    {}
  )
  const [expandedCategories, setExpandedCategories] = useState<
    Record<number, boolean>
  >({})

  // Refs for scrolling
  const categoryRefs = useRef<Record<number, HTMLElement | null>>({})

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
      setAllProducts(productsData) // Update global context with all products
    } catch (err) {
      console.error(err)
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [token, setAllProducts])

  // Fetch user cart from DB
  const loadUserCart = useCallback(async () => {
    if (!token) return
    try {
      const res = await fetchCarts(token)
      setCartItems(res.data ?? [])
    } catch (err) {
      console.error(err)
      setError('Failed to load cart')
    }
  }, [token])

  useEffect(() => {
    getCategories()
    getProducts()
    loadUserCart()
  }, [getCategories, getProducts, loadUserCart])

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

  // Handle category click from navbar
  const handleCategoryClick = (categoryId: number) => {
    const categoryElement = categoryRefs.current[categoryId]
    if (categoryElement) {
      const yOffset = -80
      const y =
        categoryElement.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })

      setExpandedCategories((prev) => ({ ...prev, [categoryId]: true }))
      setCategoryLimits((prev) => ({ ...prev, [categoryId]: 12 }))
    }
  }

  // Handle product click from navbar submenu
  const handleProductClickFromNav = (productId: number) => {
    const product = products.find((p) => p.product.id === productId)
    if (product) {
      openProductModal(product)
    }
  }

  // REMOVED: handleSearchChange - now handled by global context

  // Add to cart function
  const addToCart = async (product: GetProductType) => {
    if (!token) {
      toast({
        title: 'Login Required',
        description: 'Please login to add items to cart.',
        variant: 'destructive',
      })
      return
    }

    try {
      const response = await createCart(token, {
        productId: product.product.id,
      })

      if (response?.data) {
        const message =
          response.data.message || 'Product added to cart successfully!'
        toast({
          title: 'Success',
          description: message,
        })

        await loadUserCart()
      } else {
        toast({
          title: 'Error',
          description: 'Failed to add product to cart.',
          variant: 'destructive',
        })
      }
    } catch (err: any) {
      console.error('Failed to add to cart:', err)
      toast({
        title: 'Error',
        description:
          err.message || 'Failed to add product to cart. Please try again.',
        variant: 'destructive',
      })
    }
  }

  // Update quantity in cart
  const updateQuantity = async (productId: number, change: number) => {
    if (!token) return

    const cartItem = cartItems.find((item) => item.productId === productId)
    const product = products.find((p) => p.product.id === productId)

    if (!cartItem || !product) return

    try {
      if (change > 0) {
        await createCart(token, { productId: product.product.id })
        await loadUserCart()
      } else {
        const response = await deleteCart(token, productId)

        if (response?.data) {
          await loadUserCart()
        } else {
          toast({
            title: 'Error',
            description: 'Failed to update cart.',
            variant: 'destructive',
          })
        }
      }
    } catch (err: any) {
      console.error('Failed to update cart:', err)
      toast({
        title: 'Error',
        description: err.message || 'Failed to update cart. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const openProductModal = (product: GetProductType) => {
    setSelectedProduct(product)
    setIsProductModalOpen(true)
  }

  const closeProductModal = () => {
    setIsProductModalOpen(false)
    setSelectedProduct(null)
  }

  const handleViewAll = (products: GetProductType[]) => {
    // Expand to show all products in section
    setCategoryLimits((prev) => ({
      ...prev,
      [products[0]?.product.categoryId]: products.length,
    }))
  }

  const handleSeeMore = (categoryId: number) => {
    setCategoryLimits((prev) => ({
      ...prev,
      [categoryId]: (prev[categoryId] || 4) + 8,
    }))
  }

  const handleLogin = async (user: UserType) => {
    setIsLoggedIn(true)
    setCurrentUser(user.username)
    setRoleId(user.roleId ?? 0)
    localStorage.setItem('currentUser', JSON.stringify(user))
    localStorage.setItem('roleId', String(user.roleId ?? 0))
    setSavedRoleId(user.roleId ?? 0)
    await loadUserCart()
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('currentUser')
      const storedRoleId = localStorage.getItem('roleId')

      if (savedUser) {
        const parsedUser: UserType = JSON.parse(savedUser)
        setIsLoggedIn(true)
        setCurrentUser(parsedUser.username)
        setRoleId(parsedUser.roleId ?? 0)
      }

      if (storedRoleId) {
        setSavedRoleId(Number.parseInt(storedRoleId))
      }
    }
  }, [])

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentUser('')
    setRoleId(null)
    setSavedRoleId(null)
    setCartItems([])
    localStorage.removeItem('authToken')
    localStorage.removeItem('currentUser')
    localStorage.removeItem('roleId')
  }

  const handleOrderComplete = async () => {
    if (!token || !userData?.userId) {
      toast({
        title: 'Login Required',
        description: 'Please login to place an order.',
        variant: 'destructive',
      })
      return
    }

    if (cartItems.length === 0) {
      toast({
        title: 'Empty Cart',
        description: 'Your cart is empty.',
        variant: 'destructive',
      })
      return
    }

    try {
      const orderItems = cartItems.map((item) => ({
        productId: item.productId,
        qty: item.quantity,
      }))

      const response = await createOrderApi(token, {
        userId: userData.userId,
        items: orderItems,
      })

      if (response?.data) {
        try {
          for (const item of cartItems) {
            await deleteCart(token, item.productId)
          }
        } catch (deleteErr) {
          console.error('Error clearing cart:', deleteErr)
        }

        setCartItems([])
        setIsCheckoutOpen(false)

        toast({
          title: 'Order Placed Successfully!',
          description: `Total Amount: ৳${response.data.totalOrderAmount || getTotalPrice()}. You will receive a confirmation call shortly.`,
        })

        await loadUserCart()
      } else {
        toast({
          title: 'Order Failed',
          description: 'Failed to place order. Please try again.',
          variant: 'destructive',
        })
      }
    } catch (err: any) {
      console.error('Failed to create order:', err)
      toast({
        title: 'Order Failed',
        description: err.message || 'Failed to place order. Please try again.',
        variant: 'destructive',
      })
    }
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>
  if (error) return <p className="text-center text-red-500">{error}</p>

  return (
    <div className="min-h-screen bg-white">
      {/* REMOVED NAVBAR - Now comes from layout */}

      <HeroSlider />

      {/* Search Results */}
      {searchQuery && (
        <section className="container mx-auto px-3 sm:px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Search Results for "{searchQuery}" ({filteredProducts.length} items)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.product.id}
                product={product}
                onProductClick={openProductModal}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </section>
      )}

      {/* Product Collections */}
      {!searchQuery && (
        <main className="container mx-auto px-3 sm:px-4 py-8 md:py-12">
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
                  Men's Collection
                </h2>
                {menProducts.length > 4 && (
                  <Button
                    variant="outline"
                    className="text-sm text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white bg-white px-4 py-2"
                    onClick={() => handleViewAll(menProducts)}
                  >
                    View All
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {menProducts.slice(0, 4).map((product) => (
                  <ProductCard
                    key={product.product.id}
                    product={product}
                    onProductClick={openProductModal}
                    onAddToCart={addToCart}
                  />
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
                  Kid's Collection
                </h2>
                {kidsProducts.length > 4 && (
                  <Button
                    variant="outline"
                    className="text-sm text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white bg-white px-4 py-2"
                    onClick={() => handleViewAll(kidsProducts)}
                  >
                    View All
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {kidsProducts.slice(0, 4).map((product) => (
                  <ProductCard
                    key={product.product.id}
                    product={product}
                    onProductClick={openProductModal}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            </section>
          )}

          {/* No Products Message */}
          {menProducts.length === 0 && kidsProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No products available at the moment.
              </p>
            </div>
          )}
        </main>
      )}

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full sm:w-full sm:max-w-md bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Shopping Cart</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCartOpen(false)}
                className="h-10 w-10"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg"
                    >
                      <Image
                        height={64}
                        width={64}
                        src={
                          item.url?.startsWith('http')
                            ? item.url
                            : `https://anukabd.com/api/uploads/${item.url}`
                        }
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">
                          {item.name}
                        </h3>
                        <p className="text-blue-600 font-semibold text-sm">
                          ৳{item.price * item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8 bg-white"
                          onClick={() => updateQuantity(item.productId, -1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8 bg-white"
                          onClick={() => updateQuantity(item.productId, 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 p-4 space-y-3">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span className="text-blue-600">৳{getTotalPrice()}</span>
              </div>
              <Button
                onClick={() => {
                  setIsCartOpen(false)
                  setIsCheckoutOpen(true)
                }}
                disabled={cartItems.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Checkout
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <SignIn
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
        onSwitchToRegister={() => {
          setIsLoginOpen(false)
          setIsRegisterOpen(true)
        }}
      />

      {/* Register Modal */}
      <RegisterForm
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegister={(user) =>
          handleLogin({ userId: 0, username: user.username, email: user.email })
        }
        onSwitchToLogin={() => {
          setIsRegisterOpen(false)
          setIsLoginOpen(true)
        }}
      />

      {/* Checkout Modal */}
      <CheckoutForm
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartTotal={getTotalPrice()}
        onOrderComplete={handleOrderComplete}
      />

      <Toaster />
      <Footer />
    </div>
  )
}
