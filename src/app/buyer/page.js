'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BuyerAuth from '@/components/buyer/BuyerAuth'
import BuyerDashboard from '@/components/buyer/BuyerDashboard'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'

export default function BuyerPage() {
  const { user, loading, logout } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    console.log('BuyerPage: Render - User:', user, 'Loading:', loading)
  }, [user, loading])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading') || 'Loading...'}</p>
        </div>
      </div>
    )
  }

  // Check if user is logged in
  if (!user) {
    console.log('BuyerPage: No user found, showing auth')
    return <BuyerAuth />
  }

  // Check if user is a buyer
  if (user.userType !== 'buyer') {
    console.log('BuyerPage: User is not a buyer, showing access denied')
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">This area is only for buyers. You are logged in as a farmer.</p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/farmer')}
              className="w-full bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Go to Farmer Dashboard
            </button>
            <button
              onClick={() => {
                logout()
                router.push('/buyer')
              }}
              className="w-full bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Logout and Login as Buyer
            </button>
          </div>
        </div>
      </div>
    )
  }

  console.log('BuyerPage: Showing buyer dashboard')
  return <BuyerDashboard />
}
