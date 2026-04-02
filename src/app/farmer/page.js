'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import FarmerAuth from '@/components/farmer/FarmerAuth'
import FarmerDashboard from '@/components/farmer/FarmerDashboard'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'

export default function FarmerPage() {
  const { user, loading, logout } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    console.log('FarmerPage: Render - User:', user, 'Loading:', loading)
  }, [user, loading])

  // 🛑 Wait until auth is fully resolved
  if (loading || user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading') || 'Loading...'}</p>
        </div>
      </div>
    )
  }

  // ❌ Strict check (handles {}, null, broken user)
  if (!user || !user.userType) {
    console.log('FarmerPage: No valid user found, showing auth')
    return <FarmerAuth />
  }

  // ❌ Wrong role
  if (user.userType !== 'farmer') {
    console.log('FarmerPage: User is not a farmer, showing access denied')
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            This area is only for farmers. You are logged in as a buyer.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/buyer')}
              className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Buyer Dashboard
            </button>
            <button
              onClick={() => {
                logout()
                router.push('/farmer')
              }}
              className="w-full bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Logout and Login as Farmer
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ✅ Only real farmer allowed
  console.log('FarmerPage: Showing farmer dashboard')
  return <FarmerDashboard />
}