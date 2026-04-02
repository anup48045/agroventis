'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { showNotification } from '@/utils/notifications'
import { getSocket} from '@/lib/socketClient'

const ConnectionsTab = ({ connections, onConnectionUpdate }) => {
  const { token } = useAuth()
  const [loadingId, setLoadingId] = useState(null)
  const socket = getSocket();

  const openMessages = async (connection) => {
  setSelectedConnection(connection);
  setShowMessages(true);

  socket.emit("join_connection", connection._id);

  await loadMessages(connection._id);
};
const sendMessage = async () => {
  if (!newMessage.trim()) return;

  const socket = getSocket();

  const messageData = {
    connectionId: selectedConnection._id,
    senderId: user._id,
    messageText: newMessage,
    createdAt: new Date()
  };

  // Emit instantly
  socket.emit("send_message", messageData);

  // Save in DB
  await fetch('/api/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      ...messageData,
      receiverId:
        selectedConnection.buyerId._id === user._id
          ? selectedConnection.farmerId._id
          : selectedConnection.buyerId._id
    })
  });

  setNewMessage('');
};

  const handleAction = async (connectionId, action) => {
    setLoadingId(connectionId)

    try {
      const res = await fetch(`/api/connections/${connectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: action })
      })

      const data = await res.json()

      if (res.ok) {
        showNotification(`Connection ${action}`, 'success')
        onConnectionUpdate && onConnectionUpdate()
      } else {
        showNotification(data.error, 'error')
      }

    } catch (error) {
      console.error(error)
      showNotification('Something went wrong', 'error')
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Connections</h2>

      {connections.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🤝</div>
          <p className="text-gray-600">No connections yet.</p>
          <p className="text-sm text-gray-500 mt-2">
            Farmers will send you connection requests.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {connections.map((conn) => (
            <div key={conn._id} className="card p-4 border rounded-lg">

              {/* Product */}
              <h3 className="text-lg font-semibold text-green-600">
                {conn.productId?.name || conn.productName}
              </h3>

              {/* Status */}
              <span className="text-sm text-gray-500">
                Status: {conn.status}
              </span>

              {/* Farmer Info */}
              <div className="bg-gray-50 p-3 rounded mt-3">
                <p className="font-medium">{conn.farmerId?.name}</p>
                <p className="text-xs">📞 {conn.farmerId?.phone}</p>
              </div>

              {/* Actions */}
              {conn.status === 'pending' && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleAction(conn._id, 'accepted')}
                    disabled={loadingId === conn._id}
                    className="btn-primary flex-1 py-2"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => handleAction(conn._id, 'rejected')}
                    disabled={loadingId === conn._id}
                    className="btn-outline flex-1 py-2 text-red-600 border-red-300"
                  >
                    Reject
                  </button>
                </div>
              )}

              {/* Accepted state */}
              {conn.status === 'accepted' && (
                <div className="mt-3 text-green-600 font-medium">
                  ✅ Connected — you can now chat
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ConnectionsTab