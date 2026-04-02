'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { showNotification } from '@/utils/notifications'

export default function ProfileTab({ user, onUserUpdate }) {
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    state: user?.state || '',
    district: user?.district || '',
    village: user?.village || '',
    pincode: user?.pincode || '',
    location: user?.location || ''
  })
  const { updateUser, token } = useAuth()
  const { logout } = useAuth()
  const { t, currentLanguage, changeLanguage } = useLanguage()

  const handleSave = async () => {
    setLoading(true)

    try {
      // In a real app, this would call an API to update the user profile
      // showNotification('Profile updated successfully!', 'success')

      const response = await fetch('/api/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` // optional but recommended
        },
        body: JSON.stringify({
          userId: user._id,   // 🔥 important
          ...formData
        }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message)
      }

      // ✅ Update frontend AFTER DB update
      updateUser(data.user)
      console.log('Profile updated successfully:', data.user)

      showNotification('Profile updated successfully!', 'success')
      setEditing(false)

    } 
    catch (error) {
      console.error('Failed to update profile:', error)
      showNotification('Failed to update profile', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    showNotification('Logged out successfully', 'success')
  }

  const stats = [
    { label: 'Total Listings', value: '12', icon: '🌾' },
    { label: 'Active Connections', value: '5', icon: '🤝' },
    { label: 'Completed Deals', value: '8', icon: '✅' },
    { label: 'Rating', value: '4.8⭐', icon: '⭐' }
  ]

  return (
    <div className="p-4">
      {/* Profile Header */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-3xl">👨‍🌾</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">{user?.name}</h2>
        <p className="text-sm text-gray-600">Farmer</p>
        <div className="flex justify-center items-center gap-2 mt-2">
          <span className={`status-badge ${user?.is_verified ? 'status-active' : 'status-pending'}`}>
            {user?.is_verified ? 'Verified' : 'Pending Verification'}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="card text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-lg font-semibold text-gray-800">{stat.value}</div>
            <div className="text-xs text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Profile Information */}
      <div className="card mb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Profile Information</h3>
          <button
            onClick={() => setEditing(!editing)}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            {editing ? t('cancel') : t('edit')}
          </button>
        </div>

        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('name')}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('email')}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('state')}
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('district')}
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="input-field"
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
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('pincode')}
                </label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="input-field"
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
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setEditing(false)}
                className="btn-outline flex-1"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {loading ? t('loading') : t('save')}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Phone:</span>
              <span className="text-sm font-medium">{user?.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Email:</span>
              <span className="text-sm font-medium">{user?.email || 'Not provided'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">State:</span>
              <span className="text-sm font-medium">{user?.state || 'Not provided'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">District:</span>
              <span className="text-sm font-medium">{user?.district || 'Not provided'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Village:</span>
              <span className="text-sm font-medium">{user?.village || 'Not provided'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Pincode:</span>
              <span className="text-sm font-medium">{user?.pincode || 'Not provided'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Location:</span>
              <span className="text-sm font-medium">{user?.location || 'Not provided'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Member Since:</span>
              <span className="text-sm font-medium">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recent'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Language Settings */}
      <div className="card mb-4">
        <h3 className="text-lg font-semibold mb-3">Language Settings</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Language
          </label>
          <select
            value={currentLanguage}
            onChange={(e) => changeLanguage(e.target.value)}
            className="input-field"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="bn">বাংলা (Bengali)</option>
            <option value="te">తెలుగు (Telugu)</option>
            <option value="mr">मराठी (Marathi)</option>
            <option value="gu">ગુજરાતી (Gujarati)</option>
            <option value="ta">தமிழ் (Tamil)</option>
            <option value="kn">ಕನ್ನಡ (Kannada)</option>
            <option value="ml">മലയാളം (Malayalam)</option>
            <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
            <option value="or">ଓଡ଼ିଆ (Odia)</option>
            <option value="as">অসমীয়া (Assamese)</option>
          </select>
        </div>
      </div>

      {/* Account Actions */}
      <div className="space-y-3">
        <button className="btn-outline w-full py-3">
          Help & Support
        </button>
        <button className="btn-outline w-full py-3">
          Privacy Policy
        </button>
        <button className="btn-outline w-full py-3">
          Terms of Service
        </button>
        <button
          onClick={handleLogout}
          className="btn-outline w-full py-3 text-red-600 border-red-300 hover:bg-red-50"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
