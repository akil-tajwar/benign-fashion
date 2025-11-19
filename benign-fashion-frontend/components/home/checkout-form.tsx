'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, CreditCard, Smartphone } from 'lucide-react'

interface CheckoutFormProps {
  isOpen: boolean
  onClose: () => void
  cartTotal: number
  onOrderComplete: () => void
}

export default function CheckoutForm({
  isOpen,
  onClose,
  cartTotal,
  onOrderComplete,
}: CheckoutFormProps) {
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [bkashNumber, setBkashNumber] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate order processing
    setTimeout(() => {
      setIsProcessing(false)
      onOrderComplete()
      onClose()
      // Reset form
      setPaymentMethod('cash')
      setBkashNumber('')
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Checkout</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handlePaymentSubmit} className="p-6 space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900">
              Payment Method
            </h3>
          </div>

          <div className="space-y-3">
            <div
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
              onClick={() => setPaymentMethod('cash')}
            >
              <input
                type="radio"
                id="cash"
                name="payment"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <label
                htmlFor="cash"
                className="flex items-center space-x-2 cursor-pointer"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  💵
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    Cash on Delivery
                  </div>
                  <div className="text-sm text-gray-600">
                    Pay when your order arrives
                  </div>
                </div>
              </label>
            </div>

            {/* <div
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
              onClick={() => setPaymentMethod("bkash")}
            >
              <input
                type="radio"
                id="bkash"
                name="payment"
                value="bkash"
                checked={paymentMethod === "bkash"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <label htmlFor="bkash" className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-pink-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">bKash</div>
                  <div className="text-sm text-gray-600">Pay with bKash mobile banking</div>
                </div>
              </label>
            </div> */}
          </div>

          {paymentMethod === 'bkash' && (
            <div className="space-y-2 mt-4">
              <label
                htmlFor="bkashNumber"
                className="text-sm font-medium text-gray-700"
              >
                bKash Number *
              </label>
              <Input
                id="bkashNumber"
                type="tel"
                value={bkashNumber}
                onChange={(e) => setBkashNumber(e.target.value)}
                placeholder="Enter your bKash number"
                required
              />
              <p className="text-xs text-gray-600">
                You will receive a payment request on this number
              </p>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Order Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>৳{cartTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span>৳50</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total:</span>
                <span>৳{cartTotal + 50}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={
                isProcessing || (paymentMethod === 'bkash' && !bkashNumber)
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            >
              {isProcessing
                ? 'Processing...'
                : `Place Order (৳${cartTotal + 50})`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
