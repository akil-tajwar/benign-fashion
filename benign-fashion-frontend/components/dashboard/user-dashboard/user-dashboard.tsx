

// 'use client'

// import React, { useState, useEffect, useCallback } from 'react'
// import { useRouter } from 'next/navigation'
// import Sidebar from './pages/Sidebar'
// import CartsPage from './pages/CartsPage'
// import OrdersPage from './pages/OrdersPage'
// import ProfilePage from './pages/ProfilePage'
// import { getUserByIdApi } from '@/api/users-api'
// import { useAtom } from 'jotai'
// import { tokenAtom, useInitializeUser, userDataAtom } from '@/utils/user'
// import { Users } from '@/utils/type'

// // ✅ User type
// export type User = {
//   userId: number
//   username: string
//   email: string
//   password: string
//   active: boolean
//   roleId: number | null
//   roleName?: string | null
//   fullName: string | null
//   phone: string | null
//   street: string | null
//   city: string | null
//   state: string | null
//   country: string | null
//   postalCode: string | null
//   isPasswordResetRequired: boolean
//   createdAt: string
//   updatedAt: string
//   role?: {
//     roleId: number
//     roleName: string
//     rolePermissions: {
//       roleId: number
//       permissionId: number
//       permission: { id: number; name: string }
//     }[]
//   } | null
// }

// const UserDashboard = () => {
//   const [activePage, setActivePage] = useState<'profile' | 'orders' | 'carts'>(
//     'profile'
//   )
//   const [user, setUser] = useState<Users | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [token] = useAtom(tokenAtom)
//   useInitializeUser()
//   const [userData] = useAtom(userDataAtom)
//   const router = useRouter()

//   const fetchUser = useCallback(async () => {
//     if (!userData?.userId || !token) {
//       setLoading(false)
//       setError('No user ID or token found. Please log in.')
//       return
//     }

//     try {
//       setLoading(true)
//       const response = await getUserByIdApi(token, userData.userId)
//       if (response?.data) {
//         setUser(response.data)
//         setError(null)
//       }
//     } catch (err) {
//       console.error('Error fetching user data:', err)
//       setError('Failed to load user data. Please try again.')
//     } finally {
//       setLoading(false)
//     }
//   }, [token, userData?.userId])

//   useEffect(() => {
//     fetchUser()
//   }, [fetchUser])

//   const handleUserUpdate = (updatedUser: Users) => {
//     setUser(updatedUser)
//   }

//   const renderPage = () => {
//     if (loading) {
//       return (
//         <div className="flex items-center justify-center h-full">
//           <div className="text-center">
//             <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//             <p className="text-gray-600">Loading user data...</p>
//           </div>
//         </div>
//       )
//     }

//     if (error) {
//       return (
//         <div className="flex items-center justify-center h-full">
//           <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
//             <p className="text-red-700 text-center mb-4">{error}</p>
//             <button
//               onClick={fetchUser}
//               className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
//             >
//               Retry
//             </button>
//           </div>
//         </div>
//       )
//     }

//     switch (activePage) {
//       case 'profile':
//         return (
//           <ProfilePage
//             user={user}
//             onUserUpdate={handleUserUpdate}
//             onRefresh={fetchUser}
//           />
//         )
//       case 'orders':
//         return <OrdersPage />
//       case 'carts':
//         return <CartsPage />
//       default:
//         return null
//     }
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <Sidebar activePage={activePage} setActivePage={setActivePage} />
//       <main className="flex-1 p-8 overflow-y-auto max-h-screen">
//         <button
//           onClick={() => router.push('/')}
//           className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors font-medium"
//         >
//           <svg
//             className="w-5 h-5"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M10 19l-7-7m0 0l7-7m-7 7h18"
//             />
//           </svg>
//           Back to Home
//         </button>
//         {renderPage()}
//       </main>
//     </div>
//   )
// }

// export default UserDashboard


'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from './pages/Sidebar'
import CartsPage from './pages/CartsPage'
import OrdersPage from './pages/OrdersPage'
import ProfilePage from './pages/ProfilePage'
import { getUserByIdApi } from '@/api/users-api'
import { useAtom } from 'jotai'
import { tokenAtom, useInitializeUser, userDataAtom } from '@/utils/user'
import { Users } from '@/utils/type'

