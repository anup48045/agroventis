'use client';
import { useState, useEffect } from 'react';
import { auth, signInWithPhoneNumber, RecaptchaVerifier } from '@/lib/firebaseClient';
import DebugFirebase from './DebugFirebase';

export default function FirebaseOTP({ onLoginSuccess }) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [recaptchaReady, setRecaptchaReady] = useState(false);

  useEffect(() => {
    // Check if Firebase is properly configured
    if (!auth) {
      setError('Firebase is not configured. Please check environment variables.');
      setShowDebug(true);
      return;
    }
    
    setFirebaseReady(true);
    
    // Initialize reCAPTCHA with better error handling
    const initializeRecaptcha = async () => {
      try {
        // Create unique container for this component instance
        const containerId = `recaptcha-container-login-${Date.now()}`;
        
        // Check if container exists, if not create it
        let container = document.getElementById(containerId);
        if (!container) {
          container = document.createElement('div');
          container.id = containerId;
          document.body.appendChild(container);
        }
        
        // Create new recaptcha with unique container
        window.recaptchaVerifierLogin = new RecaptchaVerifier(auth, containerId, {
          'size': 'invisible',
          'callback': (response) => {
            console.log('reCAPTCHA solved:', response);
          },
          'expired-callback': () => {
            console.log('reCAPTCHA expired');
            setError('reCAPTCHA expired. Please try again.');
          }
        });
        
        // Render the recaptcha
        await window.recaptchaVerifierLogin.render();
        setRecaptchaReady(true);
        console.log('reCAPTCHA initialized successfully');
      } catch (error) {
        console.error('reCAPTCHA initialization error:', error);
        setError('Failed to initialize reCAPTCHA. Please refresh the page.');
      }
    };
    
    // Delay initialization to ensure DOM is ready
    const timer = setTimeout(initializeRecaptcha, 100);
    
    return () => {
      clearTimeout(timer);
      // Clean up the recaptcha instance more safely
      if (window.recaptchaVerifierLogin) {
        try {
          window.recaptchaVerifierLogin.clear();
        } catch (error) {
          console.log('reCAPTCHA cleanup (harmless):', error.message);
        }
        delete window.recaptchaVerifierLogin;
      }
      
      // Clean up the dynamically created container
      const containers = document.querySelectorAll('[id^="recaptcha-container-login-"]');
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

  const sendOTP = async (e) => {
    e.preventDefault();
    if (!firebaseReady || !recaptchaReady || !window.recaptchaVerifierLogin) return;
    
    setLoading(true);
    setError('');

    try {
      // Ensure phone number has country code for Firebase
      let phoneNumber = phone;
      if (!phoneNumber.startsWith('+')) {
        phoneNumber = `+91${phoneNumber}`;
      }
      
      console.log('Sending OTP to:', phoneNumber);
      
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifierLogin);
      setConfirmation(confirmationResult);
      console.log('OTP sent successfully');
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError(error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    if (!firebaseReady) return;
    
    setLoading(true);
    setError('');

    try {
      const result = await confirmation.confirm(otp);
      const idToken = await result.user.getIdToken();
      
      // Send ID token to your backend
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        setError('Server error: Invalid response format');
        return;
      }

      const data = await response.json();
      
      if (response.ok) {
        onLoginSuccess(data);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError(error.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  if (!firebaseReady) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          Firebase is not configured. Please add environment variables.
        </div>
        
        {showDebug && <DebugFirebase />}
        
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <h4 className="font-bold text-blue-800 mb-2">To Fix:</h4>
          <ol className="text-sm text-blue-700 list-decimal list-inside">
            <li>Add Firebase config to .env.local</li>
            <li>Restart development server</li>
            <li>Enable Phone Auth in Firebase Console</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login with OTP</h2>
      
      {!recaptchaReady ? (
        <div className="text-center py-8">
          <div className="loading-spinner h-8 w-8 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing secure verification...</p>
        </div>
      ) : (
        <>
          {!confirmation ? (
            <form onSubmit={sendOTP} className="space-y-4">
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
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={6}
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>
          )}
        </>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
