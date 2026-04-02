'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { showNotification } from '@/utils/notifications'
import CreatableSelect from 'react-select/creatable'

export default function MyListingsTab({ listings, products, onListingUpdate }) {
  // console.log('MyListingsTab received listings:', listings)
  const [showAddForm, setShowAddForm] = useState(false)
  // const [loading, setLoading] = useState(false)
  const[submitting, setSubmitting] = useState(false)
  const { token, user } = useAuth()
  const { t } = useLanguage()

  // Form state for new listing
  const [formData, setFormData] = useState({
    productId: '',
    productName: '',
    quantityAvailable: '',
    askingPrice: '',
    qualityGrade: '',
    qualityDescription: '',
    harvestDate: '',
    location: user?.location || ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch('/api/farmer-listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(
          {
            ...formData,
            quantityAvailable: Number(formData.quantityAvailable),
            askingPrice: Number(formData.askingPrice)
          }
        )
      })

      if (response.ok) {
        showNotification(t('listingUpdated'), 'success')
        setShowAddForm(false)
        setFormData({
          productId: '',
          productName: '',
          quantityAvailable: '',
          askingPrice: '',
          qualityGrade: '',
          qualityDescription: '',
          harvestDate: '',
          location: user?.location || ''
        })

        if (onListingUpdate) {
          onListingUpdate()
        }
      } else {
        const error = await response.json()
        showNotification(error.error || t('error'), 'error')
      }
    } catch (error) {
      console.error('Failed to create listing:', error)
      showNotification(t('error'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      available: 'status-active',
      sold: 'status-closed',
      expired: 'status-closed'
    }
    return statusClasses[status] || 'status-pending'
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">My Listings</h2>
        <p className="text-gray-600">Manage your product listings and track their status</p>
      </div>

      {/* Add New Listing Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary py-2 px-6"
        >
          {showAddForm ? t('cancel') : t('addListing')}
        </button>
      </div>

      {/* Add Listing Form */}
      {showAddForm && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-4">{t('addListingTitle')}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Product
                  </label>

                  <CreatableSelect
                    options={products.map((p) => ({
                      value: p._id,
                      label: p.name,
                      unit: p.unit,
                    }))}

                    value={
                      formData.productId
                        ? {
                          value: formData.productId,
                          label: formData.productName
                        }
                        : formData.productName
                          ? { label: formData.productName, value: formData.productName }
                          : null
                    }

                    onChange={(selected) => {
                      if (!selected) {
                        setFormData({
                          ...formData,
                          productId: '',
                          productName: ''
                        })
                        return 
                      } 
                      if (selected.__isNew__) {
                        // 🆕 New product typed
                        setFormData({
                          ...formData,
                          productId: '',
                          productName: selected.label
                        })
                      } else {
                        // ✅ Existing product selected
                        setFormData({
                          ...formData,
                          productId: selected.value,
                          productName: selected.label
                        })
                      }
                    }}

                    placeholder="Select or type product..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('location')}
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="input-field"
                  placeholder="Your village/location"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('quantity')}
                </label>
                <input
                  type="number"
                  value={formData.quantityAvailable}
                  onChange={(e) => setFormData({ ...formData, quantityAvailable: e.target.value })}
                  className="input-field"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('price')} (₹)
                </label>
                <input
                  type="number"
                  value={formData.askingPrice}
                  onChange={(e) => setFormData({ ...formData, askingPrice: e.target.value })}
                  className="input-field"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('harvestDate')}
                </label>
                <input
                  type="date"
                  value={formData.harvestDate}
                  onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quality Grade
                </label>
                <select className="input-field"
                 value = {formData.qualityGrade}
                 onChange={(e) => setFormData({ ...formData, qualityGrade: e.target.value })}
                >
                  <option value="">Select quality</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="average">Average</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('quality')}
              </label>
              <textarea
                value={formData.qualityDescription}
                onChange={(e) => setFormData({ ...formData, qualityDescription: e.target.value })}
                className="input-field"
                rows="3"
                placeholder="Describe the quality of your product..."
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="btn-outline px-6 py-2"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary px-6 py-2 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : t('Submit Listing')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* My Listings */}
      {!showAddForm && (
      <div>

        {!listings || listings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🌾</div>
            <p className="text-gray-600">You haven't created any listings yet.</p>
            <p className="text-sm text-gray-500 mt-2">Click "Add New Listing" to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div key={listing._id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-green-600">
                      {listing.productId?.name}
                    </h3>
                    <span className={`status-badge ${getStatusBadge(listing.status)}`}>
                      {listing.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">
                      ₹{listing.askingPrice}
                    </div>
                    <div className="text-xs text-gray-500">per unit</div>
                  </div>
                </div>
  
                <div className="mb-4 space-y-2">
                  <div className="text-sm text-gray-600">
                    <strong>Available:</strong> {listing.quantityAvailable}
                  </div>
                  {listing.qualityDescription && (
                    <div className="text-sm text-gray-600">
                      <strong>Quality:</strong> {listing.qualityDescription}
                    </div>
                  )}
                  {listing.location && (
                    <div className="text-sm text-gray-600">
                      <strong>Location:</strong> {listing.location}
                    </div>
                  )}
                  {listing.harvestDate && (
                    <div className="text-sm text-gray-600">
                      <strong>Harvest Date:</strong> {new Date(listing.harvestDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
  
                <div className="flex gap-2">
                  <button className="btn-outline flex-1 text-sm py-2">
                    {t('edit')}
                  </button>
                  <button className="btn-outline flex-1 text-sm py-2 text-red-600 border-red-300 hover:bg-red-50">
                    {t('delete')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      )}
    </div>
  )
}