// ✅ User type
export type User = {
  userId: number
  username: string
  email: string
  password: string
  active: boolean
  roleId: number | null
  roleName?: string | null
  fullName: string | null
  phone: string | null
  street: string | null
  city: string | null
  state: string | null
  country: string | null
  postalCode: string | null
  isPasswordResetRequired: boolean
  createdAt: string
  updatedAt: string
  role?: {
    roleId: number
    roleName: string
    rolePermissions: {
      roleId: number
      permissionId: number
      permission: { id: number; name: string }
    }[]
  } | null
}

const UserDashboard = () => {
  const [activePage, setActivePage] = useState<'profile' | 'orders' | 'carts'>(
    'profile'
  )
  const [user, setUser] = useState<Users | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [token] = useAtom(tokenAtom)
  useInitializeUser()
  const [userData] = useAtom(userDataAtom)
  const router = useRouter()

  const fetchUser = useCallback(async () => {
    if (!userData?.userId || !token) {
      setLoading(false)
      setError('No user ID or token found. Please log in.')
      return
    }

    try {
      setLoading(true)
      const response = await getUserByIdApi(token, userData.userId)
      if (response?.data) {
        setUser(response.data)
        setError(null)
      }
    } catch (err) {
      console.error('Error fetching user data:', err)
      setError('Failed to load user data. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [token, userData?.userId])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  // Close mobile menu when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleUserUpdate = (updatedUser: Users) => {
    setUser(updatedUser)
  }

  const handlePageChange = (value: React.SetStateAction<'profile' | 'orders' | 'carts'>) => {
    setActivePage(value)
    setIsMobileMenuOpen(false)
  }

  const renderPage = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full min-h-[50vh]">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm sm:text-base">Loading user data...</p>
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-full min-h-[50vh] px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 max-w-md w-full">
            <p className="text-red-700 text-center mb-4 text-sm sm:text-base">{error}</p>
            <button
              onClick={fetchUser}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm sm:text-base"
            >
              Retry
            </button>
          </div>
        </div>
      )
    }

    switch (activePage) {
      case 'profile':
        return (
          <ProfilePage
            user={user}
            onUserUpdate={handleUserUpdate}
            onRefresh={fetchUser}
          />
        )
      case 'orders':
        return <OrdersPage />
      case 'carts':
        return <CartsPage />
      default:
        return null
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile Menu Button - Fixed Position */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isMobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 lg:w-auto
          transform lg:transform-none transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <Sidebar activePage={activePage} setActivePage={handlePageChange} />
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full lg:w-auto min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-screen">
          <button
            onClick={() => router.push('/')}
            className="mb-4 sm:mb-6 mt-14 lg:mt-0 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors font-medium text-sm sm:text-base"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Back</span>
          </button>
          
          {/* Responsive wrapper with Tailwind classes */}
          <div className="w-full">
            <style jsx global>{`
              /* Mobile: Extra small fonts and images */
              @media (max-width: 640px) {
                .mobile-responsive-content * {
                  font-size: 10px !important;
                }
                .mobile-responsive-content h1 {
                  font-size: 18px !important;
                }
                .mobile-responsive-content h2 {
                  font-size: 16px !important;
                }
                .mobile-responsive-content h3 {
                  font-size: 14px !important;
                }
                .mobile-responsive-content img {
                  max-width: 30px !important;
                  max-height: 30px !important;
                  width: 30px !important;
                  height: 30px !important;
                }
                .mobile-responsive-content table {
                  display: block !important;
                  overflow-x: auto !important;
                  -webkit-overflow-scrolling: touch !important;
                  white-space: nowrap !important;
                }
                .mobile-responsive-content th,
                .mobile-responsive-content td {
                  padding: 4px 2px !important;
                }
                .mobile-responsive-content button {
                  padding: 4px 8px !important;
                  font-size: 10px !important;
                }
              }
            `}</style>
            <div className="mobile-responsive-content">
              {renderPage()}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default UserDashboard