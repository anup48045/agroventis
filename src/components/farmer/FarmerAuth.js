'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { showNotification } from '@/utils/notifications'

export default function FarmerAuth() {
  const router = useRouter()
  const { login } = useAuth()
  const { t, currentLanguage, changeLanguage } = useLanguage()

  const [activeTab, setActiveTab] = useState('login')
  const [loading, setLoading] = useState(false)

  // Login form data
  const [loginData, setLoginData] = useState({
    phone: '',
    password: ''
  })

  // Register form data
  const [registerData, setRegisterData] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    email: '',
    state: '',
    district: '',
    village: '',
    pincode: ''
  })

  // -------------------------
  // LOGIN
  // -------------------------
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!loginData.phone || !loginData.password) {
      showNotification('Phone and password are required', 'error')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: loginData.phone,
          password: loginData.password,
          userType: 'farmer'
        })
      })

      const data = await res.json()

      if (res.ok && data.success) {
        login(data.user, data.token)
        showNotification('Login successful', 'success')
        
        setTimeout(() => {
          router.replace('/farmer')
        }, 100)
      } else {
        showNotification(data.error || 'Login failed', 'error')
      }
    } catch (error) {
      console.error('Login error:', error)
      showNotification('Network error', 'error')
    } finally {
      setLoading(false)
    }
  }

  // -------------------------
  // REGISTER
  // -------------------------
  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!registerData.name || !registerData.phone || !registerData.password) {
      showNotification('Name, phone, and password are required', 'error')
      setLoading(false)
      return
    }

    if (registerData.password !== registerData.confirmPassword) {
      showNotification('Passwords do not match', 'error')
      setLoading(false)
      return
    }

    if (registerData.password.length < 6) {
      showNotification('Password must be at least 6 characters', 'error')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...registerData,
          userType: 'farmer',
          languagePreference: currentLanguage
        })
      })

      const data = await res.json()

      if (res.ok && data.success) {
        login(data.user, data.token)
        showNotification('Registration successful', 'success')
        
        setTimeout(() => {
          router.replace('/farmer/dashboard')
        }, 100)
      } else {
        showNotification(data.error || 'Registration failed', 'error')
      }
    } catch (error) {
      console.error('Registration error:', error)
      showNotification('Network error', 'error')
    } finally {
      setLoading(false)
    }
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
            <option value="hi"> </option>
            <option value="bn"> </option>
            <option value="te"> </option>
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
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="tel"
                placeholder="Mobile Number"
                value={loginData.phone}
                onChange={(e) =>
                  setLoginData({ ...loginData, phone: e.target.value })
                }
                className="input-field"
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                className="input-field"
                required
              />

              <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
                {loading ? 'Logging in...' : t('login')}
              </button>
            </form>
          )}

          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={registerData.name}
                onChange={(e) =>
                  setRegisterData({ ...registerData, name: e.target.value })
                }
                className="input-field"
                required
              />

              <input
                type="tel"
                placeholder="Mobile Number"
                value={registerData.phone}
                onChange={(e) =>
                  setRegisterData({ ...registerData, phone: e.target.value })
                }
                className="input-field"
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
                className="input-field"
                required
                minLength={6}
              />

              <input
                type="password"
                placeholder="Confirm Password"
                value={registerData.confirmPassword}
                onChange={(e) =>
                  setRegisterData({ ...registerData, confirmPassword: e.target.value })
                }
                className="input-field"
                required
                minLength={6}
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

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="State"
                  value={registerData.state}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, state: e.target.value })
                  }
                  className="input-field"
                />

                <input
                  type="text"
                  placeholder="District"
                  value={registerData.district}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, district: e.target.value })
                  }
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Village"
                  value={registerData.village}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, village: e.target.value })
                  }
                  className="input-field"
                />

                <input
                  type="text"
                  placeholder="Pincode"
                  value={registerData.pincode}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, pincode: e.target.value })
                  }
                  className="input-field"
                />
              </div>

              <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>
          )}
        </div>

        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Made for Indian Farmers </p>
        </div>
      </div>
    </div>
  )
}