'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ShoppingCart, MapPin, Phone, Mail, User } from 'lucide-react'
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

  const { cartItems } = useCart()

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
      localStorage.removeItem('cart')
    } catch (error) {
      console.error('Order error:', error)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Add some items to your cart to proceed with checkout
          </p>
          <Button
            onClick={() => router.push('/products')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8"
          >
            Continue Shopping
          </Button>
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
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />
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
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Payment Method
              </h2>

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
