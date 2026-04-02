'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'

export default function AuthDebug() {
  const { user, loading, token } = useAuth()
  const [isClient, setIsClient] = useState(false)
  const [lsToken, setLsToken] = useState(null)
  const [lsUser, setLsUser] = useState(null)

  useEffect(() => {
    setIsClient(true)

    setLsToken(localStorage.getItem('authToken'))
    setLsUser(localStorage.getItem('currentUser'))

    console.log('=== AUTH DEBUG INFO ===')
    console.log('User:', user)
    console.log('Loading:', loading)
    console.log('Token:', token ? 'Present' : 'Missing')
    if (typeof window !== 'undefined') {
      console.log('LocalStorage Token:', localStorage.getItem('authToken'))
      console.log('LocalStorage User:', localStorage.getItem('currentUser'))
    }
    console.log('====================')
  }, [user, loading, token])

  if (!isClient || process.env.NODE_ENV === 'production') {
    return null
  }

  const getLocalStorageItem = (key) => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key)
    }
    return null
  }

  return (
    <div className="fixed top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded-lg text-xs z-50 max-w-xs">
      <div className="font-bold mb-2">Auth Debug:</div>
      <div>Status: {loading ? 'Loading...' : (user ? `Logged in as ${user.userType}` : 'Not logged in')}</div>
      <div>User ID: {user?._id || 'None'}</div>
      <div>User Type: {user?.userType || 'None'}</div>
      <div>Token: {token ? 'Present' : 'Missing'}</div>
      <div>LS Token: {lsToken ? 'Present' : 'Missing'}</div>
      <div>LS User: {lsUser ? 'Present' : 'Missing'}</div>
      <div>Client: {isClient ? 'Yes' : 'No'}</div>
    </div>
  )
}
