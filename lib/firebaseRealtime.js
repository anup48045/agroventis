import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, off } from 'firebase/database';

// Firebase Realtime Database config (same as client config)
const firebaseConfig = {
  apiKey: "AIzaSyCmK_duxMMp9eEcajE_FLmqzIsL9Atvzco",
  authDomain: "agroventis-b73b4.firebaseapp.com",
  projectId: "agroventis-b73b4",
  storageBucket: "agroventis-b73b4.firebasestorage.app",
  messagingSenderId: "3208041849",
  appId: "1:3208041849:web:7e63e823d7bff56929cba8"
};

// Initialize Firebase Realtime Database
let app, database;

if (typeof window !== 'undefined') {
  try {
    app = initializeApp(firebaseConfig, 'realtime-db');
    database = getDatabase(app);
    console.log('Firebase Realtime Database initialized successfully');
  } catch (error) {
    console.error('Firebase Realtime Database initialization error:', error);
  }
}

export class RealtimeOTPService {
  // Store OTP status in real-time database
  static async storeOTPStatus(phone, status, data = {}) {
    if (!database) return false;
    
    const normalizedPhone = phone.replace(/\D/g, '');
    const otpRef = ref(database, `otp-statuses/${normalizedPhone}`);
    
    const otpData = {
      status,
      timestamp: Date.now(),
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      ...data
    };
    
    try {
      await set(otpRef, otpData);
      console.log(`OTP status stored for ${phone}:`, status);
      return true;
    } catch (error) {
      console.error('Failed to store OTP status:', error);
      return false;
    }
  }

  // Listen for real-time OTP status updates
  static listenForOTPStatus(phone, callback) {
    if (!database) return null;
    
    const normalizedPhone = phone.replace(/\D/g, '');
    const otpRef = ref(database, `otp-statuses/${normalizedPhone}`);
    
    const unsubscribe = onValue(otpRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        console.log(`Real-time OTP status update for ${phone}:`, data);
        callback(data);
      }
    }, (error) => {
      console.error('Real-time listener error:', error);
    });
    
    return unsubscribe;
  }

  // Clear OTP status
  static async clearOTPStatus(phone) {
    if (!database) return false;
    
    const normalizedPhone = phone.replace(/\D/g, '');
    const otpRef = ref(database, `otp-statuses/${normalizedPhone}`);
    
    try {
      await set(otpRef, null);
      console.log(`OTP status cleared for ${phone}`);
      return true;
    } catch (error) {
      console.error('Failed to clear OTP status:', error);
      return false;
    }
  }

  // Store login status for real-time updates
  static async storeLoginStatus(phone, status, userData = {}) {
    if (!database) return false;
    
    const normalizedPhone = phone.replace(/\D/g, '');
    const loginRef = ref(database, `login-statuses/${normalizedPhone}`);
    
    const loginData = {
      status,
      timestamp: Date.now(),
      ...userData
    };
    
    try {
      await set(loginRef, loginData);
      console.log(`Login status stored for ${phone}:`, status);
      return true;
    } catch (error) {
      console.error('Failed to store login status:', error);
      return false;
    }
  }

  // Listen for real-time login status updates
  static listenForLoginStatus(phone, callback) {
    if (!database) return null;
    
    const normalizedPhone = phone.replace(/\D/g, '');
    const loginRef = ref(database, `login-statuses/${normalizedPhone}`);
    
    const unsubscribe = onValue(loginRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        console.log(`Real-time login status update for ${phone}:`, data);
        callback(data);
      }
    }, (error) => {
      console.error('Real-time login listener error:', error);
    });
    
    return unsubscribe;
  }
}

export { database };
