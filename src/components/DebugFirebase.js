'use client';
import { useEffect, useState } from 'react';

export default function DebugFirebase() {
  const [envVars, setEnvVars] = useState({});

  useEffect(() => {
    // Check environment variables
    const vars = {
      NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };
    
    setEnvVars(vars);
    console.log('Firebase Environment Variables:', vars);
  }, []);

  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
      <h3 className="font-bold text-red-800 mb-2">Firebase Debug Info:</h3>
      <div className="text-sm text-red-700">
        {Object.entries(envVars).map(([key, value]) => (
          <div key={key} className="mb-1">
            <strong>{key}:</strong> {value ? '✅ Set' : '❌ Missing'}
          </div>
        ))}
      </div>
      <div className="mt-3 p-2 bg-red-100 rounded text-xs">
        <strong>Note:</strong> Restart your development server after updating .env.local file.
      </div>
    </div>
  );
}
