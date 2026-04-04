'use client';
import { useState, useEffect, useRef } from 'react';

export default function TwilioOTP({ onLoginSuccess, onRegisterSuccess, userData = null }) {
  const [phone, setPhone] = useState(userData?.phone || '');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [isDevelopment, setIsDevelopment] = useState(false);
  
  const countdownRef = useRef(null);
  const statusRef = useRef('idle');

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      countdownRef.current = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    
    return () => {
      if (countdownRef.current) {
        clearTimeout(countdownRef.current);
      }
    };
  }, [countdown]);

  // Auto-verify if OTP matches (development mode only)
  useEffect(() => {
    if (generatedOTP && generatedOTP !== 'sent' && otp.length === 6) {
      if (otp === generatedOTP) {
        console.log('🔧 Development mode: Auto-verifying OTP');
        handleVerifyOTP();
      }
    }
  }, [otp, generatedOTP]);

  const sendOTP = async (e) => {
    e?.preventDefault();
    
    if (!phone || phone.length < 10) {
      setError('⚠️ Please enter a valid 10-digit phone number');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Send OTP via API
      const response = await fetch('/api/twilio/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setSuccess('✅ OTP sent successfully via real SMS! Please check your phone.');
        setCountdown(1800); // 30 minutes (extended for more time)
        setAttempts(0);
        statusRef.current = 'sent';
        
        // Show OTP input form - use actual OTP in development mode, otherwise use 'sent'
        setGeneratedOTP(data.development && data.otp ? data.otp : 'sent');
        
        // Auto-clear success message after 10 seconds
        setTimeout(() => setSuccess(''), 10000);
      } else {
        setError(data.error || 'Failed to send OTP');
      }
      
    } catch (error) {
      console.error('OTP generation error:', error);
      setError('❌ Failed to generate OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('⚠️ Please enter 6-digit OTP');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const requestBody = { 
        phone, 
        otp, 
        userData: userData || undefined 
      };
      
      console.log('🔍 Sending verify request:', { phone, otp: otp ? '***' : 'missing', userData: userData ? 'present' : 'missing' });
      
      // Verify OTP via API with timeout and retry
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout
      
      const response = await fetch('/api/twilio/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      // Handle connection errors
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ HTTP Error:', response.status, errorText);
        
        if (response.status === 408) {
          throw new Error('Request timed out. Please check your connection and try again.');
        } else if (response.status === 503) {
          throw new Error('Service temporarily unavailable. Please try again in a moment.');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again.');
        } else {
          // Try to parse as JSON, fallback to text
          let errorMessage = 'Verification failed';
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error || errorMessage;
          } catch {
            errorMessage = errorText || errorMessage;
          }
          throw new Error(errorMessage);
        }
      }

      const data = await response.json();
      console.log('🔍 Verify response:', { status: response.status, data });
      console.log('🔍 Response success field:', data.success);
      console.log('🔍 Response user field:', data.user);
      console.log('🔍 Response token field:', data.token);
      
      // Check if the response indicates success
      if (!data.success) {
        throw new Error(data.error || 'Verification failed');
      }
      
      setIsVerified(true);
      setSuccess('🎉 OTP Verified Successfully! Redirecting...');
      statusRef.current = 'verified';
      
      console.log('🔍 About to call success callback:', { userData, data });
      
      // Call success callback immediately with error handling
      try {
        if (userData) {
          console.log('🔍 Calling onRegisterSuccess');
          onRegisterSuccess(data);
        } else {
          console.log('🔍 Calling onLoginSuccess');
          onLoginSuccess(data);
        }
      } catch (callbackError) {
        console.error('❌ Success callback error:', callbackError);
        setError('❌ Login successful but redirect failed. Please go to dashboard manually.');
        setSuccess('');
      }
      
    } catch (error) {
      console.error('OTP verification error:', error);
      
      if (error.name === 'AbortError') {
        setError('❌ Request timed out. Please check your connection and try again.');
      } else if (error.message.includes('Failed to fetch')) {
        setError('❌ Network error. Please check your internet connection and try again.');
      } else {
        setError(`❌ ${error.message || 'Verification failed. Please try again.'}`);
      }
      
      setAttempts(attempts + 1);
      
      if (attempts >= 2) {
        setError('❌ Too many attempts. Please request new OTP.');
        setGeneratedOTP('');
        setCountdown(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = () => {
    switch (statusRef.current) {
      case 'idle': return 'text-gray-600';
      case 'sent': return 'text-blue-600';
      case 'verified': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (statusRef.current) {
      case 'idle': return '⏳';
      case 'sent': return '📤';
      case 'verified': return '🎉';
      default: return '⏳';
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {userData ? 'Complete Registration' : 'Twilio OTP Login'}
      </h2>
      
      {/* Twilio Status */}
      <div className="mb-4 p-3 bg-green-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-green-700">Twilio Status:</span>
          <span className="text-sm font-medium text-green-800">
            🚀 Real SMS Mode
          </span>
        </div>
        <div className="mt-2 text-xs text-green-600">
          Sending real SMS messages
        </div>
      </div>
      
      {/* Real-time Status Indicator */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-blue-700">Status:</span>
          <span className={`text-sm font-medium capitalize ${getStatusColor()}`}>
            {getStatusIcon()} {statusRef.current === 'idle' && 'Ready'}
            {statusRef.current === 'sent' && 'OTP Sent'}
            {statusRef.current === 'verified' && 'Verified'}
          </span>
        </div>
      </div>
      
      {/* OTP Display (Development Mode) - REMOVED */}
      
      {generatedOTP && generatedOTP !== 'sent' && userData && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-center text-yellow-800 font-bold text-lg">
            🔐 OTP: {generatedOTP}
          </p>
          <p className="text-center text-yellow-600 text-xs mt-1">
            (Development Mode - Auto-verify enabled)
          </p>
        </div>
      )}
      
      {!generatedOTP ? (
        <form onSubmit={sendOTP} className="space-y-4">
          {!userData && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="Enter 10-digit phone number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                maxLength={10}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter 10-digit Indian mobile number
              </p>
            </div>
          )}
          
          {userData && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Registering as:</strong> {userData.userType === 'farmer' ? 'Farmer' : 'Buyer'}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Name:</strong> {userData.name}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Phone:</strong> {userData.phone}
              </p>
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading || countdown > 0}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="loading-spinner h-5 w-5 mr-2"></div>
                Sending Real SMS...
              </div>
            ) : (
              '📱 Send Real SMS OTP'
            )}
          </button>
          
          <div className="text-center text-xs text-gray-500">
            📱 Real SMS via Twilio - Low cost (~₹1.20 per SMS)
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter 6-digit OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter OTP"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-center text-lg font-bold"
              maxLength={6}
              autoFocus
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              📱 OTP sent to +91{phone || userData?.phone}
            </p>
          </div>
          
          <button
            type="submit"
            disabled={loading || isVerified}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="loading-spinner h-5 w-5 mr-2"></div>
                Verifying...
              </div>
            ) : isVerified ? (
              '✅ Verified'
            ) : (
              '🔍 Verify OTP'
            )}
          </button>

          <button
            type="button"
            onClick={sendOTP}
            disabled={loading || countdown > 0}
            className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 disabled:opacity-50 text-sm"
          >
            🔄 Resend OTP
          </button>
          
          {countdown > 0 && (
            <div className="text-center text-sm text-gray-600">
              ⏰ OTP expires in {formatCountdown(countdown)}
            </div>
          )}
        </form>
      )}
      
      {success && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {/* Twilio Info */}
      <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
        <p className="text-xs text-purple-700">
          <strong>📞 Twilio SMS OTP:</strong>
        </p>
        <p className="text-xs text-purple-600 mt-1">
          • Real SMS delivery<br/>
          • Low cost (~₹1.20 per SMS)<br/>
          • Reliable and fast<br/>
          • Global coverage<br/>
          • Auto-verify on correct OTP
        </p>
      </div>
    </div>
  );
}
