'use client'

import CreatableSelect from 'react-select/creatable'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'

const MyRequirementsTab = ({ onSuccess, myListings = [] }) => {
  const { token } = useAuth()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const { t } = useLanguage()

  const [form, setForm] = useState({
    productId: '',
    productName: '',
    quantityRequired: '',
    maxPrice: '',
    deliveryDate: '',
    qualityRequirements: '',
    deliveryLocation: ''
  })

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data.products || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.productId && !form.productName) {
      alert('Please select or enter a product')
      return
    }

    try {
      setSubmitting(true)

      const res = await fetch('/api/buyer-listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          quantityRequired: Number(form.quantityRequired),
          maxPrice: Number(form.maxPrice)
        })
      })

      const data = await res.json()

      if (res.ok) {
        alert('Requirement posted successfully!')
        setForm({
          productId: '',
          productName: '',
          quantityRequired: '',
          maxPrice: '',
          deliveryDate: '',
          qualityRequirements: '',
          deliveryLocation: ''
        })
        onSuccess && onSuccess() // refresh list
      } else {
        alert('Failed to post requirement')
      }
    } catch (err) {
      console.error(err)
      alert('Something went wrong')
    }
    finally {
      setSubmitting(false)
    }
  }
  const getStatusBadge = (status) => {
    const statusClasses = {
      active: 'status-active',
      pending: 'status-pending',
      closed: 'status-closed',
      expired: 'status-expired',
    }
    return statusClasses[status] || 'status-pending'
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">My Requirements</h2>
        <p className="text-gray-600">Manage your product requirements and track their status</p>
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
      {showAddForm && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-4">Post New Requirement</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Product
              </label>

              <CreatableSelect
                isLoading={loading}
                isDisabled={loading}
                options={products.map((p) => ({
                  value: p._id,
                  label: p.name,
                  unit: p.unit,
                }))}

                value={
                  form.productId
                    ? {
                      value: form.productId,
                      label: form.productName
                    }
                    : form.productName
                      ? { label: form.productName, value: form.productName }
                      : null
                }

                onChange={(selected) => {
                  if (selected.__isNew__) {
                    // 🆕 New product typed
                    setForm({
                      ...form,
                      productId: '',
                      productName: selected.label
                    })
                  } else {
                    // ✅ Existing product selected
                    setForm({
                      ...form,
                      productId: selected.value,
                      productName: selected.label
                    })
                  }
                }}

                placeholder="Select or type product..."
              />
            </div>

            {/* Quantity and Max Price */}
            <input
              type="number"
              name="quantityRequired"
              value={form.quantityRequired}
              onChange={handleChange}
              placeholder="Quantity"
              className="input-field"
              required
            />
          </div>
          {/* Max Price and Delivery Date */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="maxPrice"
              value={form.maxPrice}
              onChange={handleChange}
              placeholder="Max Price"
              className="input-field"
              required
            />

            <input
              type="date"
              name="deliveryDate"
              value={form.deliveryDate}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <textarea
            name="qualityRequirements"
            value={form.qualityRequirements}
            onChange={handleChange}
            placeholder="Quality requirements"
            className="input-field"
          />

          <input
            type="text"
            name="deliveryLocation"
            value={form.deliveryLocation}
            onChange={handleChange}
            placeholder="Delivery location"
            className="input-field"
          />

          <button type="submit" disabled={submitting} className="btn-secondary px-6 py-2">
            {submitting ? 'Posting...' : 'Post Requirement'}
          </button>
        </form>

      </div>)}
      {!(submitting || showAddForm) && (
        <div>
          <h3 className="text-lg font-semibold mb-4">My Requirements</h3>

        {myListings.length === 0 ? (
          <p>No requirements yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myListings.map((listing) => (
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
                      ₹{listing.maxPrice}
                    </div>
                    <div className="text-xs text-gray-500">per unit</div>
                  </div>
                </div>
  
                <div className="mb-4 space-y-2">
                  <div className="text-sm text-gray-600">
                    <strong>Required Product:</strong> {listing.quantityRequired} {listing.productId?.unit || 'units' }
                  </div>
                  {listing.qualityRequirements && (
                    <div className="text-sm text-gray-600">
                      <strong>Quality:</strong> {listing.qualityRequirements}
                    </div>
                  )}
                  {listing.deliveryLocation && (
                    <div className="text-sm text-gray-600">
                      <strong>Location:</strong> {listing.deliveryLocation}
                    </div>
                  )}
                  {listing.deliveryDate && (
                    <div className="text-sm text-gray-600">
                      <strong>Delivery Date:</strong> {new Date(listing.deliveryDate).toLocaleDateString()}
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
      </div>)}
    </div>
  )
}

export default MyRequirementsTab