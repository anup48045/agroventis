'use client';
import { useState, useEffect, useRef } from 'react';
import { auth, signInWithPhoneNumber, RecaptchaVerifier } from '@/lib/firebaseClient';
import { RealtimeOTPService } from '@/lib/firebaseRealtime';

export default function RealTimeOTP({ onLoginSuccess, onRegisterSuccess, userData = null }) {
  const [phone, setPhone] = useState(userData?.phone || '');
  const [otp, setOtp] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const [otpStatus, setOtpStatus] = useState('idle');
  const [countdown, setCountdown] = useState(0);
  const [isRealTimeVerified, setIsRealTimeVerified] = useState(false);
  
  const unsubscribeRef = useRef(null);
  const countdownRef = useRef(null);

  useEffect(() => {
    // Check if Firebase is properly configured
    if (!auth) {
      setError('Firebase is not configured. Please check environment variables.');
      return;
    }
    
    setFirebaseReady(true);
    
    // Initialize reCAPTCHA with unique container
    const initializeRecaptcha = async () => {
      try {
        const containerId = `recaptcha-container-realtime-${Date.now()}`;
        
        let container = document.getElementById(containerId);
        if (!container) {
          container = document.createElement('div');
          container.id = containerId;
          document.body.appendChild(container);
        }
        
        window.recaptchaVerifierRealtime = new RecaptchaVerifier(auth, containerId, {
          'size': 'invisible',
          'callback': (response) => {
            console.log('reCAPTCHA solved:', response);
          },
          'expired-callback': () => {
            console.log('reCAPTCHA expired');
            setError('reCAPTCHA expired. Please try again.');
          }
        });
        
        await window.recaptchaVerifierRealtime.render();
        setRecaptchaReady(true);
        console.log('Real-time reCAPTCHA initialized successfully');
      } catch (error) {
        console.error('reCAPTCHA initialization error:', error);
        setError('Failed to initialize reCAPTCHA. Please refresh the page.');
      }
    };
    
    const timer = setTimeout(initializeRecaptcha, 100);
    
    return () => {
      clearTimeout(timer);
      if (window.recaptchaVerifierRealtime) {
        try {
          window.recaptchaVerifierRealtime.clear();
        } catch (error) {
          console.log('reCAPTCHA cleanup (harmless):', error.message);
        }
        delete window.recaptchaVerifierRealtime;
      }
      
      const containers = document.querySelectorAll('[id^="recaptcha-container-realtime-"]');
      containers.forEach(container => {
        try {
          if (container.parentNode) {
            container.parentNode.removeChild(container);
          }
        } catch (error) {
          // Ignore cleanup errors
        }
      });
    };
  }, []);

  // Real-time OTP status listener
  useEffect(() => {
    if (phone && firebaseReady) {
      unsubscribeRef.current = RealtimeOTPService.listenForOTPStatus(phone, (data) => {
        setOtpStatus(data.status);
        
        if (data.status === 'verified') {
          setIsRealTimeVerified(true);
          setSuccess('✅ OTP verified successfully! Redirecting...');
          setTimeout(() => {
            if (userData) {
              onRegisterSuccess({ user: userData, token: 'realtime-token' });
            } else {
              onLoginSuccess({ user: { phone }, token: 'realtime-token' });
            }
          }, 1500);
        } else if (data.status === 'expired') {
          setError('❌ OTP expired. Please request a new one.');
          setCountdown(0);
        }
      });
    }
    
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [phone, firebaseReady, userData, onLoginSuccess, onRegisterSuccess]);

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

  const sendOTP = async (e) => {
    e?.preventDefault();
    if (!firebaseReady || !recaptchaReady || !window.recaptchaVerifierRealtime) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      let phoneNumber = phone;
      if (!phoneNumber.startsWith('+')) {
        phoneNumber = `+91${phoneNumber}`;
      }
      
      console.log('📱 Sending real-time SMS OTP to:', phoneNumber);
      
      // Try to store OTP status (ignore if fails)
      try {
        await RealtimeOTPService.storeOTPStatus(phoneNumber, 'sending');
      } catch (dbError) {
        console.log('Database error (continuing anyway):', dbError.message);
      }
      
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifierRealtime);
      setConfirmation(confirmationResult);
      
      // Try to update status (ignore if fails)
      try {
        await RealtimeOTPService.storeOTPStatus(phoneNumber, 'sent', {
          message: 'OTP sent successfully'
        });
      } catch (dbError) {
        console.log('Database update error (continuing anyway):', dbError.message);
      }
      
      console.log('✅ Real-time SMS OTP sent successfully');
      setSuccess('✅ OTP sent via SMS! Please check your phone.');
      setCountdown(300); // 5 minutes countdown
      setTimeout(() => setSuccess(''), 5000);
      
    } catch (error) {
      console.error('❌ Error sending real-time OTP:', error);
      
      // Handle specific errors
      if (error.code === 'auth/billing-not-enabled') {
        setError('⚠️ Firebase billing not enabled. Please enable Blaze Plan in Firebase Console.');
        setError('💡 Go to Firebase Console → Project Settings → Billing → Enable Blaze Plan (FREE for development)');
      } else if (error.code === 'auth/quota-exceeded') {
        setError('⚠️ SMS quota exceeded. Please try again later.');
      } else {
        setError(error.message || 'Failed to send OTP');
      }
      
      // Try to store error status
      try {
        await RealtimeOTPService.storeOTPStatus(phone, 'failed', {
          error: error.message
        });
      } catch (dbError) {
        console.log('Database error (ignoring):', dbError.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    if (!firebaseReady || !confirmation) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await confirmation.confirm(otp);
      const idToken = await result.user.getIdToken();
      
      // Update real-time status
      await RealtimeOTPService.storeOTPStatus(phone, 'verified', {
        uid: result.user.uid,
        verifiedAt: Date.now()
      });
      
      // Send to backend for final verification
      const endpoint = userData ? '/api/auth/register' : '/api/auth/login';
      const requestBody = userData ? 
        { ...userData, idToken } : 
        { idToken };
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        setError('Server error: Invalid response format');
        return;
      }
      
      const data = await response.json();
      
      if (response.ok) {
        await RealtimeOTPService.storeLoginStatus(phone, 'success', data);
        if (userData) {
          onRegisterSuccess(data);
        } else {
          onLoginSuccess(data);
        }
      } else {
        setError(data.error || 'Verification failed');
        await RealtimeOTPService.storeOTPStatus(phone, 'failed', {
          error: data.error
        });
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError(error.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!firebaseReady) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          Firebase is not configured. Please add environment variables.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {userData ? 'Complete Registration' : 'Login with Real-time OTP'}
      </h2>
      
      {/* Real-time Status Indicator */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-blue-700">Status:</span>
          <span className="text-sm font-medium text-blue-800 capitalize">
            {otpStatus === 'idle' && '⏳ Ready'}
            {otpStatus === 'sending' && '📤 Sending...'}
            {otpStatus === 'sent' && '✅ Sent'}
            {otpStatus === 'verified' && '🎉 Verified'}
            {otpStatus === 'expired' && '⏰ Expired'}
            {otpStatus === 'failed' && '❌ Failed'}
          </span>
        </div>
      </div>
      
      {!recaptchaReady ? (
        <div className="text-center py-8">
          <div className="loading-spinner h-8 w-8 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing real-time verification...</p>
        </div>
      ) : (
        <>
          {!confirmation ? (
            <form onSubmit={sendOTP} className="space-y-4">
              {!userData && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
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
                    <strong>Phone:</strong> +91{userData.phone}
                  </p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading || countdown > 0}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? '📤 Sending...' : '📱 Send Real-time OTP'}
              </button>
              
              {countdown > 0 && (
                <div className="text-center text-sm text-gray-600">
                  ⏰ Resend available in {formatCountdown(countdown)}
                </div>
              )}
            </form>
          ) : (
            <form onSubmit={verifyOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter 6-digit OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={6}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  📱 OTP sent to +91{phone || userData?.phone}
                </p>
              </div>
              
              <button
                type="submit"
                disabled={loading || isRealTimeVerified}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? '🔄 Verifying...' : isRealTimeVerified ? '✅ Verified' : '🔐 Verify OTP'}
              </button>

              <button
                type="button"
                onClick={sendOTP}
                disabled={loading || countdown > 0}
                className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 disabled:opacity-50 text-sm"
              >
                🔄 Resend OTP
              </button>
            </form>
          )}
        </>
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
    </div>
  );
}
