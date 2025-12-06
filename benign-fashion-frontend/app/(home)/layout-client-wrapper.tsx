// components/layout/layout-client-wrapper.tsx
'use client'

import { useState, useEffect } from 'react'
import NavbarWrapper from '@/components/shared/navbar-wrapper'
import { useAtom } from 'jotai'
import { tokenAtom } from '@/utils/user'
import { fetchCarts } from '@/api/cart-api'
import { SearchProvider } from '@/hooks/use-search'

export default function LayoutClientWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const [token] = useAtom(tokenAtom)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState('')
  const [roleId, setRoleId] = useState<number | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [cartItemCount, setCartItemCount] = useState(0)

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
  useEffect(() => {
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

    loadCartCount()
  }, [token])

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentUser('')
    setRoleId(null)
    setCartItemCount(0)
    localStorage.removeItem('authToken')
    localStorage.removeItem('currentUser')
    localStorage.removeItem('roleId')
  }

  const getTotalItems = () => cartItemCount

  return (
    <SearchProvider>
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
      {children}
    </SearchProvider>
  )
}
