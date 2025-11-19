'use client'

import React, { useState } from 'react'
import { useAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { tokenAtom, useInitializeUser } from '@/utils/user'

// Import all page components
import UsersPage from './pages/users-page'
import RolesPage from './pages/roles-page'
import PermissionsPage from './pages/permissions-page'
import CategoriesPage from './pages/categories-page'
import ProductsPage from './pages/products-page'
import OrdersPage from './pages/orders-page'
import PaymentsPage from './pages/payments-page'
import ReviewsPage from './pages/reviews-page'
import CartsPage from './pages/carts-page'
import { Button } from '@/components/ui/button'
import {
  FaUser,
  FaBoxOpen,
  FaTags,
  FaShoppingCart,
  FaChartLine,
  FaHome,
} from 'react-icons/fa'

type AdminPage =
  | 'users'
  | 'roles'
  | 'permissions'
  | 'categories'
  | 'products'
  | 'orders'
  | 'payments'
  | 'reviews'
  | 'carts'

const AdminDashboard = () => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const [activePage, setActivePage] = useState<AdminPage>('users')
  const router = useRouter()

  const menuItems: { key: AdminPage; label: string; icon: React.ReactNode }[] =
    [
      // { key: 'users', label: 'Users', icon: <FaUser /> },
      { key: 'categories', label: 'Categories', icon: <FaTags /> },
      { key: 'products', label: 'Products', icon: <FaBoxOpen /> },
      { key: 'orders', label: 'Orders', icon: <FaShoppingCart /> },
    ]

  const renderPage = () => {
    switch (activePage) {
      case 'users':
        return <UsersPage token={token} />
      case 'roles':
        return <RolesPage />
      case 'permissions':
        return <PermissionsPage />
      case 'categories':
        return <CategoriesPage />
      case 'products':
        return <ProductsPage />
      case 'orders':
        return <OrdersPage />
      case 'payments':
        return <PaymentsPage />
      case 'reviews':
        return <ReviewsPage />
      case 'carts':
        return <CartsPage />
      default:
        return null
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-700 to-blue-900 text-white flex flex-col fixed top-0 left-0 bottom-0 shadow-xl z-10">
        {/* Header Section */}
        <div className="flex items-center justify-between px-5 py-4 bg-blue-800 shadow-md">
          <h2 className="text-lg font-semibold tracking-wide">Admin Panel</h2>
          <Button
            onClick={() => router.push('/')}
            className="flex items-center gap-1 bg-white text-blue-700 font-medium px-2 py-1 rounded-md hover:bg-gray-100 transition-all text-sm"
          >
            <FaHome size={14} />
            Home
          </Button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-800">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActivePage(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${
                activePage === item.key
                  ? 'bg-white text-blue-700 shadow-md scale-[1.02]'
                  : 'text-blue-100 hover:bg-blue-800 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer Section */}
        <div className="p-4 border-t border-blue-700 text-center text-sm text-blue-200">
          <p className="text-xs">
            © {new Date().getFullYear()} Admin Dashboard
          </p>
          <p className="text-[11px] opacity-80">Built with ❤️ by Rifat</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto max-h-screen">
        <div className="bg-white shadow-md rounded-xl p-6 min-h-[80vh]">
          {renderPage()}
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
