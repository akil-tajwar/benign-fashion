// Updated Navbar Component with Hover Dropdowns + Fullscreen Search Overlay
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, User, ShoppingCart, X, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { fetchProducts } from '@/api/product-api'
import { fetchCategories } from '@/api/categories-api'
import { useAtom } from 'jotai'
import { tokenAtom } from '@/utils/user'
import type { GetCategoryType, GetProductType } from '@/utils/type'
import { useCart } from '@/hooks/use-cart'

interface NavbarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  filteredProducts: any[]
  isLoggedIn: boolean
  currentUser: string
  setIsLoginOpen: (open: boolean) => void
  setIsRegisterOpen: (open: boolean) => void
  handleLogout: () => void
  setIsCartOpen: (open: boolean) => void
  getTotalItems: () => number
  roleId: number | null
  onCategoryClick: (categoryId: number) => void
  onProductClick: (productId: number) => void
}

export default function Navbar({
  searchQuery,
  setSearchQuery,
  filteredProducts,
  isLoggedIn,
  currentUser,
  setIsLoginOpen,
  setIsRegisterOpen,
  handleLogout,
  setIsCartOpen,
  getTotalItems,
  roleId,
  onCategoryClick,
  onProductClick,
}: NavbarProps) {
  const [categories, setCategories] = useState<GetCategoryType[]>([])
  const [token] = useAtom(tokenAtom)

  const [hoverMenu, setHoverMenu] = useState<string | null>(null)
  const [showSearchOverlay, setShowSearchOverlay] = useState(false)
  const router = useRouter()

  const { cartItems } = useCart()

  useEffect(() => {
    const loadData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetchCategories(token),
          fetchProducts(token),
        ])
        if (catRes?.data) setCategories(catRes.data)
      } catch (err) {
        console.error('Failed loading data', err)
      }
    }

    loadData()
  }, [token])

  return (
    <>
      {/* NAVBAR */}
      {!showSearchOverlay && (
        <header className="bg-white shadow-sm border-b sticky top-0 z-40">
          <div className="max-w-11/12 mx-auto px-4 h-16 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="">
              <Image
                src="/logo.jpg"
                alt="Logo"
                width={50}
                height={50}
                className="object-contain rounded-full"
              />
            </Link>

            {/* CATEGORY HOVER MENU */}
            <div className="hidden lg:flex gap-6 text-gray-700 font-medium relative">
              <Link
                href={'/men-products'}
                onMouseEnter={() => setHoverMenu('men')}
                className="cursor-pointer hover:text-blue-600 flex items-center"
              >
                <p>Men</p> <ChevronDown className='w-5'/>
              </Link>
              <Link
                href={'/kids-products'}
                onMouseEnter={() => setHoverMenu('kids')}
                className="cursor-pointer hover:text-blue-600 flex items-center"
              >
                <p>Kids</p> <ChevronDown className='w-5'/>
              </Link>
              <Link
                href={'/flash-sale-products'}
                className="cursor-pointer hover:text-blue-600"
              >
                Flash Sale
              </Link>

              {/* HOVER DROPDOWN */}
              {hoverMenu &&
                (() => {
                  // Filter category heads for the current menu type
                  const categoryHeads = categories.filter(
                    (cat) =>
                      cat.isCategoryHead &&
                      cat.categoryHeadId === null &&
                      cat.categoryType === hoverMenu
                  )

                  return (
                    <div
                      className="
                absolute 
                top-[180%] 
                left-1/2 -translate-x-1/2
                bg-white border border-slate-200 shadow-lg 
                p-6 rounded-lg 
                w-[90vw] sm:w-[80vw] lg:w-[50vw]
                grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 
                gap-6 
                animate-slideDown
                z-50
              "
                      onMouseEnter={() => setHoverMenu(hoverMenu)}
                      onMouseLeave={() => setHoverMenu(null)}
                    >
                      {categoryHeads.map((categoryHead) => {
                        // Get subcategories for this category head
                        const subCategories = categories.filter(
                          (cat) =>
                            !cat.isCategoryHead &&
                            cat.categoryHeadId === categoryHead.id
                        )

                        return (
                          <div key={categoryHead.id}>
                            <h3 className="font-semibold text-lg text-gray-800 mb-3">
                              {categoryHead.name}
                            </h3>
                            <ul className="space-y-2 text-gray-600">
                              {subCategories.map((subCat) => (
                                <li
                                  key={subCat.id}
                                  onClick={() => onCategoryClick(subCat.id!)}
                                  className="hover:text-blue-600 cursor-pointer pl-3"
                                >
                                  <Link
                                    href={`/category-products/${subCat.id}`}
                                  >
                                    {subCat.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )
                      })}
                    </div>
                  )
                })()}
            </div>

            {/* RIGHT SECTION */}
            <div className="flex items-center gap-4">
              {/* SEARCH ICON */}
              <button
                onClick={() => setShowSearchOverlay(true)}
                className="text-gray-600 hover:text-blue-600"
                aria-label="Search"
              >
                <Search className="w-8 h-8" />
              </button>

              {/* CART */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="text-gray-600 hover:text-blue-600 relative"
                aria-label="Shopping cart"
              >
                <p className="absolute text-xs bg-red-600 rounded-full px-1 text-white right-0 top-0">
                  {cartItems.length}
                </p>
                <ShoppingCart className="w-8 h-8" />
              </button>

              {/* USER DROPDOWN - FIXED: Removed nested button */}
              <DropdownMenu>
                <DropdownMenuTrigger className="text-gray-600 hover:text-blue-600 outline-none">
                  <User className="w-8 h-8" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 p-2 bg-white border rounded-lg shadow-lg">
                  {!isLoggedIn ? (
                    <>
                      <DropdownMenuItem onClick={() => setIsLoginOpen(true)}>
                        Login
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setIsRegisterOpen(true)}>
                        Register
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem disabled>
                        Hi, {currentUser}
                      </DropdownMenuItem>
                      {roleId === 1 && (
                        <DropdownMenuItem
                          onClick={() => router.push('/dashboard/categories')}
                        >
                          Admin Dashboard
                        </DropdownMenuItem>
                      )}
                        <DropdownMenuItem
                          onClick={() => router.push('/profile')}
                        >
                          Profile
                        </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-red-600"
                      >
                        Logout
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
      )}

      {/* FULLSCREEN SEARCH OVERLAY */}
      {showSearchOverlay && (
        <div className="fixed inset-0 bg-white z-50 h-fit animate-slideDownFast p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Search Products</h2>
            <button
              onClick={() => setShowSearchOverlay(false)}
              aria-label="Close search"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          <div className="relative w-full">
            <Input
              autoFocus
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 p-4 text-lg rounded-lg"
            />
            {searchQuery && (
              <div className="mt-3 text-gray-600 text-sm">
                Found {filteredProducts.length} results
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
