'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Building2, Eye, EyeOff, Check } from 'lucide-react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'

const subscriptionOptions = [
  { value: 'individual', label: 'Individual ($9/month)' },
  { value: 'team', label: 'Team ($19/month)' },
  { value: 'vsb', label: 'Very Small Business ($29/month)' },
  { value: 'smb', label: 'Small & Medium Business ($49/month)' },
  { value: 'mmb', label: 'Mid-Market Business ($79/month)' },
  { value: 'lmb', label: 'Large Market Business ($99/month)' },
  { value: 'enterprise', label: 'Enterprise (Contact Sales)' },
]

export default function RegisterPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    // Company Information
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    industry: '',
    companySize: '',
    
    // Subscription
    subscription: 'individual',
    
    // Agreement
    agreeToTerms: false,
    agreeToNewsletter: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      // TODO: Implement registration logic
      console.log('Registration attempt:', formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      setErrors({ general: 'Registration failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateStep = () => {
    const newErrors: Record<string, string> = {}

    if (currentStep === 1) {
      if (!formData.firstName) newErrors.firstName = 'First name is required'
      if (!formData.lastName) newErrors.lastName = 'Last name is required'
      if (!formData.email) newErrors.email = 'Email is required'
      if (!formData.password) newErrors.password = 'Password is required'
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    } else if (currentStep === 2) {
      if (!formData.companyName) newErrors.companyName = 'Company name is required'
      if (!formData.subscription) newErrors.subscription = 'Please select a subscription plan'
    } else if (currentStep === 3) {
      if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <Building2 className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign in
            </Link>
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${step <= currentStep 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
                }
              `}>
                {step < currentStep ? <Check className="h-4 w-4" /> : step}
              </div>
              {step < 3 && (
                <div className={`w-12 h-1 ${step < currentStep ? 'bg-primary-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Registration Form */}
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {errors.general}
              </div>
            )}

            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  <p className="text-sm text-gray-600">Tell us about yourself</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    error={errors.firstName}
                    placeholder="John"
                    required
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    error={errors.lastName}
                    placeholder="Doe"
                    required
                  />
                </div>

                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  placeholder="john@company.com"
                  required
                />

                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    error={errors.password}
                    placeholder="Create a strong password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    error={errors.confirmPassword}
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </>
            )}

            {/* Step 2: Company Information */}
            {currentStep === 2 && (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
                  <p className="text-sm text-gray-600">Set up your business details</p>
                </div>

                <Input
                  label="Company Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  error={errors.companyName}
                  placeholder="Your Company Ltd."
                  required
                />

                <Input
                  label="Company Email"
                  type="email"
                  name="companyEmail"
                  value={formData.companyEmail}
                  onChange={handleInputChange}
                  error={errors.companyEmail}
                  placeholder="info@company.com"
                />

                <Input
                  label="Company Phone"
                  type="tel"
                  name="companyPhone"
                  value={formData.companyPhone}
                  onChange={handleInputChange}
                  error={errors.companyPhone}
                  placeholder="+1 (555) 123-4567"
                />

                <Select
                  label="Industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  options={[
                    { value: 'technology', label: 'Technology' },
                    { value: 'manufacturing', label: 'Manufacturing' },
                    { value: 'retail', label: 'Retail' },
                    { value: 'healthcare', label: 'Healthcare' },
                    { value: 'finance', label: 'Finance' },
                    { value: 'education', label: 'Education' },
                    { value: 'other', label: 'Other' },
                  ]}
                  placeholder="Select your industry"
                />

                <Select
                  label="Company Size"
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleInputChange}
                  options={[
                    { value: '1', label: 'Just me' },
                    { value: '2-10', label: '2-10 employees' },
                    { value: '11-50', label: '11-50 employees' },
                    { value: '51-200', label: '51-200 employees' },
                    { value: '201-500', label: '201-500 employees' },
                    { value: '500+', label: '500+ employees' },
                  ]}
                  placeholder="Select company size"
                />
              </>
            )}

            {/* Step 3: Subscription & Confirmation */}
            {currentStep === 3 && (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Choose Your Plan</h3>
                  <p className="text-sm text-gray-600">Select the plan that fits your needs</p>
                </div>

                <Select
                  label="Subscription Plan"
                  name="subscription"
                  value={formData.subscription}
                  onChange={handleInputChange}
                  error={errors.subscription}
                  options={subscriptionOptions}
                  required
                />

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="agreeToTerms"
                      name="agreeToTerms"
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      required
                    />
                    <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
                      I agree to the{' '}
                      <Link href="/terms" className="text-primary-600 hover:text-primary-500">
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link href="/privacy" className="text-primary-600 hover:text-primary-500">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                  {errors.agreeToTerms && (
                    <p className="text-sm text-red-600">{errors.agreeToTerms}</p>
                  )}

                  <div className="flex items-center">
                    <input
                      id="agreeToNewsletter"
                      name="agreeToNewsletter"
                      type="checkbox"
                      checked={formData.agreeToNewsletter}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="agreeToNewsletter" className="ml-2 block text-sm text-gray-900">
                      Send me product updates and newsletters
                    </label>
                  </div>
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                >
                  Previous
                </Button>
              )}
              
              <div className="ml-auto">
                {currentStep < 3 ? (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={nextStep}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isLoading}
                  >
                    Create Account
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Security Notice */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Your data is encrypted and secure. We never share your information with third parties.
          </p>
        </div>
      </div>
    </div>
  )
}