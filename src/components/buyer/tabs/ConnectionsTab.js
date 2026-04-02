import React from 'react'

const ConnectionsTab = ({connections}) => {
    return (
        <div>
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Connections</h2>
            </div>     {connections.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-4xl mb-4">🤝</div>
                    <p className="text-gray-600">No connections yet.</p>
                    <p className="text-sm text-gray-500 mt-2">Connect with farmers from the marketplace!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Connections would go here */}
                </div>
            )}
    </div>
  )
}

export default ConnectionsTab
