// Updated Navbar Component with Hover Dropdowns + Fullscreen Search Overlay
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, User, ShoppingCart, X } from 'lucide-react'
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
  onCategoryClick?: (categoryId: number) => void
  onProductClick?: (productId: number) => void
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
  const [products, setProducts] = useState<GetProductType[]>([])
  const [token] = useAtom(tokenAtom)

  const [hoverMenu, setHoverMenu] = useState<string | null>(null)
  const [showSearchOverlay, setShowSearchOverlay] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      if (!token) return
      try {
        const [catRes, prodRes] = await Promise.all([
          fetchCategories(token),
          fetchProducts(token),
        ])
        if (catRes?.data) setCategories(catRes.data)
        if (prodRes?.data) setProducts(prodRes.data)
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
              <p
                onMouseEnter={() => setHoverMenu('Men')}
                onMouseLeave={() => setHoverMenu(null)}
                className="cursor-pointer hover:text-blue-600"
              >
                Men
              </p>
              <p
                onMouseEnter={() => setHoverMenu('Kids')}
                onMouseLeave={() => setHoverMenu(null)}
                className="cursor-pointer hover:text-blue-600"
              >
                Kids
              </p>
              <Link href={'/dashboard/categories'}>Dashbaord</Link>

              {/* HOVER DROPDOWN */}
              {hoverMenu && (
                <div
                  className="absolute top-10 left-0 bg-white border border-slate-200 shadow-lg p-6 rounded-lg grid grid-cols-3 gap-6 animate-slideDown w-[50vw]"
                  onMouseEnter={() => setHoverMenu(hoverMenu)}
                  onMouseLeave={() => setHoverMenu(null)}
                >
                  {[1, 2, 3].map((col) => (
                    <div key={col}>
                      <h3 className="font-semibold text-gray-800 mb-3">
                        {hoverMenu} Category {col}
                      </h3>
                      <ul className="space-y-2 text-gray-600">
                        <li className="hover:text-blue-600 cursor-pointer">
                          Item 1
                        </li>
                        <li className="hover:text-blue-600 cursor-pointer">
                          Item 2
                        </li>
                        <li className="hover:text-blue-600 cursor-pointer">
                          Item 3
                        </li>
                        <li className="hover:text-blue-600 cursor-pointer">
                          Item 4
                        </li>
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT SECTION */}
            <div className="flex items-center gap-4">
              {/* SEARCH ICON */}
              <button
                onClick={() => setShowSearchOverlay(true)}
                className="text-gray-600 hover:text-blue-600"
              >
                <Search className="w-6 h-6" />
              </button>

              {/* CART */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="text-gray-600 hover:text-blue-600"
              >
                <ShoppingCart className="w-6 h-6" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              {/* USER DROPDOWN */}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <button>
                    <User className="text-gray-600 hover:text-blue-600 mt-2" />
                  </button>
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
                          onClick={() => router.push('/admin-dashboard')}
                        >
                          Admin Dashboard
                        </DropdownMenuItem>
                      )}
                      {roleId === 2 && (
                        <DropdownMenuItem
                          onClick={() => router.push('/user-dashboard')}
                        >
                          My Dashboard
                        </DropdownMenuItem>
                      )}
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
            <button onClick={() => setShowSearchOverlay(false)}>
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

/* Tailwind Animations */
// Add to globals.css if needed:
// .animate-slideDown { @apply animate-[slideDown_0.25s_ease-out]; }
// .animate-slideDownFast { @apply animate-[slideDown_0.15s_ease-out]; }
// @keyframes slideDown {
//   0% { opacity: 0; transform: translateY(-20px); }
//   100% { opacity: 1; transform: translateY(0); }
// }
