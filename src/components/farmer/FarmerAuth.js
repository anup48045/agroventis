'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { showNotification } from '@/utils/notifications'

export default function FarmerAuth() {
  const [activeTab, setActiveTab] = useState('login')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { t, currentLanguage, changeLanguage } = useLanguage()

  // Login form state
  const [loginData, setLoginData] = useState({
    phone: '',
    password: ''
  })

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    state: '',
    district: '',
    village: '',
    pincode: ''
  })

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    console.log('FarmerAuth: Attempting login with:', loginData)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      })

      console.log('FarmerAuth: Response status:', response.status)
      
      const result = await response.json()
      console.log('FarmerAuth: Response data:', result)

      if (response.ok) {
        console.log('FarmerAuth: Login successful, calling login() with:', result.user)
        login(result.user, result.token)
        showNotification(t('success'), 'success')
      } else {
        console.log('FarmerAuth: Login failed:', result.error)
        showNotification(result.error || t('error'), 'error')
      }
    } catch (error) {
      console.error('Login error:', error)
      showNotification(t('error'), 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)

    console.log('FarmerAuth: Attempting registration with:', { ...registerData, password: '[HIDDEN]' })

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...registerData,
          userType: 'farmer',
          languagePreference: currentLanguage
        })
      })

      console.log('FarmerAuth: Registration response status:', response.status)
      
      const result = await response.json()
      console.log('FarmerAuth: Registration response data:', result)

      if (response.ok) {
        console.log('FarmerAuth: Registration successful, calling login() with:', result.user)
        login(result.user, result.token)
        showNotification(t('success'), 'success')
      } else {
        console.log('FarmerAuth: Registration failed:', result.error)
        showNotification(result.error || t('error'), 'error')
      }
    } catch (error) {
      console.error('Registration error:', error)
      showNotification(t('error'), 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-8 text-center rounded-t-xl shadow-lg">
          <h1 className="text-2xl font-bold mb-2">{t('appTitle')}</h1>
          <p className="text-green-100">{t('appSubtitle')}</p>
          
          {/* Language Selector */}
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

        {/* Auth Content */}
        <div className="bg-white p-8 rounded-b-xl shadow-lg">
          {/* Tab Navigation */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === 'login'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {t('login')}
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === 'register'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {t('register')}
            </button>
          </div>

          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('phone')}
                </label>
                <input
                  type="tel"
                  value={loginData.phone}
                  onChange={(e) => setLoginData({ ...loginData, phone: e.target.value })}
                  className="input-field"
                  placeholder="9876543210"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('password')}
                </label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="input-field"
                  required
                />
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
                  t('loginBtn')
                )}
              </button>
            </form>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('password')}
                </label>
                <input
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  className="input-field"
                  required
                  minLength="6"
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
                    {t('village')}
                  </label>
                  <input
                    type="text"
                    value={registerData.village}
                    onChange={(e) => setRegisterData({ ...registerData, village: e.target.value })}
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
                  t('registerBtn')
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer Info */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>🌱 {t('appSubtitle')}</p>
          <p className="mt-2 text-xs">Made for Indian farmers</p>
        </div>
      </div>
    </div>
  )
}
