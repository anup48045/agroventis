'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { showNotification } from '@/utils/notifications'
import { getSocket} from '@/lib/socketClient'

const ConnectionsTab = ({ connections, onConnectionUpdate }) => {
  const { token, user } = useAuth()
  const [loadingId, setLoadingId] = useState(null)
  const [selectedConnection, setSelectedConnection] = useState(null)
  const [showMessages, setShowMessages] = useState(false)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const socket = getSocket();

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Handle incoming messages from other users
    socket.on("receive_message", (data) => {
      console.log('Buyer received message:', data);
      
      // Only add message if it's for the current connection and not from current user
      if (selectedConnection && data.connectionId === selectedConnection._id && data.senderId !== user._id) {
        // Format message to match API response structure
        const formattedMessage = {
          _id: data._id || `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          message_text: data.messageText || data.message_text,
          created_at: data.createdAt || data.created_at || new Date().toISOString(),
          isOwnMessage: false,
          sender_name: data.senderName || 'Farmer'
        };
        
        setMessages(prev => [...prev, formattedMessage]);
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [selectedConnection, user._id]);

  const openMessages = async (connection) => {
    // Check if user is authenticated
    if (!user || !token) {
      showNotification('Please login to access chat', 'error');
      return;
    }

    setSelectedConnection(connection);
    setShowMessages(true);

    socket.emit("join_connection", connection._id);

    await loadMessages(connection._id);
  };

  const loadMessages = async (connectionId) => {
    try {
      const res = await fetch(`/api/messages/${connectionId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Response status:', res.status);

      if (res.ok) {
        const data = await res.json();
        console.log('Loaded messages:', data);
        setMessages(data);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };


  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      connectionId: selectedConnection._id,
      senderId: user._id,
      messageText: newMessage,
      created_at: new Date(),
      isOwnMessage: true,
      _id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    // Add to local state immediately
    setMessages(prev => [...prev, messageData]);

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
                <div className="mt-3">
                  <div className="text-green-600 font-medium mb-2">
                    Connected you can now chat
                  </div>
                  <button
                    onClick={() => openMessages(conn)}
                    className="btn-primary py-2 px-4 text-sm"
                  >
                    Chat with {conn.farmerId?.name}
                  </button>
                </div>
              )}

            </div>
          ))}
        </div>
      )}

      {/* Chat Modal */}
      {showMessages && selectedConnection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Chat with {selectedConnection.farmerId?.name}</h3>
                <p className="text-sm text-blue-100">Product: {selectedConnection.productId?.name}</p>
              </div>
              <button
                onClick={() => {
                  setShowMessages(false)
                  setSelectedConnection(null)
                  setMessages([])
                }}
                className="text-white hover:text-gray-200"
              >
                ×
              </button>
            </div>

            {/* Messages */}
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

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="btn-primary px-4 py-2 disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ConnectionsTab