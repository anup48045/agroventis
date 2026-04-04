import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';

// Hardcoded config for testing (remove this once env vars work)
const firebaseConfig = {
  apiKey: "AIzaSyCmK_duxMMp9eEcajE_FLmqzIsL9Atvzco",
  authDomain: "agroventis-b73b4.firebaseapp.com",
  projectId: "agroventis-b73b4",
  storageBucket: "agroventis-b73b4.firebasestorage.app",
  messagingSenderId: "3208041849",
  appId: "1:3208041849:web:7e63e823d7bff56929cba8"
};

// Initialize Firebase only if config is available
let app, auth;

if (typeof window !== 'undefined' && firebaseConfig.apiKey) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    console.log('Firebase initialized successfully with hardcoded config');
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

export { auth, signInWithPhoneNumber, RecaptchaVerifier };
