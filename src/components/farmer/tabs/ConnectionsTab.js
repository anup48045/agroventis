'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { showNotification } from '@/utils/notifications'
import { getSocket } from '@/lib/socketClient'

export default function ConnectionsTab({ connections, onConnectionUpdate }) {
  const [selectedConnection, setSelectedConnection] = useState(null)
  const [showMessages, setShowMessages] = useState(false)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const { token, user } = useAuth()
  const { t } = useLanguage()
  const socket = getSocket()

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
  // const socket = getSocket();
  const openMessages = async (connection) => {
    // Check if user is authenticated
    if (!user || !token) {
      showNotification('Please login to access chat', 'error');
      return;
    }

    setSelectedConnection(connection)
    setShowMessages(true)

    socket.emit("join_connection", connection._id)

    await loadMessages(connection._id)
  }

  const loadMessages = async (connectionId) => {
    try {
      const response = await fetch(`/api/messages/${connectionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Loaded messages:', data)
        // Use the API response format directly (isOwnMessage is already calculated)
        setMessages(data)
      }
    } catch (error) {
      console.error('Failed to load messages:', error)
    }
  }
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConnection) return;

    const receiverId =
      selectedConnection.buyerId._id === user._id
        ? selectedConnection.farmerId._id
        : selectedConnection.buyerId._id

    const messageData = {
      connectionId: selectedConnection._id,
      senderId: user._id,
      messageText: newMessage,
      createdAt: new Date(),
      isOwnMessage: true,
      _id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    setMessages(prev => [...prev, messageData])
    // Emit instantly
    socket.emit("send_message", messageData);

    // Save in DB
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...messageData,
          receiverId
        })
      });
    }
    catch (error) {
      console.error('Save failed:', error);
    }

    setNewMessage('');
  };

  useEffect(() => {
    if (!socket) return;

    // Handle incoming messages from other users
    socket.on("receive_message", (data) => {
      console.log('Farmer received message:', data);
      
      // Only add message if it's for the current connection and not from current user
      if (selectedConnection && data.connectionId === selectedConnection._id && data.senderId !== user._id) {
        // Format message to match API response structure
        const formattedMessage = {
          _id: data._id || `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          message_text: data.messageText || data.message_text,
          created_at: data.createdAt || data.created_at || new Date().toISOString(),
          isOwnMessage: false,
          sender_name: data.senderName || 'Buyer'
        };
        
        setMessages(prev => [...prev, formattedMessage]);
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [selectedConnection, user._id]);

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
            <div key={connection._id} className="listing-card">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-green-600">
                    {connection.productName}
                  </h3>
                  <span className={`status-badge ${getStatusBadge(connection.status)}`}>
                    {connection.status}
                  </span>
                </div>
                <div className="text-right">
                  {connection.negotiatedPrice && (
                    <div className="text-lg font-bold text-blue-600">
                      ₹{connection.negotiatedPrice}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg mb-3">
                <div className="text-sm">
                  <div className="font-medium text-gray-700">Buyer Information</div>
                  <div className="text-gray-600">
                    <div>{connection.buyerId?.name}</div>
                    <div className="text-xs">📞 {connection.buyerId?.phone}</div>
                    {connection.finalQuantity && (
                      <div className="text-xs">Quantity: {connection.finalQuantity}</div>
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
                      onClick={() => handleConnectionAction(connection._id, 'accepted')}
                      disabled={loading}
                      className="btn-primary flex-1 text-sm py-2 disabled:opacity-50"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleConnectionAction(connection._id, 'rejected')}
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
                Messages with {selectedConnection.buyerId?.name}
              </h3>
              <button
                onClick={() => setShowMessages(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* <div className="message-list mb-4">
              {messages.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  {t('noMessages')}
                </p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message._id || message.createdAt}
                    className={`message-bubble ${message.isOwnMessage ? 'sent' : 'received'
                      }`}
                  >
                    {!message.isOwnMessage && (
                      <div className="text-xs font-medium mb-1 text-gray-600">
                        {message.sender_name || 'Buyer'}
                      </div>
                    )}
                    <div>{message.message_text}</div>
                    <div className="text-xs mt-1 opacity-70">
                      {(() => {
                        const timestamp = message.created_at || message.createdAt;
                        if (!timestamp) return 'Just now';
                        const date = new Date(timestamp);
                        return isNaN(date.getTime()) ? 'Just now' : date.toLocaleTimeString();
                      })()}
                    </div>
                  </div>
                ))
              )}
            </div> */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${
                    msg.isOwnMessage ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.isOwnMessage
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {!msg.isOwnMessage && (
                      <p className="text-xs font-medium mb-1 text-gray-600">
                        {msg.sender_name || 'Farmer'}
                      </p>
                    )}
                    <p className="text-sm">{msg.message_text}</p>
                    <p className="text-xs mt-1 opacity-75">
                      {(() => {
                        if (!msg.created_at) return 'Just now';
                        const date = new Date(msg.created_at);
                        return isNaN(date.getTime()) ? 'Just now' : date.toLocaleTimeString();
                      })()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="message-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={t('typeMessage')}
                className="input-field"
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
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
