'use client'
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { showNotification } from '@/utils/notifications'
import MarketplaceTab from '@/components/farmer/tabs/MarketplaceTab'
import MyListingsTab from '@/components/farmer/tabs/MyListingsTab'
import ConnectionsTab from '@/components/farmer/tabs/ConnectionsTab'
import ProfileTab from '@/components/farmer/tabs/ProfileTab'
import { getSocket } from '@/lib/socketClient'

export default function FarmerDashboard() {
  const [activeTab, setActiveTab] = useState('marketplace')
  const [buyerListings, setBuyerListings] = useState([])
  const [myListings, setMyListings] = useState([])
  const [connections, setConnections] = useState([])
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, token, logout, updateUser } = useAuth()
  const { t, currentLanguage, changeLanguage } = useLanguage()

  useEffect(() => {
    if (user && token) {
      loadData()
    }
  }, [user, token])
  
  useEffect(() => {
  const socket = getSocket();

  socket.emit("join", user._id);

  return () => {
    socket.disconnect();
  };
}, [user]);

  const router = useRouter()

  async function loadMyListings() {
    try {
      const res = await fetch('/api/farmer-listings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` // 👈 IMPORTANT
        }
      })
      if (res.ok) {
        const data = await res.json()
        setMyListings(data)
        console.log('My Listings:', data)
      }
      else {
        console.log('Unauthorized request')
      }

    } catch (error) {
      console.error('Failed to load my listings:', error)

    }

  }

  const loadData = async () => {
    try {
      setLoading(true)
      // Load buyer listings
      await loadBuyerListings()

      // Load farmer's own listings
      await loadMyListings()
      
      // Load connections
      await loadConnections();
      
      // Load products and categories
      const productsResponse = await fetch('/api/products', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (productsResponse.ok) {
        const data = await productsResponse.json()
        setProducts(data.products || [])
        setCategories(data.categories || [])
      }

    } catch (error) {
      console.error('Failed to load data:', error)
      showNotification(t('error'), 'error')
    } finally {
      setLoading(false)
    }
  }

  async function loadConnections() {
      try {
        const res = await fetch('/api/connections', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setConnections(data);
          console.log('Connections:', data);
        } else {
          console.log('Failed to load connections');
        }
      } catch (error) {
        console.error('Error loading connections:', error);
      }
  }

  const loadBuyerListings = async () => {
    try {
      const response = await fetch('/api/buyer-listings', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setBuyerListings(data)
        console.log('Buyer Listings:', data)
      }
      else {
        console.log('Unauthorized request')
      }

    } catch (error) {
      console.error('Failed to load buyer listings:', error)
    }
  }

  const handleLogout = () => {
    logout()
    showNotification('Logged out successfully', 'success')
  }

  const tabs = [
    { id: 'marketplace', label: t('marketplace'), icon: '🏪' },
    { id: 'myListings', label: t('myListings'), icon: '🌾' },
    { id: 'connections', label: t('connections'), icon: '🤝' },
    { id: 'profile', label: t('profile'), icon: '👤' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-[#D96C2D]">🌾 Agroventis - Farmer Platform</h1>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={currentLanguage}
                onChange={(e) => changeLanguage(e.target.value)}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm border border-gray-300"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="bn">বাংলা</option>
                <option value="te">తెలుగు</option>
              </select>
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'marketplace' && (
          <MarketplaceTab
            listings={buyerListings}
            products={products}
            categories={categories}
            myListings={myListings}
            onListingUpdate={loadBuyerListings}
          />
        )}

        {activeTab === 'myListings' && (
          <MyListingsTab
            listings={myListings}
            products={products}
            onListingUpdate={() => {
              // Refresh my listings
              loadMyListings()
            }}
          />
        )}

        {activeTab === 'connections' && (
          <ConnectionsTab
            connections={connections}
            onConnectionUpdate={() => {
              // Refresh connections
              loadConnections()
            }}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileTab user={user} onUserUpdate={updateUser} />
        )}
      </main>
    </div>
  )
}

// Helper functions to load data (to be implemented)