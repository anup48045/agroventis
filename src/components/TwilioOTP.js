'use client';
import { useState, useEffect, useRef } from 'react';

export default function TwilioOTP({
  onLoginSuccess,
  onRegisterSuccess,
  userData = null
}) {

  const [phone, setPhone] = useState(userData?.phone || '');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  const countdownRef = useRef(null);

  // -------------------------
  // COUNTDOWN TIMER
  // -------------------------
  useEffect(() => {
    if (countdown > 0) {
      countdownRef.current = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(countdownRef.current);
  }, [countdown]);

  // -------------------------
  // SEND OTP
  // -------------------------
  const sendOTP = async (e) => {
    e?.preventDefault();

    if (!phone || phone.length < 10) {
      setError('⚠️ Enter valid phone number');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/twilio/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (res.ok) {
        setGeneratedOTP('sent');
        setCountdown(300);
        setAttempts(0);
        setSuccess('✅ OTP sent!');
      } else {
        setError(data.error || 'Failed to send OTP');
      }
    } catch {
      setError('❌ Network error');
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // VERIFY OTP
  // -------------------------
  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Enter 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/twilio/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, userData }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid OTP');
      }

      // ✅ OTP verified
      setIsVerified(true);
      setSuccess('🎉 OTP Verified! Logging you in...');

      console.log('✅ OTP VERIFIED:', data);

      // ✅ Call parent callback
      if (userData) {
        // Registration flow
        onRegisterSuccess && onRegisterSuccess(data);
      } else {
        // Login flow
        onLoginSuccess && onLoginSuccess(data);
      }

    } catch (err) {
      setError(`❌ ${err.message}`);
      setAttempts(prev => prev + 1);

      if (attempts >= 2) {
        setError('Too many attempts. Request new OTP.');
        setGeneratedOTP('');
        setCountdown(0);
      }
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // UI
  // -------------------------
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">

      <h2 className="text-xl font-bold text-center mb-4">
        {userData ? 'Complete Registration' : 'OTP Login'}
      </h2>

      {!generatedOTP ? (
        <form onSubmit={sendOTP} className="space-y-4">

          {!userData && (
            <input
              type="tel"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
              }
              placeholder="Enter phone"
              className="w-full p-2 border rounded"
              required
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>

        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-4">

          <input
            type="text"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
            }
            placeholder="Enter OTP"
            className="w-full p-2 border rounded text-center text-lg"
            required
          />

          <button
            type="submit"
            disabled={loading || isVerified}
            className="w-full bg-orange-600 text-white py-2 rounded"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>

          <button
            type="button"
            onClick={sendOTP}
            disabled={countdown > 0}
            className="w-full text-sm text-gray-600"
          >
            Resend OTP {countdown > 0 && `(${countdown}s)`}
          </button>

        </form>
      )}

      {success && <p className="text-green-600 mt-3">{success}</p>}
      {error && <p className="text-red-600 mt-3">{error}</p>}

    </div>
  );
}