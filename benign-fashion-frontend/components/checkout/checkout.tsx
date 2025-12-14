'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  ShoppingCart,
  MapPin,
  Phone,
  Mail,
  User,
  Sparkles,
  Check,
  DollarSign,
} from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { CustomCombobox } from '@/utils/custom-combobox'
import { useCart } from '@/hooks/use-cart'
import { locationData } from '@/utils/constants'
import { createOrder } from '@/utils/api'
import { useAtom } from 'jotai'
import { tokenAtom } from '@/utils/user'

export default function CheckoutPage() {
  const [token] = useAtom(tokenAtom)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    division: '',
    district: '',
    method: 'bkash' as 'bkash' | 'nagad' | 'rocket',
    transactionId: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const { cartItems, clearCart } = useCart()

  // Calculate total
  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
  }

  // Get available districts based on selected division
  const getAvailableDistricts = () => {
    if (!formData.division) return []
    return (
      locationData.districts[
        formData.division as keyof typeof locationData.districts
      ] || []
    )
  }

  // Handle division change
  const handleDivisionChange = (value: { id: string; name: string } | null) => {
    setFormData({
      ...formData,
      division: value?.id || '',
      district: '',
    })
    setErrors({ ...errors, division: '' })
  }

  // Handle district change
  const handleDistrictChange = (value: { id: string; name: string } | null) => {
    setFormData({
      ...formData,
      district: value?.id || '',
    })
    setErrors({ ...errors, district: '' })
  }

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.division) newErrors.division = 'Division is required'
    if (!formData.district) newErrors.district = 'District is required'
    if (!formData.transactionId.trim())
      newErrors.transactionId = 'Transaction ID is required'

    if (formData.phone && !/^01[3-9]\d{8}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format'
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (cartItems.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    if (!validateForm()) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsLoading(true)

    try {
      // Prepare payload in the shape backend expects
      const payload = {
        orderMaster: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email || null,
          address: formData.address,
          division: formData.division,
          district: formData.district,
          status: 'pending',
          method: formData.method,
          transactionId: formData.transactionId,
          totalAmount: getTotalPrice(),
        },
        orderDetails: cartItems.map((item) => ({
          productId: item.productId,
          size: item.size,
          quantity: item.quantity,
          amount: item.price * item.quantity,
        })),
      }

      // Send JSON, not FormData
      const response = await createOrder(token, payload)

      toast.success('Order placed successfully!')

      // Clear the cart using the hook method
      clearCart()
    } catch (error) {
      console.error('Order error:', error)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-[82vh]">
        <div className="text-center max-w-2xl mx-auto">
          {/* Animated Success Icon */}
          <div className="relative inline-block mb-8">
            {/* Outer glow rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-400/20 to-indigo-400/20 animate-ping"
                style={{ animationDuration: '2s' }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-28 h-28 rounded-full bg-gradient-to-r from-blue-400/30 to-indigo-400/30 animate-pulse"
                style={{ animationDuration: '1.5s' }}
              />
            </div>

            {/* Main icon container */}
            <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 w-24 h-24 rounded-full flex items-center justify-center shadow-2xl border border-blue-200/50 animate-[scale-in_0.6s_ease-out]">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/0 to-indigo-400/20 animate-[spin_3s_linear_infinite]" />
              <Check
                className="w-12 h-12 text-blue-600 relative z-10 animate-[check-draw_0.8s_ease-out_0.3s_both]"
                strokeWidth={3}
              />
            </div>

            {/* Sparkles */}
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-blue-400 animate-[sparkle_1s_ease-in-out_0.5s_both]" />
            <Sparkles className="absolute -bottom-2 -left-2 w-5 h-5 text-indigo-400 animate-[sparkle_1s_ease-in-out_0.7s_both]" />
            <Sparkles className="absolute top-0 -left-4 w-4 h-4 text-sky-400 animate-[sparkle_1s_ease-in-out_0.9s_both]" />
          </div>

          {/* Thank you text */}
          <h2 className="text-5xl font-bold mb-4 animate-[fade-up_0.8s_ease-out_0.4s_both]">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
              Thank You
            </span>
          </h2>

          <p className="text-xl text-gray-700 mb-3 font-light animate-[fade-up_0.8s_ease-out_0.6s_both]">
            for choosing us
          </p>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3 mb-8 animate-[fade-up_0.8s_ease-out_0.8s_both]">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-blue-300" />
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-blue-300" />
          </div>

          <p className="text-gray-600 mb-10 leading-relaxed max-w-md mx-auto animate-[fade-up_0.8s_ease-out_1s_both]">
            We appreciate your trust in our service. Your satisfaction is our
            priority, and we look forward to serving you again.
          </p>

          {/* Continue Shopping Button */}
          <button
            onClick={() => router.push('/')}
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600  text-white text-lg rounded font-semibold shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden animate-[fade-up_0.8s_ease-out_1.2s_both]"
          >
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

            <span className="relative flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Continue Shopping
            </span>
          </button>

          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-blue-300/40 animate-[float_4s_ease-in-out_infinite]" />
            <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-indigo-300/40 animate-[float_5s_ease-in-out_1s_infinite]" />
            <div className="absolute bottom-1/4 left-1/3 w-2.5 h-2.5 rounded-full bg-sky-300/30 animate-[float_6s_ease-in-out_2s_infinite]" />
          </div>

          <style jsx>{`
            @keyframes scale-in {
              0% {
                transform: scale(0);
                opacity: 0;
              }
              50% {
                transform: scale(1.1);
              }
              100% {
                transform: scale(1);
                opacity: 1;
              }
            }

            @keyframes check-draw {
              0% {
                stroke-dasharray: 100;
                stroke-dashoffset: 100;
                opacity: 0;
              }
              50% {
                opacity: 1;
              }
              100% {
                stroke-dasharray: 100;
                stroke-dashoffset: 0;
                opacity: 1;
              }
            }

            @keyframes sparkle {
              0%,
              100% {
                transform: scale(0) rotate(0deg);
                opacity: 0;
              }
              50% {
                transform: scale(1) rotate(180deg);
                opacity: 1;
              }
            }

            @keyframes fade-up {
              0% {
                transform: translateY(20px);
                opacity: 0;
              }
              100% {
                transform: translateY(0);
                opacity: 1;
              }
            }

            @keyframes float {
              0%,
              100% {
                transform: translateY(0) translateX(0);
              }
              33% {
                transform: translateY(-20px) translateX(10px);
              }
              66% {
                transform: translateY(-10px) translateX(-10px);
              }
            }
          `}</style>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Left Side - Delivery Information */}
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="rounded-lg shadow-lg p-6 bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Personal Information
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="fullName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData({ ...formData, fullName: e.target.value })
                      setErrors({ ...errors, fullName: '' })
                    }}
                    className={`mt-1 ${errors.fullName ? 'border-red-500' : ''}`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium text-gray-700"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value })
                        setErrors({ ...errors, phone: '' })
                      }}
                      className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                      placeholder="01XXXXXXXXX"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email (Optional)
                  </Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value })
                        setErrors({ ...errors, email: '' })
                      }}
                      className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="rounded-lg shadow-lg p-6 bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Delivery Address
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Division <span className="text-red-500">*</span>
                  </Label>
                  <div className="mt-1">
                    <CustomCombobox
                      items={locationData.divisions}
                      value={
                        formData.division
                          ? {
                              id: formData.division,
                              name:
                                locationData.divisions.find(
                                  (d) => d.id === formData.division
                                )?.name || '',
                            }
                          : null
                      }
                      onChange={handleDivisionChange}
                      placeholder="Select division"
                    />
                  </div>
                  {errors.division && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.division}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    District <span className="text-red-500">*</span>
                  </Label>
                  <div className="mt-1">
                    <CustomCombobox
                      items={getAvailableDistricts()}
                      value={
                        formData.district
                          ? {
                              id: formData.district,
                              name:
                                getAvailableDistricts().find(
                                  (d) => d.id === formData.district
                                )?.name || '',
                            }
                          : null
                      }
                      onChange={handleDistrictChange}
                      placeholder="Select district"
                      disabled={!formData.division}
                    />
                  </div>
                  {errors.district && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.district}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="address"
                    className="text-sm font-medium text-gray-700"
                  >
                    Full Address <span className="text-red-500">*</span>
                  </Label>
                  <textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => {
                      setFormData({ ...formData, address: e.target.value })
                      setErrors({ ...errors, address: '' })
                    }}
                    className={`mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    rows={3}
                    placeholder="House/Flat No, Road, Area"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-lg shadow-lg p-6 bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Payment Method
                </h2>
              </div>

              <RadioGroup
                value={formData.method}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    method: value as 'bkash' | 'nagad' | 'rocket',
                  })
                }
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 border-2 border-gray-200 rounded-lg p-4 hover:border-pink-500 transition-colors cursor-pointer">
                  <RadioGroupItem value="bkash" id="bkash" />
                  <Label
                    htmlFor="bkash"
                    className="flex-1 cursor-pointer font-medium"
                  >
                    bKash
                  </Label>
                  <div className="text-pink-600 font-bold text-lg">
                    <Image
                      height={50}
                      width={50}
                      src={'/bkash.png'}
                      alt={'bkash logo'}
                      className="object-cover border rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3 border-2 border-gray-200 rounded-lg p-4 hover:border-orange-500 transition-colors cursor-pointer">
                  <RadioGroupItem value="nagad" id="nagad" />
                  <Label
                    htmlFor="nagad"
                    className="flex-1 cursor-pointer font-medium"
                  >
                    Nagad
                  </Label>
                  <div className="text-orange-600 font-bold text-lg">
                    <Image
                      height={50}
                      width={50}
                      src={'/nagad.webp'}
                      alt={'nagad logo'}
                      className="object-cover border rounded-md"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3 border-2 border-gray-200 rounded-lg p-4 hover:border-purple-500 transition-colors cursor-pointer">
                  <RadioGroupItem value="rocket" id="rocket" />
                  <Label
                    htmlFor="rocket"
                    className="flex-1 cursor-pointer font-medium"
                  >
                    Rocket
                  </Label>
                  <div className="text-purple-600 font-bold text-lg">
                    <Image
                      height={50}
                      width={50}
                      src={'/rocket.jpg'}
                      alt={'rocket logo'}
                      className="object-cover border rounded-md"
                    />
                  </div>
                </div>
              </RadioGroup>

              <div className="mt-6">
                <Label
                  htmlFor="transactionId"
                  className="text-sm font-medium text-gray-700"
                >
                  Transaction ID <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="transactionId"
                  value={formData.transactionId}
                  onChange={(e) => {
                    setFormData({ ...formData, transactionId: e.target.value })
                    setErrors({ ...errors, transactionId: '' })
                  }}
                  className={`mt-1 ${errors.transactionId ? 'border-red-500' : ''}`}
                  placeholder="Enter transaction ID"
                />
                {errors.transactionId && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.transactionId}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:sticky lg:top-20 h-fit">
            <div className="rounded-lg shadow-lg p-6 bg-gray-50 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary ({cartItems.length}{' '}
                {cartItems.length === 1 ? 'item' : 'items'})
              </h2>

              <div className="max-h-96 overflow-y-auto space-y-4 mb-6">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 bg-gray-50 border border-gray-200 p-3 rounded-lg relative"
                  >
                    <div className="w-14 h-14 overflow-hidden rounded-md">
                      <Image
                        height={64}
                        width={64}
                        src={item.url || '/placeholder.svg'}
                        alt={item.name}
                        className="object-cover border rounded-md"
                      />
                    </div>

                    <div className="flex-1 pr-6">
                      <h3 className="font-medium text-lg truncate">
                        {item.name}
                      </h3>
                      <span className="text-sm text-slate-600 font-medium">
                        Size: {item.size}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <p className="font-semibold text-sm">
                        ৳{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>৳{getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-blue-600">
                    ৳{getTotalPrice().toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || cartItems.length === 0}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-12 text-lg font-semibold"
              >
                {isLoading ? 'Processing...' : 'Place Order'}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing this order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
