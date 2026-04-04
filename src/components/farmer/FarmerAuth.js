'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { showNotification } from '@/utils/notifications'
import TwilioOTP from '@/components/TwilioOTP'

export default function FarmerAuth() {
  const [activeTab, setActiveTab] = useState('login')
  const [showOTP, setShowOTP] = useState(false)

  const { login } = useAuth()
  const { t, currentLanguage, changeLanguage } = useLanguage()

  // -------------------------
  // REGISTER FORM STATE
  // -------------------------
  const [registerData, setRegisterData] = useState({
    name: '',
    phone: '',
    email: '',
    state: '',
    district: '',
    village: '',
    pincode: ''
  })

  // -------------------------
  // LOGIN SUCCESS
  // -------------------------
  const handleLoginSuccess = (result) => {
    console.log('🔍 FarmerAuth: handleLoginSuccess called with:', result)
    console.log('🔍 FarmerAuth: About to call login() with:', result.user)
    
    try {
      login(result.user, result.token)
      showNotification(t('success'), 'success')
      
      console.log('🔍 FarmerAuth: Login called, now redirecting to dashboard...')
      
      // Redirect to dashboard using Next.js router with delay
      setTimeout(() => {
        console.log('🔍 FarmerAuth: Redirecting to /farmer/dashboard')
        router.push('/farmer/dashboard').catch(err => {
          console.error('❌ Router push error:', err)
          // Fallback: use window.location
          window.location.href = '/farmer/dashboard'
        })
      }, 100)
    } catch (error) {
      console.error('❌ FarmerAuth: Error during login success:', error)
      showNotification('Login successful but redirect failed. Please go to dashboard manually.', 'error')
    }
  }

  // -------------------------
  // REGISTER CLICK → SHOW OTP SCREEN
  // -------------------------
  const handleRegister = async (e) => {
  e.preventDefault();

  if (!registerData.name || !registerData.phone) {
    showNotification('Name and Phone are required', 'error');
    return;
  }

  const phone = registerData.phone.startsWith('+91')
    ? registerData.phone
    : `+91${registerData.phone}`;

  const res = await fetch('/api/twilio/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone })
  });
  const data = await res.json();
  if (res.ok) {
    setShowOTP(true);
    showNotification('OTP sent successfully', 'success');
  } else {
    showNotification(data.error || 'Failed to send OTP', 'error');
  }
};

  // -------------------------
  // REGISTER SUCCESS AFTER OTP
  // -------------------------
  const handleRegisterSuccess = (result) => {
    console.log('🔍 FarmerAuth: handleRegisterSuccess called with:', result)
    
    if (!result?.user || !result?.token) {
      showNotification('Registration failed', 'error')
      return
    }

    try {
      console.log('🔍 FarmerAuth: About to call login() with:', result.user)
      login(result.user, result.token)
      showNotification(t('success'), 'success')
      
      console.log('🔍 FarmerAuth: Registration login called, now redirecting to dashboard...')
      
      // Redirect to dashboard using Next.js router with delay
      setTimeout(() => {
        console.log('🔍 FarmerAuth: Redirecting to /farmer/dashboard')
        router.push('/farmer/dashboard').catch(err => {
          console.error('❌ Router push error:', err)
          // Fallback: use window.location
          window.location.href = '/farmer/dashboard'
        })
      }, 100)
    } catch (error) {
      console.error('❌ FarmerAuth: Error during register success:', error)
      showNotification('Registration successful but redirect failed. Please go to dashboard manually.', 'error')
    }
  }
  if (showOTP && !registerData.phone) {
  setShowOTP(false);
}
  // -------------------------
  // OTP SCREEN
  // -------------------------
  if (showOTP) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">

          {/* Header */}
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

        {/* HEADER */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-8 text-center rounded-t-xl shadow-lg">
          <h1 className="text-2xl font-bold mb-2">{t('appTitle')}</h1>
          <p className="text-green-100">{t('appSubtitle')}</p>

          {/* LANGUAGE SWITCH */}
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

        {/* AUTH BOX */}
        <div className="bg-white p-8 rounded-b-xl shadow-lg">

          {/* TABS */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 px-4 rounded-md font-medium ${
                activeTab === 'login'
                  ? 'bg-white text-green-600 shadow'
                  : 'text-gray-600'
              }`}
            >
              {t('login')}
            </button>

            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2 px-4 rounded-md font-medium ${
                activeTab === 'register'
                  ? 'bg-white text-green-600 shadow'
                  : 'text-gray-600'
              }`}
            >
              {t('register')}
            </button>
          </div>

          {/* LOGIN */}
          {activeTab === 'login' && (
            <TwilioOTP onLoginSuccess={handleLoginSuccess} />
          )}

          {/* REGISTER FORM */}
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

              <input
                type="email"
                placeholder="Email (optional)"
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({ ...registerData, email: e.target.value })
                }
                className="input-field"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="State"
                  value={registerData.state}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, state: e.target.value })
                  }
                  className="input-field"
                />

                <input
                  placeholder="District"
                  value={registerData.district}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, district: e.target.value })
                  }
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Village"
                  value={registerData.village}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, village: e.target.value })
                  }
                  className="input-field"
                />

                <input
                  placeholder="Pincode"
                  value={registerData.pincode}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, pincode: e.target.value })
                  }
                  className="input-field"
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-3"
              >
                Register with OTP
              </button>
            </form>
          )}
        </div>

        {/* FOOTER */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Made for Indian Farmers 🌾</p>
        </div>
      </div>
    </div>
  )
}