// components/shared/cart-sidebar.tsx
'use client'

import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/use-cart'
import { ShoppingCart, Plus, Minus, X, Trash2 } from 'lucide-react'
import Image from 'next/image'

interface CartSidebarProps {
  onCheckoutClick?: () => void
}

export default function CartSidebar({ onCheckoutClick }: CartSidebarProps) {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
  } = useCart()

  if (!isCartOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={() => setIsCartOpen(false)}
      />
      <div className="absolute right-0 top-0 h-full w-full sm:w-full sm:max-w-md bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">
            Shopping Cart ({cartItems.length})
          </h2>
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
                  className="flex items-start space-x-3 w-full bg-gray-50 border py-3 rounded-lg relative"
                >
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                    aria-label="Remove item"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>

                  <Image
                    height={64}
                    width={64}
                    src={item.url || '/placeholder.svg'}
                    alt={item.name}
                    className="object-cover border rounded-md"
                  />
                  <div className="flex-1">
                    <div>
                      <h3 className="font-medium text-sm truncate">
                        {item.name}
                      </h3>
                      {item.discount > 0 && (
                        <span className="text-xs text-slate-600 font-medium">
                          size - {item.size}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-5">
                      <p className="font-semibold text-lg">
                        ৳{(item.price * item.quantity).toFixed(2)}
                      </p>
                      <div className="flex items-center space-x-2 mr-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8 bg-white"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8 bg-white"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 p-4 space-y-3">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span className="text-blue-600">৳{getTotalPrice().toFixed(2)}</span>
          </div>
          <Button
            onClick={() => {
              setIsCartOpen(false)
              if (onCheckoutClick) {
                onCheckoutClick()
              }
            }}
            disabled={cartItems.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Checkout
          </Button>
        </div>
      </div>
    </div>
  )
}
