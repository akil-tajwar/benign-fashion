// components/layout/layout-client-wrapper.tsx
'use client'

import { useState, useEffect } from 'react'
import NavbarWrapper from '@/components/shared/navbar-wrapper'
import SignIn, { UserType } from '@/components/home/login-form'
import RegisterForm from '@/components/home/register-form'
import { useAtom } from 'jotai'
import { tokenAtom } from '@/utils/user'
import { fetchCarts } from '@/api/cart-api'
import { SearchProvider } from '@/hooks/use-search'
import { CartProvider } from '@/hooks/use-cart'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'

export default function LayoutClientWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [token] = useAtom(tokenAtom)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState('')
  const [roleId, setRoleId] = useState<number | null>(null)
  const [cartItemCount, setCartItemCount] = useState(0)

  // Modal states
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Load user from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('currentUser')
      const storedRoleId = localStorage.getItem('roleId')

      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser)
          setIsLoggedIn(true)
          setCurrentUser(parsedUser.username)
          setRoleId(parsedUser.roleId ?? 0)
        } catch (err) {
          console.error('Failed to parse saved user:', err)
        }
      }

      if (storedRoleId) {
        setRoleId(Number.parseInt(storedRoleId))
      }
    }
  }, [])

  // Load cart count
  const loadCartCount = async () => {
    if (!token) return
    try {
      const res = await fetchCarts(token)
      const totalItems = (res.data ?? []).reduce(
        (total: number, item: any) => total + item.quantity,
        0
      )
      setCartItemCount(totalItems)
    } catch (err) {
      console.error('Failed to load cart count:', err)
    }
  }

  useEffect(() => {
    loadCartCount()
  }, [token])

  const handleLogin = async (user: UserType) => {
    setIsLoggedIn(true)
    setCurrentUser(user.username)
    setRoleId(user.roleId ?? 0)
    localStorage.setItem('currentUser', JSON.stringify(user))
    localStorage.setItem('roleId', String(user.roleId ?? 0))
    await loadCartCount()
    setIsLoginOpen(false)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentUser('')
    setRoleId(null)
    setCartItemCount(0)
    localStorage.removeItem('authToken')
    localStorage.removeItem('currentUser')
    localStorage.removeItem('roleId')
    router.push('/')
  }

  const handleRegister = (user: UserType) => {
    // Don't auto-login after registration
    // Just show success message and switch to login
    setIsRegisterOpen(false)
    toast({
      title: 'Registration Successful!',
      description: 'Please login with your credentials.',
    })
  }

  const getTotalItems = () => cartItemCount

  return (
    <SearchProvider>
      <CartProvider>
        <NavbarWrapper
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          setIsLoginOpen={setIsLoginOpen}
          setIsRegisterOpen={setIsRegisterOpen}
          handleLogout={handleLogout}
          setIsCartOpen={setIsCartOpen}
          getTotalItems={getTotalItems}
          roleId={roleId}
        />

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
          onRegister={handleRegister}
          onSwitchToLogin={() => {
            setIsRegisterOpen(false)
            setIsLoginOpen(true)
          }}
        />

        {children}
      </CartProvider>
    </SearchProvider>
  )
}
