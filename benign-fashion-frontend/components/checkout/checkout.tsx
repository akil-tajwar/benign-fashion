'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Plus,
  Minus,
  X,
  ShoppingCart,
  MapPin,
  Phone,
  Mail,
  User,
} from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { CustomCombobox } from '@/utils/custom-combobox'

// Bangladesh location data
const locationData = {
  divisions: [
    { id: 'Dhaka', name: 'Dhaka' },
    { id: 'Chittagong', name: 'Chittagong' },
    { id: 'Rajshahi', name: 'Rajshahi' },
    { id: 'Khulna', name: 'Khulna' },
    { id: 'Barisal', name: 'Barisal' },
    { id: 'Sylhet', name: 'Sylhet' },
    { id: 'Rangpur', name: 'Rangpur' },
    { id: 'Mymensingh', name: 'Mymensingh' },
  ],
  districts: {
    Dhaka: [
      { id: 'Dhaka', name: 'Dhaka' },
      { id: 'Faridpur', name: 'Faridpur' },
      { id: 'Gazipur', name: 'Gazipur' },
      { id: 'Gopalganj', name: 'Gopalganj' },
      { id: 'Kishoreganj', name: 'Kishoreganj' },
      { id: 'Madaripur', name: 'Madaripur' },
      { id: 'Manikganj', name: 'Manikganj' },
      { id: 'Munshiganj', name: 'Munshiganj' },
      { id: 'Narayanganj', name: 'Narayanganj' },
      { id: 'Narsingdi', name: 'Narsingdi' },
      { id: 'Rajbari', name: 'Rajbari' },
      { id: 'Shariatpur', name: 'Shariatpur' },
      { id: 'Tangail', name: 'Tangail' },
    ],
    Chittagong: [
      { id: 'Bandarban', name: 'Bandarban' },
      { id: 'Brahmanbaria', name: 'Brahmanbaria' },
      { id: 'Chandpur', name: 'Chandpur' },
      { id: 'Chittagong', name: 'Chittagong' },
      { id: 'Comilla', name: 'Comilla' },
      { id: "Cox's Bazar", name: "Cox's Bazar" },
      { id: 'Feni', name: 'Feni' },
      { id: 'Khagrachhari', name: 'Khagrachhari' },
      { id: 'Lakshmipur', name: 'Lakshmipur' },
      { id: 'Noakhali', name: 'Noakhali' },
      { id: 'Rangamati', name: 'Rangamati' },
    ],
    Rajshahi: [
      { id: 'Bogra', name: 'Bogra' },
      { id: 'Joypurhat', name: 'Joypurhat' },
      { id: 'Naogaon', name: 'Naogaon' },
      { id: 'Natore', name: 'Natore' },
      { id: 'Chapainawabganj', name: 'Chapainawabganj' },
      { id: 'Pabna', name: 'Pabna' },
      { id: 'Rajshahi', name: 'Rajshahi' },
      { id: 'Sirajganj', name: 'Sirajganj' },
    ],
    Khulna: [
      { id: 'Bagerhat', name: 'Bagerhat' },
      { id: 'Chuadanga', name: 'Chuadanga' },
      { id: 'Jessore', name: 'Jessore' },
      { id: 'Jhenaidah', name: 'Jhenaidah' },
      { id: 'Khulna', name: 'Khulna' },
      { id: 'Kushtia', name: 'Kushtia' },
      { id: 'Magura', name: 'Magura' },
      { id: 'Meherpur', name: 'Meherpur' },
      { id: 'Narail', name: 'Narail' },
      { id: 'Satkhira', name: 'Satkhira' },
    ],
    Barisal: [
      { id: 'Barguna', name: 'Barguna' },
      { id: 'Barisal', name: 'Barisal' },
      { id: 'Bhola', name: 'Bhola' },
      { id: 'Jhalokati', name: 'Jhalokati' },
      { id: 'Patuakhali', name: 'Patuakhali' },
      { id: 'Pirojpur', name: 'Pirojpur' },
    ],
    Sylhet: [
      { id: 'Habiganj', name: 'Habiganj' },
      { id: 'Moulvibazar', name: 'Moulvibazar' },
      { id: 'Sunamganj', name: 'Sunamganj' },
      { id: 'Sylhet', name: 'Sylhet' },
    ],
    Rangpur: [
      { id: 'Dinajpur', name: 'Dinajpur' },
      { id: 'Gaibandha', name: 'Gaibandha' },
      { id: 'Kurigram', name: 'Kurigram' },
      { id: 'Lalmonirhat', name: 'Lalmonirhat' },
      { id: 'Nilphamari', name: 'Nilphamari' },
      { id: 'Panchagarh', name: 'Panchagarh' },
      { id: 'Rangpur', name: 'Rangpur' },
      { id: 'Thakurgaon', name: 'Thakurgaon' },
    ],
    Mymensingh: [
      { id: 'Jamalpur', name: 'Jamalpur' },
      { id: 'Mymensingh', name: 'Mymensingh' },
      { id: 'Netrokona', name: 'Netrokona' },
      { id: 'Sherpur', name: 'Sherpur' },
    ],
  },
  subDistricts: {
    Dhaka: [
      { id: 'Dhamrai', name: 'Dhamrai' },
      { id: 'Dohar', name: 'Dohar' },
      { id: 'Keraniganj', name: 'Keraniganj' },
      { id: 'Nawabganj', name: 'Nawabganj' },
      { id: 'Savar', name: 'Savar' },
    ],
    Chittagong: [
      { id: 'Anwara', name: 'Anwara' },
      { id: 'Banshkhali', name: 'Banshkhali' },
      { id: 'Boalkhali', name: 'Boalkhali' },
      { id: 'Chandanaish', name: 'Chandanaish' },
      { id: 'Fatikchhari', name: 'Fatikchhari' },
      { id: 'Hathazari', name: 'Hathazari' },
      { id: 'Lohagara', name: 'Lohagara' },
      { id: 'Mirsharai', name: 'Mirsharai' },
      { id: 'Patiya', name: 'Patiya' },
      { id: 'Rangunia', name: 'Rangunia' },
      { id: 'Raozan', name: 'Raozan' },
      { id: 'Sandwip', name: 'Sandwip' },
      { id: 'Satkania', name: 'Satkania' },
      { id: 'Sitakunda', name: 'Sitakunda' },
    ],
    Gazipur: [
      { id: 'Gazipur Sadar', name: 'Gazipur Sadar' },
      { id: 'Kaliakair', name: 'Kaliakair' },
      { id: 'Kaliganj', name: 'Kaliganj' },
      { id: 'Kapasia', name: 'Kapasia' },
      { id: 'Sreepur', name: 'Sreepur' },
    ],
    Narayanganj: [
      { id: 'Araihazar', name: 'Araihazar' },
      { id: 'Bandar', name: 'Bandar' },
      { id: 'Narayanganj Sadar', name: 'Narayanganj Sadar' },
      { id: 'Rupganj', name: 'Rupganj' },
      { id: 'Sonargaon', name: 'Sonargaon' },
    ],
    Comilla: [
      { id: 'Barura', name: 'Barura' },
      { id: 'Brahmanpara', name: 'Brahmanpara' },
      { id: 'Burichang', name: 'Burichang' },
      { id: 'Chandina', name: 'Chandina' },
      { id: 'Chauddagram', name: 'Chauddagram' },
      { id: 'Daudkandi', name: 'Daudkandi' },
      { id: 'Debidwar', name: 'Debidwar' },
      { id: 'Homna', name: 'Homna' },
      { id: 'Laksam', name: 'Laksam' },
      { id: 'Muradnagar', name: 'Muradnagar' },
      { id: 'Nangalkot', name: 'Nangalkot' },
      { id: 'Comilla Sadar', name: 'Comilla Sadar' },
      { id: 'Meghna', name: 'Meghna' },
      { id: 'Monohargonj', name: 'Monohargonj' },
      { id: 'Sadarsouth', name: 'Sadarsouth' },
      { id: 'Titas', name: 'Titas' },
    ],
    Rajshahi: [
      { id: 'Bagha', name: 'Bagha' },
      { id: 'Bagmara', name: 'Bagmara' },
      { id: 'Charghat', name: 'Charghat' },
      { id: 'Durgapur', name: 'Durgapur' },
      { id: 'Godagari', name: 'Godagari' },
      { id: 'Mohanpur', name: 'Mohanpur' },
      { id: 'Paba', name: 'Paba' },
      { id: 'Puthia', name: 'Puthia' },
      { id: 'Tanore', name: 'Tanore' },
    ],
    Khulna: [
      { id: 'Batiaghata', name: 'Batiaghata' },
      { id: 'Dacope', name: 'Dacope' },
      { id: 'Dumuria', name: 'Dumuria' },
      { id: 'Dighalia', name: 'Dighalia' },
      { id: 'Koyra', name: 'Koyra' },
      { id: 'Paikgachha', name: 'Paikgachha' },
      { id: 'Phultala', name: 'Phultala' },
      { id: 'Rupsa', name: 'Rupsa' },
      { id: 'Terokhada', name: 'Terokhada' },
    ],
    Sylhet: [
      { id: 'Beanibazar', name: 'Beanibazar' },
      { id: 'Bishwanath', name: 'Bishwanath' },
      { id: 'Companiganj', name: 'Companiganj' },
      { id: 'Fenchuganj', name: 'Fenchuganj' },
      { id: 'Golapganj', name: 'Golapganj' },
      { id: 'Gowainghat', name: 'Gowainghat' },
      { id: 'Jaintiapur', name: 'Jaintiapur' },
      { id: 'Kanaighat', name: 'Kanaighat' },
      { id: 'Sylhet Sadar', name: 'Sylhet Sadar' },
      { id: 'Zakiganj', name: 'Zakiganj' },
    ],
    Rangpur: [
      { id: 'Badarganj', name: 'Badarganj' },
      { id: 'Gangachhara', name: 'Gangachhara' },
      { id: 'Kaunia', name: 'Kaunia' },
      { id: 'Rangpur Sadar', name: 'Rangpur Sadar' },
      { id: 'Mithapukur', name: 'Mithapukur' },
      { id: 'Pirgachha', name: 'Pirgachha' },
      { id: 'Pirganj', name: 'Pirganj' },
      { id: 'Taraganj', name: 'Taraganj' },
    ],
    Mymensingh: [
      { id: 'Bhaluka', name: 'Bhaluka' },
      { id: 'Trishal', name: 'Trishal' },
      { id: 'Haluaghat', name: 'Haluaghat' },
      { id: 'Muktagachha', name: 'Muktagachha' },
      { id: 'Dhobaura', name: 'Dhobaura' },
      { id: 'Fulbaria', name: 'Fulbaria' },
      { id: 'Gaffargaon', name: 'Gaffargaon' },
      { id: 'Gauripur', name: 'Gauripur' },
      { id: 'Ishwarganj', name: 'Ishwarganj' },
      { id: 'Mymensingh Sadar', name: 'Mymensingh Sadar' },
      { id: 'Nandail', name: 'Nandail' },
      { id: 'Phulpur', name: 'Phulpur' },
    ],
  },
}

