'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { showNotification } from '@/utils/notifications'

export default function ConnectionsTab({ connections, onConnectionUpdate }) {
  const [selectedConnection, setSelectedConnection] = useState(null)
  const [showMessages, setShowMessages] = useState(false)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { token } = useAuth()
  const { t } = useLanguage()

  const handleConnectionAction = async (connectionId, action) => {
    setLoading(true)
    
    try {
      const response = await fetch(`/api/connections/${connectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: action })
      })

      if (response.ok) {
        showNotification(`Connection ${action}!`, 'success')
        if (onConnectionUpdate) {
          onConnectionUpdate()
        }
      } else {
        const error = await response.json()
        showNotification(error.error || t('error'), 'error')
      }
    } catch (error) {
      console.error('Failed to update connection:', error)
      showNotification(t('error'), 'error')
    } finally {
      setLoading(false)
    }
  }

  const openMessages = async (connection) => {
    setSelectedConnection(connection)
    setShowMessages(true)
    await loadMessages(connection.id)
  }

  const loadMessages = async (connectionId) => {
    try {
      const response = await fetch(`/api/messages/${connectionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const messagesData = await response.json()
        setMessages(messagesData)
      }
    } catch (error) {
      console.error('Failed to load messages:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConnection) return

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: selectedConnection.buyer_id, // This should be dynamic
          connectionId: selectedConnection.id,
          messageText: newMessage
        })
      })

      if (response.ok) {
        setNewMessage('')
        await loadMessages(selectedConnection.id)
        showNotification('Message sent!', 'success')
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      showNotification('Failed to send message', 'error')
    }
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'status-pending',
      accepted: 'status-active',
      rejected: 'status-closed',
      completed: 'status-active'
    }
    return statusClasses[status] || 'status-pending'
  }

  return (
    <div className="p-4">
      {connections.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🤝</div>
          <p className="text-gray-600">No connections yet.</p>
          <p className="text-sm text-gray-500 mt-2">Connect with buyers from the marketplace!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {connections.map((connection) => (
            <div key={connection.id} className="listing-card">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-green-600">
                    {connection.product_name}
                  </h3>
                  <span className={`status-badge ${getStatusBadge(connection.status)}`}>
                    {connection.status}
                  </span>
                </div>
                <div className="text-right">
                  {connection.negotiated_price && (
                    <div className="text-lg font-bold text-blue-600">
                      ₹{connection.negotiated_price}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg mb-3">
                <div className="text-sm">
                  <div className="font-medium text-gray-700">Buyer Information</div>
                  <div className="text-gray-600">
                    <div>{connection.buyer_name}</div>
                    <div className="text-xs">📞 {connection.buyer_phone}</div>
                    {connection.final_quantity && (
                      <div className="text-xs">Quantity: {connection.final_quantity}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openMessages(connection)}
                  className="btn-primary flex-1 text-sm py-2"
                >
                  {t('message')}
                </button>
                
                {connection.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleConnectionAction(connection.id, 'accepted')}
                      disabled={loading}
                      className="btn-primary flex-1 text-sm py-2 disabled:opacity-50"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleConnectionAction(connection.id, 'rejected')}
                      disabled={loading}
                      className="btn-outline flex-1 text-sm py-2 text-red-600 border-red-300 hover:bg-red-50 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Messages Modal */}
      {showMessages && selectedConnection && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Messages with {selectedConnection.buyer_name}
              </h3>
              <button
                onClick={() => setShowMessages(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="message-list mb-4">
              {messages.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  {t('noMessages')}
                </p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message-bubble ${
                      message.sender_name === 'You' ? 'sent' : 'received'
                    }`}
                  >
                    <div className="text-xs font-medium mb-1">
                      {message.sender_name}
                    </div>
                    <div>{message.message_text}</div>
                    <div className="text-xs mt-1 opacity-70">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="message-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={t('typeMessage')}
                className="input-field"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="btn-primary ml-2 px-4 py-2"
              >
                {t('send')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
