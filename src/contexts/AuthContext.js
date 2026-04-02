'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(null)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      console.log('AuthContext: Server-side rendering, skipping auth check')
      setLoading(false)
      return
    }

    console.log('AuthContext: Starting client-side auth check')
    
    const checkAuth = () => {
      try {
        const savedToken = localStorage.getItem('authToken')
        const savedUser = localStorage.getItem('currentUser')

        console.log('AuthContext: Found saved token:', !!savedToken)
        console.log('AuthContext: Found saved user:', !!savedUser)

        if (savedToken && savedUser) {
          const userData = JSON.parse(savedUser)
          console.log('AuthContext: Parsed user data:', userData)
          setUser(userData)
          setToken(savedToken)
        } else {
          console.log('AuthContext: No saved auth data found')
        }
      } catch (error) {
        console.error('AuthContext: Error checking saved auth data:', error)
        try {
          localStorage.removeItem('authToken')
          localStorage.removeItem('currentUser')
        } catch (clearError) {
          console.error('AuthContext: Error clearing localStorage:', clearError)
        }
      }
      
      console.log('AuthContext: Setting loading to false')
      setLoading(false)
    }

    const timer = setTimeout(checkAuth, 100)
    return () => clearTimeout(timer)
  }, [])

  const login = async (userData, authToken) => {
    console.log('AuthContext: Logging in user:', userData)
    try {
      setUser(userData)
      setToken(authToken)
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', authToken)
        localStorage.setItem('currentUser', JSON.stringify(userData))
      }
      console.log('AuthContext: Login successful')
    } catch (error) {
      console.error('AuthContext: Error saving auth data:', error)
      throw new Error('Failed to save authentication data')
    }
  }

  const logout = () => {
    console.log('AuthContext: Logging out user')
    try {
      setUser(null)
      setToken(null)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken')
        localStorage.removeItem('currentUser')
      }
    } catch (error) {
      console.error('AuthContext: Error clearing auth data:', error)
    }
  }

  const updateUser = (userData) => {
    console.log('AuthContext: Updating user data:', userData)
    try {
      setUser(userData)
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(userData))
      }
    } catch (error) {
      console.error('AuthContext: Error updating user data:', error)
    }
  }

  const value = {
    user,
    loading,
    token,
    login,
    logout,
    updateUser
  }

  console.log('AuthContext: Current state - User:', user, 'Loading:', loading, 'Token:', !!token)

  return (
    <AuthContext.Provider value={value}>
      {children} {/* ✅ FIXED: NO UI LOGIC HERE */}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}