'use client';

export default function TestEnv() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
      
      <div className="space-y-2">
        <div>
          <strong>NEXT_PUBLIC_FIREBASE_API_KEY:</strong> 
          <span className="ml-2">{process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing'}</span>
          <br />
          <small className="text-gray-500">{process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 20)}...</small>
        </div>
        
        <div>
          <strong>NEXT_PUBLIC_FIREBASE_PROJECT_ID:</strong> 
          <span className="ml-2">{process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing'}</span>
          <br />
          <small className="text-gray-500">{process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}</small>
        </div>
        
        <div>
          <strong>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:</strong> 
          <span className="ml-2">{process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing'}</span>
          <br />
          <small className="text-gray-500">{process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}</small>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded">
        <p className="text-sm">Visit this page to see if environment variables are loading correctly.</p>
      </div>
    </div>
  );
}
