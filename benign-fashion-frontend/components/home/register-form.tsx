'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useAtom } from 'jotai'
import { useRouter } from "next/navigation"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, User, Lock, Mail, Eye, EyeOff, Check, AlertCircle } from 'lucide-react'
import { validatePassword } from '@/utils/validatePassword'
import { RegisterRequestSchema } from '@/utils/type'
import { registerUser } from '@/api/signup-api'
import { getUsers } from '@/api/users-api'
import { UserType } from './login-form'
import { tokenAtom } from '@/utils/user'
import { toast } from "@/hooks/use-toast"

interface RegisterFormProps {
  isOpen: boolean
  onClose: () => void
  onRegister: (user: UserType) => void
  onSwitchToLogin: () => void
}

interface PasswordRequirement {
  text: string
  met: boolean
}

export default function RegisterForm({
  isOpen,
  onClose,
  onRegister,
  onSwitchToLogin,
}: RegisterFormProps) {
  const router = useRouter()
  const [token] = useAtom(tokenAtom)
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [existingUsers, setExistingUsers] = useState<any[]>([])
  const [checkingAvailability, setCheckingAvailability] = useState(false)
  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
  })

  // Password requirements validation
  const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirement[]>([
    { text: 'At least 8 characters long', met: false },
    { text: 'Contains uppercase letter (A-Z)', met: false },
    { text: 'Contains lowercase letter (a-z)', met: false },
    { text: 'Contains a number (0-9)', met: false },
    { text: 'Contains special character (!@#$%^&*...)', met: false },
    { text: 'Not a common password', met: false },
  ])

  // Fetch all existing users when modal opens
  const fetchUsers = useCallback(async () => {
    if (!isOpen) return
    
    try {
      setCheckingAvailability(true)
      const res = await getUsers(token || '')
      setExistingUsers(res.data || [])
  
    } catch (error) {
      console.error('Failed to fetch users:', error)
      setExistingUsers([])
    } finally {
      setCheckingAvailability(false)
    }
  }, [token, isOpen])

  useEffect(() => {
    if (isOpen) {
      fetchUsers()
    }
  }, [fetchUsers, isOpen])

  // Validate password in real-time
  useEffect(() => {
    const password = formData.password
    const commonPasswords = ['password123', 'admin123', '12345678']

    setPasswordRequirements([
      { text: 'At least 8 characters long', met: password.length >= 8 },
      { text: 'Contains uppercase letter (A-Z)', met: /[A-Z]/.test(password) },
      { text: 'Contains lowercase letter (a-z)', met: /[a-z]/.test(password) },
      { text: 'Contains a number (0-9)', met: /\d/.test(password) },
      { text: 'Contains special character (!@#$%^&*...)', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
      { text: 'Not a common password', met: password.length > 0 && !commonPasswords.includes(password.toLowerCase()) },
    ])
  }, [formData.password])

  const allPasswordRequirementsMet = passwordRequirements.every(req => req.met)
  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword

  // Check if username already exists
  const isUsernameTaken = (username: string) => {
    if (!username || username.length < 3) return false
    const isTaken = existingUsers.some(
      user => user.username && user.username.toLowerCase() === username.toLowerCase()
    )
    
    return isTaken
  }

  // Check if email already exists
  const isEmailTaken = (email: string) => {
    if (!email || !isEmailValid(email)) return false
    const isTaken = existingUsers.some(
      user => user.email && user.email.toLowerCase() === email.toLowerCase()
    )
 
    return isTaken
  }

  // Email validation
  const isEmailValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  // Username validation
  const isUsernameValid = (username: string) => {
    return username.length >= 3
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Mark all fields as touched
    setTouched({
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
    })

    // Validate username
    if (!isUsernameValid(formData.username)) {
      setError('Username must be at least 3 characters long')
      return
    }

    // Check if username is taken
    if (isUsernameTaken(formData.username)) {
      setError('This username is already taken. Please choose another one.')
      return
    }

    // Validate email
    if (!isEmailValid(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    // Check if email is taken
    if (isEmailTaken(formData.email)) {
      setError('This email is already registered. Please use another email or login.')
      return
    }

    // Validate password requirements
    if (!allPasswordRequirementsMet) {
      setError('Please meet all password requirements')
      return
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      setLoading(true)
      const validatedData = RegisterRequestSchema.parse({
        ...formData,
        roleId: 2,
      })
      const response = await registerUser(validatedData)

      if (response.data && response.data.status === 'success') {
        // ✅ Registration successful - show success message
        const registeredUser = response.data.data.user
        
        // Show success message with instructions to login
        setSuccess(
          `Account created successfully! Please login using your username "${registeredUser.username}" and password to access your dashboard.`
        )
        
        toast({
          title: "Registration Successful! 🎉",
          description: `Welcome ${registeredUser.username}! Please login with your credentials to access the dashboard.`,
          variant: "default",
        })
        
        // Reset form
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        })
        setTouched({
          username: false,
          email: false,
          password: false,
          confirmPassword: false,
        })
        
        // Switch to login form after 3 seconds so user can read the message
        setTimeout(() => {
          setSuccess('')
          onClose()
          onSwitchToLogin()
        }, 3000)
      } else {
        setError('Registration failed. Please try again.')
        toast({
          title: "Error",
          description: 'Registration failed. Please try again.',
          variant: "destructive",
        })
      }
    } catch (err: any) {
      console.error('Registration error:', err)
      if (err.errors) {
        setError('Validation failed. Please check your inputs.')
      } else {
        setError(err.message || 'An error occurred. Please try again.')
      }
      toast({
        title: "Error",
        description: err.message || 'An error occurred. Please try again.',
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-900">
            Create New Account
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md flex items-start gap-2">
              <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-600">{success}</p>
            </div>
          )}

          {/* Username */}
          <div className="space-y-2">
            <label
              htmlFor="reg-username"
              className="text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="reg-username"
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                onBlur={() => handleBlur('username')}
                placeholder="Choose a username"
                className={`pl-10 ${
                  touched.username && !isUsernameValid(formData.username)
                    ? 'border-red-300 focus:border-red-500'
                    : touched.username && isUsernameTaken(formData.username)
                    ? 'border-red-300 focus:border-red-500'
                    : touched.username && isUsernameValid(formData.username)
                    ? 'border-blue-300 focus:border-blue-500'
                    : ''
                }`}
                required
              />
            </div>
            {touched.username && !isUsernameValid(formData.username) && (
              <p className="text-xs text-red-600">Username must be at least 3 characters</p>
            )}
            {touched.username && isUsernameValid(formData.username) && isUsernameTaken(formData.username) && (
              <p className="text-xs text-red-600">This username is already taken</p>
            )}
            {touched.username && isUsernameValid(formData.username) && !isUsernameTaken(formData.username) && (
              <p className="text-xs text-blue-600 flex items-center gap-1">
                <Check className="w-3 h-3" />
                Username is available
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="reg-email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="reg-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="Enter your email"
                className={`pl-10 ${
                  touched.email && !isEmailValid(formData.email)
                    ? 'border-red-300 focus:border-red-500'
                    : touched.email && isEmailTaken(formData.email)
                    ? 'border-red-300 focus:border-red-500'
                    : touched.email && isEmailValid(formData.email)
                    ? 'border-blue-300 focus:border-blue-500'
                    : ''
                }`}
                required
              />
            </div>
            {touched.email && !isEmailValid(formData.email) && (
              <p className="text-xs text-red-600">Please enter a valid email address</p>
            )}
            {touched.email && isEmailValid(formData.email) && isEmailTaken(formData.email) && (
              <p className="text-xs text-red-600">This email is already registered</p>
            )}
            {touched.email && isEmailValid(formData.email) && !isEmailTaken(formData.email) && (
              <p className="text-xs text-blue-600 flex items-center gap-1">
                <Check className="w-3 h-3" />
                Email is available
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label
              htmlFor="reg-password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                placeholder="Create a password"
                className={`pl-10 pr-10 ${
                  touched.password && !allPasswordRequirementsMet
                    ? 'border-red-300 focus:border-red-500'
                    : touched.password && allPasswordRequirementsMet
                    ? 'border-blue-300 focus:border-blue-500'
                    : ''
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            
            {/* Password Requirements */}
            {(touched.password || formData.password.length > 0) && (
              <div className="bg-gray-50 rounded-md p-3 space-y-1.5">
                <p className="text-xs font-medium text-gray-700 mb-2">Password must have:</p>
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-start gap-2">
                    {req.met ? (
                      <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={`text-xs ${req.met ? 'text-blue-700' : 'text-gray-600'}`}>
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label
              htmlFor="reg-confirm-password"
              className="text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="reg-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange('confirmPassword', e.target.value)
                }
                onBlur={() => handleBlur('confirmPassword')}
                placeholder="Confirm your password"
                className={`pl-10 pr-10 ${
                  touched.confirmPassword && formData.confirmPassword && !passwordsMatch
                    ? 'border-red-300 focus:border-red-500'
                    : touched.confirmPassword && passwordsMatch
                    ? 'border-blue-300 focus:border-blue-500'
                    : ''
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {touched.confirmPassword && formData.confirmPassword && !passwordsMatch && (
              <p className="text-xs text-red-600">Passwords do not match</p>
            )}
            {touched.confirmPassword && passwordsMatch && (
              <p className="text-xs text-blue-600 flex items-center gap-1">
                <Check className="w-3 h-3" />
                Passwords match
              </p>
            )}
          </div>

          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? 'Creating...' : 'Create Account'}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


// 'use client'

// import React, { useState, useEffect, useCallback } from 'react'
// import { useAtom } from 'jotai'

// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { X, User, Lock, Mail, Eye, EyeOff, Check, AlertCircle } from 'lucide-react'
// import { validatePassword } from '@/utils/validatePassword'
// import { RegisterRequestSchema } from '@/utils/type'
// import { registerUser } from '@/api/signup-api'
// import { getUsers } from '@/api/users-api'
// import { UserType } from './login-form'
// import { tokenAtom } from '@/utils/user'

// interface RegisterFormProps {
//   isOpen: boolean
//   onClose: () => void
//   onRegister: (user: UserType) => void
//   onSwitchToLogin: () => void
// }

// interface PasswordRequirement {
//   text: string
//   met: boolean
// }

// export default function RegisterForm({
//   isOpen,
//   onClose,
//   onRegister,
//   onSwitchToLogin,
// }: RegisterFormProps) {
//   const [token] = useAtom(tokenAtom)
  
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   })
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [existingUsers, setExistingUsers] = useState<any[]>([])
//   const [checkingAvailability, setCheckingAvailability] = useState(false)
//   const [touched, setTouched] = useState({
//     username: false,
//     email: false,
//     password: false,
//     confirmPassword: false,
//   })

//   // Password requirements validation
//   const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirement[]>([
//     { text: 'At least 8 characters long', met: false },
//     { text: 'Contains uppercase letter (A-Z)', met: false },
//     { text: 'Contains lowercase letter (a-z)', met: false },
//     { text: 'Contains a number (0-9)', met: false },
//     { text: 'Contains special character (!@#$%^&*...)', met: false },
//     { text: 'Not a common password', met: false },
//   ])

//   // Fetch all existing users when modal opens
//   const fetchUsers = useCallback(async () => {
//     if (!isOpen) return
    
//     try {
//       setCheckingAvailability(true)
//       // Try to fetch users - if token is empty, API might still allow public access
//       const res = await getUsers(token || '')
//       setExistingUsers(res.data || [])
  
//     } catch (error) {
//       console.error('Failed to fetch users:', error)
//       // Set empty array if fetch fails - validation will be skipped
//       setExistingUsers([])
//     } finally {
//       setCheckingAvailability(false)
//     }
//   }, [token, isOpen])

//   useEffect(() => {
//     if (isOpen) {
 
//       fetchUsers()
//     }
//   }, [fetchUsers, isOpen])

//   // Validate password in real-time
//   useEffect(() => {
//     const password = formData.password
//     const commonPasswords = ['password123', 'admin123', '12345678']

//     setPasswordRequirements([
//       { text: 'At least 8 characters long', met: password.length >= 8 },
//       { text: 'Contains uppercase letter (A-Z)', met: /[A-Z]/.test(password) },
//       { text: 'Contains lowercase letter (a-z)', met: /[a-z]/.test(password) },
//       { text: 'Contains a number (0-9)', met: /\d/.test(password) },
//       { text: 'Contains special character (!@#$%^&*...)', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
//       { text: 'Not a common password', met: password.length > 0 && !commonPasswords.includes(password.toLowerCase()) },
//     ])
//   }, [formData.password])

//   const allPasswordRequirementsMet = passwordRequirements.every(req => req.met)
//   const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword

//   // Check if username already exists
//   const isUsernameTaken = (username: string) => {
//     if (!username || username.length < 3) return false
//     const isTaken = existingUsers.some(
//       user => user.username && user.username.toLowerCase() === username.toLowerCase()
//     )
    
//     return isTaken
//   }

//   // Check if email already exists
//   const isEmailTaken = (email: string) => {
//     if (!email || !isEmailValid(email)) return false
//     const isTaken = existingUsers.some(
//       user => user.email && user.email.toLowerCase() === email.toLowerCase()
//     )
 
//     return isTaken
//   }

//   // Email validation
//   const isEmailValid = (email: string) => {
//     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
//   }

//   // Username validation
//   const isUsernameValid = (username: string) => {
//     return username.length >= 3
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError('')
//     setSuccess('')

//     // Mark all fields as touched
//     setTouched({
//       username: true,
//       email: true,
//       password: true,
//       confirmPassword: true,
//     })

//     // Validate username
//     if (!isUsernameValid(formData.username)) {
//       setError('Username must be at least 3 characters long')
//       return
//     }

//     // Check if username is taken
//     if (isUsernameTaken(formData.username)) {
//       setError('This username is already taken. Please choose another one.')
//       return
//     }

//     // Validate email
//     if (!isEmailValid(formData.email)) {
//       setError('Please enter a valid email address')
//       return
//     }

//     // Check if email is taken
//     if (isEmailTaken(formData.email)) {
//       setError('This email is already registered. Please use another email or login.')
//       return
//     }

//     // Validate password requirements
//     if (!allPasswordRequirementsMet) {
//       setError('Please meet all password requirements')
//       return
//     }

//     // Validate password match
//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match')
//       return
//     }

//     try {
//       setLoading(true)
//       const validatedData = RegisterRequestSchema.parse({
//         ...formData,
//         roleId: 2,
//       })
//       const response = await registerUser(validatedData)

//       if (response.data && response.data.status === 'success') {
//         setSuccess(
//           'Registration successful! You can now login with your credentials.'
//         )
//         onRegister({
//           username: response.data.data.user.username,
//           email: response.data.data.user.email,
//           userId: 0,
//           roleId: response.data.data.user.roleId,
//         })
//         setTimeout(() => {
//           onClose()
//           setFormData({
//             username: '',
//             email: '',
//             password: '',
//             confirmPassword: '',
//           })
//           setTouched({
//             username: false,
//             email: false,
//             password: false,
//             confirmPassword: false,
//           })
//           setSuccess('')
//         }, 2000)
//       } else {
//         setError('Registration failed. Please try again.')
//       }
//     } catch (err: any) {
//       if (err.errors) {
//         setError('Validation failed. Please check your inputs.')
//       } else {
//         setError(err.message || 'An error occurred. Please try again.')
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleInputChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//     setError('') // Clear general error when user types
//   }

//   const handleBlur = (field: string) => {
//     setTouched((prev) => ({ ...prev, [field]: true }))
//   }

//   if (!isOpen) return null

//   return (
//     <div className="fixed inset-0 z-50 overflow-hidden">
//       <div
//         className="absolute inset-0 bg-black bg-opacity-50"
//         onClick={onClose}
//       />
//       <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
//         <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
//           <h2 className="text-xl font-semibold text-gray-900">
//             Create New Account
//           </h2>
//           <Button variant="ghost" size="icon" onClick={onClose}>
//             <X className="w-5 h-5" />
//           </Button>
//         </div>

//         <div className="p-6 space-y-4">
//           {error && (
//             <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
//               <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
//               <p className="text-sm text-red-600">{error}</p>
//             </div>
//           )}

//           {success && (
//             <div className="p-3 bg-blue-50 border border-blue-200 rounded-md flex items-start gap-2">
//               <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
//               <p className="text-sm text-blue-600">{success}</p>
//             </div>
//           )}

//           {/* Username */}
//           <div className="space-y-2">
//             <label
//               htmlFor="reg-username"
//               className="text-sm font-medium text-gray-700"
//             >
//               Username
//             </label>
//             <div className="relative">
//               <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <Input
//                 id="reg-username"
//                 type="text"
//                 value={formData.username}
//                 onChange={(e) => handleInputChange('username', e.target.value)}
//                 onBlur={() => handleBlur('username')}
//                 placeholder="Choose a username"
//                 className={`pl-10 ${
//                   touched.username && !isUsernameValid(formData.username)
//                     ? 'border-red-300 focus:border-red-500'
//                     : touched.username && isUsernameTaken(formData.username)
//                     ? 'border-red-300 focus:border-red-500'
//                     : touched.username && isUsernameValid(formData.username)
//                     ? 'border-blue-300 focus:border-blue-500'
//                     : ''
//                 }`}
//                 required
//               />
//             </div>
//             {touched.username && !isUsernameValid(formData.username) && (
//               <p className="text-xs text-red-600">Username must be at least 3 characters</p>
//             )}
//             {touched.username && isUsernameValid(formData.username) && isUsernameTaken(formData.username) && (
//               <p className="text-xs text-red-600">This username is already taken</p>
//             )}
//             {touched.username && isUsernameValid(formData.username) && !isUsernameTaken(formData.username) && (
//               <p className="text-xs text-blue-600 flex items-center gap-1">
//                 <Check className="w-3 h-3" />
//                 Username is available
//               </p>
//             )}
//           </div>

//           {/* Email */}
//           <div className="space-y-2">
//             <label
//               htmlFor="reg-email"
//               className="text-sm font-medium text-gray-700"
//             >
//               Email
//             </label>
//             <div className="relative">
//               <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <Input
//                 id="reg-email"
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) => handleInputChange('email', e.target.value)}
//                 onBlur={() => handleBlur('email')}
//                 placeholder="Enter your email"
//                 className={`pl-10 ${
//                   touched.email && !isEmailValid(formData.email)
//                     ? 'border-red-300 focus:border-red-500'
//                     : touched.email && isEmailTaken(formData.email)
//                     ? 'border-red-300 focus:border-red-500'
//                     : touched.email && isEmailValid(formData.email)
//                     ? 'border-blue-300 focus:border-blue-500'
//                     : ''
//                 }`}
//                 required
//               />
//             </div>
//             {touched.email && !isEmailValid(formData.email) && (
//               <p className="text-xs text-red-600">Please enter a valid email address</p>
//             )}
//             {touched.email && isEmailValid(formData.email) && isEmailTaken(formData.email) && (
//               <p className="text-xs text-red-600">This email is already registered</p>
//             )}
//             {touched.email && isEmailValid(formData.email) && !isEmailTaken(formData.email) && (
//               <p className="text-xs text-blue-600 flex items-center gap-1">
//                 <Check className="w-3 h-3" />
//                 Email is available
//               </p>
//             )}
//           </div>

//           {/* Password */}
//           <div className="space-y-2">
//             <label
//               htmlFor="reg-password"
//               className="text-sm font-medium text-gray-700"
//             >
//               Password
//             </label>
//             <div className="relative">
//               <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <Input
//                 id="reg-password"
//                 type={showPassword ? 'text' : 'password'}
//                 value={formData.password}
//                 onChange={(e) => handleInputChange('password', e.target.value)}
//                 onBlur={() => handleBlur('password')}
//                 placeholder="Create a password"
//                 className={`pl-10 pr-10 ${
//                   touched.password && !allPasswordRequirementsMet
//                     ? 'border-red-300 focus:border-red-500'
//                     : touched.password && allPasswordRequirementsMet
//                     ? 'border-blue-300 focus:border-blue-500'
//                     : ''
//                 }`}
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword((prev) => !prev)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
//               >
//                 {showPassword ? (
//                   <EyeOff className="w-4 h-4" />
//                 ) : (
//                   <Eye className="w-4 h-4" />
//                 )}
//               </button>
//             </div>
            
//             {/* Password Requirements */}
//             {(touched.password || formData.password.length > 0) && (
//               <div className="bg-gray-50 rounded-md p-3 space-y-1.5">
//                 <p className="text-xs font-medium text-gray-700 mb-2">Password must have:</p>
//                 {passwordRequirements.map((req, index) => (
//                   <div key={index} className="flex items-start gap-2">
//                     {req.met ? (
//                       <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
//                     ) : (
//                       <X className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
//                     )}
//                     <span className={`text-xs ${req.met ? 'text-blue-700' : 'text-gray-600'}`}>
//                       {req.text}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Confirm Password */}
//           <div className="space-y-2">
//             <label
//               htmlFor="reg-confirm-password"
//               className="text-sm font-medium text-gray-700"
//             >
//               Confirm Password
//             </label>
//             <div className="relative">
//               <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <Input
//                 id="reg-confirm-password"
//                 type={showConfirmPassword ? 'text' : 'password'}
//                 value={formData.confirmPassword}
//                 onChange={(e) =>
//                   handleInputChange('confirmPassword', e.target.value)
//                 }
//                 onBlur={() => handleBlur('confirmPassword')}
//                 placeholder="Confirm your password"
//                 className={`pl-10 pr-10 ${
//                   touched.confirmPassword && formData.confirmPassword && !passwordsMatch
//                     ? 'border-red-300 focus:border-red-500'
//                     : touched.confirmPassword && passwordsMatch
//                     ? 'border-blue-300 focus:border-blue-500'
//                     : ''
//                 }`}
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirmPassword((prev) => !prev)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
//               >
//                 {showConfirmPassword ? (
//                   <EyeOff className="w-4 h-4" />
//                 ) : (
//                   <Eye className="w-4 h-4" />
//                 )}
//               </button>
//             </div>
//             {touched.confirmPassword && formData.confirmPassword && !passwordsMatch && (
//               <p className="text-xs text-red-600">Passwords do not match</p>
//             )}
//             {touched.confirmPassword && passwordsMatch && (
//               <p className="text-xs text-blue-600 flex items-center gap-1">
//                 <Check className="w-3 h-3" />
//                 Passwords match
//               </p>
//             )}
//           </div>

//           <Button
//             type="submit"
//             onClick={handleSubmit}
//             disabled={loading}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white"
//           >
//             {loading ? 'Creating...' : 'Create Account'}
//           </Button>

//           <div className="text-center">
//             <p className="text-sm text-gray-600">
//               Already have an account?{' '}
//               <button
//                 type="button"
//                 onClick={onSwitchToLogin}
//                 className="text-blue-600 hover:text-blue-700 font-medium"
//               >
//                 Login here
//               </button>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