type CartItem = {
  productId: number
  name: string
  price: number
  quantity: number
  url: string
  discount: number
  productCode: string
  size: 'M' | 'L' | 'XL' | 'XXL'
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    division: '',
    district: '',
    subDistrict: '',
    method: 'bkash' as 'bkash' | 'nagad' | 'rocket',
    transactionId: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load cart from localStorage
  useEffect(() => {
    const cart = localStorage.getItem('cart')
    if (cart) {
      setCartItems(JSON.parse(cart))
    }
  }, [])

  // Update quantity
  const updateQuantity = (
    productId: number,
    size: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return
    const updatedCart = cartItems.map((item) =>
      item.productId === productId && item.size === size
        ? { ...item, quantity: newQuantity }
        : item
    )
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  // Remove item
  const removeFromCart = (productId: number, size: string) => {
    const updatedCart = cartItems.filter(
      (item) => !(item.productId === productId && item.size === size)
    )
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

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

  // Get available sub-districts based on selected district
  const getAvailableSubDistricts = () => {
    if (!formData.district) return []
    return (
      locationData.subDistricts[
        formData.district as keyof typeof locationData.subDistricts
      ] || []
    )
  }

  // Handle division change
  const handleDivisionChange = (value: { id: string; name: string } | null) => {
    setFormData({
      ...formData,
      division: value?.id || '',
      district: '',
      subDistrict: '',
    })
    setErrors({ ...errors, division: '' })
  }

  // Handle district change
  const handleDistrictChange = (value: { id: string; name: string } | null) => {
    setFormData({
      ...formData,
      district: value?.id || '',
      subDistrict: '',
    })
    setErrors({ ...errors, district: '' })
  }

  // Handle sub-district change
  const handleSubDistrictChange = (
    value: { id: string; name: string } | null
  ) => {
    setFormData({
      ...formData,
      subDistrict: value?.id || '',
    })
    setErrors({ ...errors, subDistrict: '' })
  }

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.division) newErrors.division = 'Division is required'
    if (!formData.district) newErrors.district = 'District is required'
    if (!formData.subDistrict)
      newErrors.subDistrict = 'Sub-district is required'
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
      const orderData = {
        orderMaster: {
          fullName: formData.fullName,
          division: formData.division,
          district: formData.district,
          subDistrict: formData.subDistrict,
          address: formData.address,
          phone: formData.phone,
          email: formData.email || null,
          status: 'pending' as const,
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

      // Replace with your actual API endpoint
      const response = await fetch('http://localhost:4000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error('Failed to place order')
      }

      toast.success('Order placed successfully!')
      localStorage.removeItem('cart')
      router.push('/order-success')
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
                  <Label className="text-sm font-medium text-gray-700">
                    Sub-District <span className="text-red-500">*</span>
                  </Label>
                  <div className="mt-1">
                    <CustomCombobox
                      items={getAvailableSubDistricts()}
                      value={
                        formData.subDistrict
                          ? {
                              id: formData.subDistrict,
                              name:
                                getAvailableSubDistricts().find(
                                  (d) => d.id === formData.subDistrict
                                )?.name || '',
                            }
                          : null
                      }
                      onChange={handleSubDistrictChange}
                      placeholder="Select sub-district"
                      disabled={!formData.district}
                    />
                  </div>
                  {errors.subDistrict && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.subDistrict}
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
                  <div className="text-pink-600 font-bold text-lg">bKash</div>
                </div>

                <div className="flex items-center space-x-3 border-2 border-gray-200 rounded-lg p-4 hover:border-orange-500 transition-colors cursor-pointer">
                  <RadioGroupItem value="nagad" id="nagad" />
                  <Label
                    htmlFor="nagad"
                    className="flex-1 cursor-pointer font-medium"
                  >
                    Nagad
                  </Label>
                  <div className="text-orange-600 font-bold text-lg">Nagad</div>
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
                    Rocket
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
                    <div className='w-14 h-14 overflow-hidden rounded-md'>
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
