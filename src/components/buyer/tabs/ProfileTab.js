import React from 'react'

const ProfileTab = ({user}) => {
  return (
      <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile</h2>
            <div className="card">
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-3xl">🏢</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{user?.name}</h3>
                  <p className="text-gray-600">Buyer</p>
                  <span className="status-badge status-active">Verified</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-sm">
                  <span className="text-gray-600">Phone:</span>
                  <span className="ml-2 font-medium">{user?.phone}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-2 font-medium">{user?.email || 'Not provided'}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">State:</span>
                  <span className="ml-2 font-medium">{user?.state || 'Not provided'}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">District:</span>
                  <span className="ml-2 font-medium">{user?.district || 'Not provided'}</span>
                </div>
              </div>
            </div>
        </div>
  )
}

export default ProfileTab
