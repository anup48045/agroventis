'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation' // ✅ ADDED
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { showNotification } from '@/utils/notifications'
import TwilioOTP from '@/components/TwilioOTP'

export default function FarmerAuth() {
  const router = useRouter() // ✅ ADDED

  const [activeTab, setActiveTab] = useState('login')
  const [showOTP, setShowOTP] = useState(false)

  const { login } = useAuth()
  const { t, currentLanguage, changeLanguage } = useLanguage()

  const [registerData, setRegisterData] = useState({
    name: '',
    phone: '',
    email: '',
    state: '',
    district: '',
    village: '',
    pincode: ''
  })

  // ✅ FIXED (moved out of render)
  useEffect(() => {
    if (showOTP && !registerData.phone) {
      setShowOTP(false)
    }
  }, [showOTP, registerData.phone])

  // -------------------------
  // LOGIN SUCCESS
  // -------------------------
  const handleLoginSuccess = (result) => {
    console.log('🔍 FarmerAuth: handleLoginSuccess called with:', result)

    if (!result?.user || !result?.token) {
      showNotification('Login failed', 'error')
      return
    }

    try {
      login(result.user, result.token)
      showNotification(t('success'), 'success')

      setTimeout(() => {
        router.replace('/farmer/dashboard') // ✅ FIXED
      }, 100)
    } catch (error) {
      console.error('❌ Login error:', error)
      window.location.href = '/farmer/dashboard'
    }
  }

  // -------------------------
  // REGISTER
  // -------------------------
  const handleRegister = async (e) => {
    e.preventDefault()

    if (!registerData.name || !registerData.phone) {
      showNotification('Name and Phone are required', 'error')
      return
    }

    const phone = registerData.phone.startsWith('+91')
      ? registerData.phone
      : `+91${registerData.phone}`

    const res = await fetch('/api/twilio/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    })

    const data = await res.json()

    if (res.ok) {
      setShowOTP(true)
      showNotification('OTP sent successfully', 'success')
    } else {
      showNotification(data.error || 'Failed to send OTP', 'error')
    }
  }

  // -------------------------
  // REGISTER SUCCESS
  // -------------------------
  const handleRegisterSuccess = (result) => {
    console.log('🔍 FarmerAuth: handleRegisterSuccess:', result)

    if (!result?.user || !result?.token) {
      showNotification('Registration failed', 'error')
      return
    }

    try {
      login(result.user, result.token)
      showNotification(t('success'), 'success')

      setTimeout(() => {
        router.replace('/farmer/dashboard') // ✅ FIXED
      }, 100)
    } catch (error) {
      console.error('❌ Register error:', error)
      window.location.href = '/farmer/dashboard'
    }
  }

  // -------------------------
  // OTP SCREEN
  // -------------------------
  if (showOTP) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">

          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-8 text-center rounded-t-xl shadow-lg">
            <h1 className="text-2xl font-bold mb-2">{t('appTitle')}</h1>
            <p className="text-green-100">Complete Registration</p>
          </div>

          <TwilioOTP
            phone={registerData.phone}
            userData={{
              ...registerData,
              userType: 'farmer',
              languagePreference: currentLanguage
            }}
            onRegisterSuccess={handleRegisterSuccess}
          />
        </div>
      </div>
    )
  }

  // -------------------------
  // MAIN UI
  // -------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">

        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-8 text-center rounded-t-xl shadow-lg">
          <h1 className="text-2xl font-bold mb-2">{t('appTitle')}</h1>
          <p className="text-green-100">{t('appSubtitle')}</p>

          <select
            value={currentLanguage}
            onChange={(e) => changeLanguage(e.target.value)}
            className="mt-3 bg-green-800 text-white px-3 py-1 rounded text-sm border border-green-600"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="bn">বাংলা</option>
            <option value="te">తెలుగు</option>
          </select>
        </div>

        <div className="bg-white p-8 rounded-b-xl shadow-lg">

          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 px-4 rounded-md ${
                activeTab === 'login'
                  ? 'bg-white text-green-600 shadow'
                  : 'text-gray-600'
              }`}
            >
              {t('login')}
            </button>

            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2 px-4 rounded-md ${
                activeTab === 'register'
                  ? 'bg-white text-green-600 shadow'
                  : 'text-gray-600'
              }`}
            >
              {t('register')}
            </button>
          </div>

          {activeTab === 'login' && (
            <TwilioOTP onLoginSuccess={handleLoginSuccess} />
          )}

          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">

              <input
                type="text"
                placeholder="Name"
                value={registerData.name}
                onChange={(e) =>
                  setRegisterData({ ...registerData, name: e.target.value })
                }
                className="input-field"
                required
              />

              <input
                type="tel"
                placeholder="Phone"
                value={registerData.phone}
                onChange={(e) =>
                  setRegisterData({ ...registerData, phone: e.target.value })
                }
                className="input-field"
                required
              />

              <button type="submit" className="btn-primary w-full py-3">
                Register with OTP
              </button>

            </form>
          )}
        </div>

        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Made for Indian Farmers 🌾</p>
        </div>
      </div>
    </div>
  )
}