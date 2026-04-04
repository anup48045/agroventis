'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { showNotification } from '@/utils/notifications'
import TwilioOTP from '@/components/TwilioOTP'

export default function BuyerAuth() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('login')
  const [loading, setLoading] = useState(false)
  const [showOTP, setShowOTP] = useState(false)
  const { login } = useAuth()
  const { t, currentLanguage, changeLanguage } = useLanguage()

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    state: '',
    district: '',
    city: '',
    pincode: ''
  })

  const handleLoginSuccess = (result) => {
    console.log('🔍 BuyerAuth: handleLoginSuccess called with:', result)
    console.log('🔍 BuyerAuth: About to call login() with:', result.user)
    
    login(result.user, result.token)
    showNotification(t('success'), 'success')
    
    console.log('🔍 BuyerAuth: Login called, now redirecting to dashboard...')
    
    // Redirect to dashboard using Next.js router
    console.log('🔍 BuyerAuth: Redirecting to /buyer/dashboard')
    router.push('/buyer/dashboard')
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setShowOTP(true) // Show Twilio OTP verification
  }

  const handleRegisterSuccess = (result) => {
    console.log('🔍 BuyerAuth: handleRegisterSuccess called with:', result)
    console.log('🔍 BuyerAuth: About to call login() with:', result.user)
    
    login(result.user, result.token)
    showNotification(t('success'), 'success')
    
    console.log('🔍 BuyerAuth: Registration login called, now redirecting to dashboard...')
    
    // Redirect to dashboard using Next.js router
    console.log('🔍 BuyerAuth: Redirecting to /buyer/dashboard')
    router.push('/buyer/dashboard')
  }

  if (showOTP) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 text-center rounded-t-xl shadow-lg">
            <h1 className="text-2xl font-bold mb-2">{t('appTitle')}</h1>
            <p className="text-blue-100">Complete Your Registration</p>
          </div>
          
          <TwilioOTP 
            userData={{ ...registerData, userType: 'buyer', languagePreference: currentLanguage }}
            onRegisterSuccess={handleRegisterSuccess}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 text-center rounded-t-xl shadow-lg">
          <h1 className="text-2xl font-bold mb-2">{t('appTitle')}</h1>
          <p className="text-blue-100">{t('appSubtitle')}</p>
          
          {/* Language Selector */}
          <select 
            value={currentLanguage}
            onChange={(e) => changeLanguage(e.target.value)}
            className="mt-3 bg-blue-800 text-white px-3 py-1 rounded text-sm border border-blue-600"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="bn">বাংলা</option>
            <option value="te">తెలుగు</option>
          </select>
        </div>

        {/* Auth Content */}
        <div className="bg-white p-8 rounded-b-xl shadow-lg">
          {/* Tab Navigation */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === 'login'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {t('login')}
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === 'register'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {t('register')}
            </button>
          </div>

          {/* Login Form - Twilio OTP */}
          {activeTab === 'login' && (
            <TwilioOTP onLoginSuccess={handleLoginSuccess} />
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('name')}
                </label>
                <input
                  type="text"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('company')}
                </label>
                <input
                  type="text"
                  value={registerData.company}
                  onChange={(e) => setRegisterData({ ...registerData, company: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('phone')}
                </label>
                <input
                  type="tel"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('email')}
                </label>
                <input
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('state')}
                  </label>
                  <input
                    type="text"
                    value={registerData.state}
                    onChange={(e) => setRegisterData({ ...registerData, state: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('district')}
                  </label>
                  <input
                    type="text"
                    value={registerData.district}
                    onChange={(e) => setRegisterData({ ...registerData, district: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('city')}
                  </label>
                  <input
                    type="text"
                    value={registerData.city}
                    onChange={(e) => setRegisterData({ ...registerData, city: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('pincode')}
                  </label>
                  <input
                    type="text"
                    value={registerData.pincode}
                    onChange={(e) => setRegisterData({ ...registerData, pincode: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-700">
                  <strong>🚀 Real-time OTP Verification:</strong> You'll receive an SMS with OTP and get instant verification feedback!
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner h-5 w-5 mr-2"></div>
                    {t('loading')}
                  </div>
                ) : (
                  'Register with Twilio OTP'
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer Info */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>🏢 {t('appSubtitle')}</p>
          <p className="mt-2 text-xs">Made for Indian Businesses</p>
        </div>
      </div>
    </div>
  )
}
