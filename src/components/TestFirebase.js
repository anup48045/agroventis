'use client';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebaseClient';

export default function TestFirebase() {
  const [status, setStatus] = useState('Checking...');

  useEffect(() => {
    if (auth) {
      setStatus('✅ Firebase Client SDK is working');
    } else {
      setStatus('❌ Firebase Client SDK not initialized');
    }
  }, []);

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="font-bold text-blue-800">Firebase Status:</h3>
      <p className="text-blue-600">{status}</p>
    </div>
  );
}
