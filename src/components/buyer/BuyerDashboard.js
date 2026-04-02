'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { showNotification } from '@/utils/notifications'
import FarmerMarketplaceTab from '@/components/buyer/tabs/FarmerMarketplaceTab'
import MyRequirementsTab from '@/components/buyer/tabs/MyRequirementsTab'
import ConnectionsTab from '@/components/buyer/tabs/ConnectionsTab'
import ProfileTab from '@/components/buyer/tabs/ProfileTab' 
import { getSocket } from '@/lib/socketClient'

export default function BuyerDashboard() {
  const [activeTab, setActiveTab] = useState('marketplace')
  const [myListings, setMyListings] = useState([])
  const [farmerListings, setFarmerListings] = useState([])
   const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [connections, setConnections] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, token, logout } = useAuth()
  const { t, currentLanguage, changeLanguage } = useLanguage()

  useEffect(() => {
    if(token){
      loadData()
    }
  }, [token])
  useEffect(() => {
  const socket = getSocket();

  socket.emit("join", user._id);

  return () => {
    socket.disconnect();
  };
}, [user]);
useEffect(() => {
  const socket = getSocket();

  socket.on("new_connection", (data) => {
    showNotification(data.message, "info");

    // refresh connections
    loadConnections();
  });

  return () => socket.off("new_connection");
}, []);

  const loadConnections = async () => {
  try {
    const res = await fetch('/api/connections', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (res.ok) {
      const data = await res.json()
      setConnections(data)
    }

  } catch (error) {
    console.error('Failed to load connections:', error)
  }
}

 const loadBuyerListings = async () => {
  try {
    const res = await fetch('/api/buyer-listings', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (res.ok) {
      const data = await res.json()
      setMyListings(data)
    }
  } catch (err) {
    console.error(err)
  }
}
  const loadData = async () => {
    try {
      setLoading(true)
      // Load Buyer and farmer listings
      await loadBuyerListings();
      await loadFarmerListings()
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

  const loadFarmerListings = async () => {
    try {
      const response = await fetch('/api/farmer-listings', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
     
      if (response.ok) {
        const data = await response.json()
        console.log('Fetched Farmer Listings:', data)
        setFarmerListings(data)
      }
    } catch (error) {
      console.error('Failed to load farmer listings:', error)
    }
  }

  const handleLogout = () => {
    logout()
    showNotification('Logged out successfully', 'success')
  }

  const tabs = [
    { id: 'marketplace', label: 'Farmer Marketplace', icon: '🌾' },
    { id: 'myListings', label: 'My Requirements', icon: '📋' },
    { id: 'connections', label: 'Connections', icon: '🤝' },
    { id: 'profile', label: 'Profile', icon: '👤' }
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
              <h1 className="text-xl font-bold text-blue-600">🏢 Agroventis - Buyer Platform</h1>
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
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
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
          <FarmerMarketplaceTab 
          farmerListings={farmerListings} 
          categories={categories}
          products={products}
          onListingUpdate={loadFarmerListings}
          />
          
        )}

        {activeTab === 'myListings' && (
          <MyRequirementsTab onSuccess={loadBuyerListings} myListings={myListings} />
        
        )}

        {activeTab === 'connections' && (
        <ConnectionsTab 
        connections={connections}
        onConnectionUpdate={loadConnections}
        />
       
        )}

        {activeTab === 'profile' && (
          <ProfileTab user={user} />
          
        )}
      </main>
    </div>
  )
}
