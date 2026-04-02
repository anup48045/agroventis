'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { showNotification } from '@/utils/notifications'

export default function MarketplaceTab({ listings, products, categories, myListings, onListingUpdate }) {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const { token } = useAuth()
  const { t } = useLanguage()

  const filteredListings = selectedCategory
    ? listings.filter((listing) => listing.productId?.category === selectedCategory)
    : listings

  const handleConnectWithBuyer = async (buyerListingId) => {
    setLoading(true)

    try {
      // For now, show a notification - in real app, this would create a connection
      const res = await fetch('/api/connections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          buyerListingId,
          farmerListingId: myListings[0]?._id 
        })
      })
       const data = await res.json()
      if (res.ok) {
        showNotification('Connection request sent!', 'success')
        onListingUpdate && onListingUpdate() // Refresh listings after connecting
      }
      else{
        showNotification('Failed to send connection request', data.error || 'error')
      }
     
    } catch (error) {
      console.error('Failed to connect:', error)
      showNotification('Failed to send connection request', 'error')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: 'status-active',
      pending: 'status-pending',
      closed: 'status-closed'
    }
    return statusClasses[status] || 'status-pending'
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Buyer Marketplace</h2>
        <p className="text-gray-600">Browse buyer requirements and connect with potential customers</p>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('filterByCategory')}
        </label>
        <div className="max-w-xs">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field"
          >
            <option value="">{t('allCategories')}</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      ) : !filteredListings || filteredListings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-gray-600">{t('noListingsFound')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <div key={listing._id} className="card">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-green-600">
                    {listing.productId?.name || listing.productName}
                  </h3>
                  <span className={`status-badge ${getStatusBadge(listing.status)}`}>
                    {listing.status}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">
                    ₹{listing.maxPrice}
                  </div>
                  <div className="text-xs text-gray-500">per unit</div>
                </div>
              </div>

              {/* Requirements */}
              <div className="mb-4 space-y-2">
                <div className="text-sm text-gray-600">
                  <strong>Quantity Required:</strong> {listing.quantityRequired}
                </div>
                {listing.qualityRequirements && (
                  <div className="text-sm text-gray-600">
                    <strong>Quality:</strong> {listing.qualityRequirements}
                  </div>
                )}
                {listing.deliveryLocation && (
                  <div className="text-sm text-gray-600">
                    <strong>Delivery:</strong> {listing.deliveryLocation}
                  </div>
                )}
                {listing.deliveryDate && (
                  <div className="text-sm text-gray-600">
                    <strong>Date:</strong> {new Date(listing.deliveryDate).toLocaleDateString()}
                  </div>
                )}
              </div>

              {/* Buyer Info */}
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <div className="text-sm">
                  <div className="font-medium text-gray-700 mb-2">Buyer Information</div>
                  <div className="text-gray-600">
                    <div className="font-medium">{listing.buyerId?.name}</div>
                    {/* <div className="text-xs">{listing.buyerId?.location}</div> */}
                    <div className="text-xs">📞 {listing.buyerId?.phone}</div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleConnectWithBuyer(listing._id)}
                disabled={loading}
                className="btn-primary w-full py-2 disabled:opacity-50"
              >
                {loading ? t('loading') : 'Connect with Buyer'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
