import fs from 'fs';
import path from 'path';

const OTP_FILE = path.join(process.cwd(), 'otp-store.json');

// File-based OTP storage
export class OTPStore {
  static loadStore() {
    try {
      if (fs.existsSync(OTP_FILE)) {
        const data = fs.readFileSync(OTP_FILE, 'utf8');
        return JSON.parse(data);
      }
      return {};
    } catch (error) {
      console.error('Error loading OTP store:', error);
      return {};
    }
  }

  static saveStore(store) {
    try {
      fs.writeFileSync(OTP_FILE, JSON.stringify(store, null, 2));
    } catch (error) {
      console.error('Error saving OTP store:', error);
    }
  }

  static storeOTP(phone, otp) {
    const store = this.loadStore();
    const key = phone.replace(/\D/g, '');
    const expiresAt = Date.now() + 30 * 60 * 1000; // 30 minutes (extended for more time)
    
    store[key] = {
      otp,
      expiresAt,
      attempts: 0,
      createdAt: Date.now()
    };
    
    this.saveStore(store);
    
    console.log(`🔐 OTP stored for ${phone}: ${otp}`);
    console.log(`📊 Current OTP store size: ${Object.keys(store).length}`);
    console.log(`📋 Stored OTPs:`, Object.keys(store));
    console.log(`⏰ OTP expires at: ${new Date(expiresAt).toLocaleTimeString()}`);
    
    // Debug: Immediately verify the OTP was stored correctly
    setTimeout(() => {
      const testStore = this.loadStore();
      const testData = testStore[key];
      if (testData) {
        const timeLeft = testData.expiresAt - Date.now();
        const minutesLeft = Math.floor(timeLeft / (1000 * 60));
        console.log(`✅ OTP verification test: ${minutesLeft} minutes remaining`);
      } else {
        console.log(`❌ OTP verification test: OTP not found after storage`);
      }
    }, 1000); // Check after 1 second
    
    return otp;
  }

  static verifyOTP(phone, enteredOTP) {
    const store = this.loadStore();
    const key = phone.replace(/\D/g, '');
    const storedData = store[key];
    
    console.log(`🔍 Verifying OTP for ${phone}:`);
    console.log(`📋 Looking for key: ${key}`);
    console.log(`📊 Available keys:`, Object.keys(store));
    console.log(`📋 Stored data:`, storedData);
    
    if (!storedData) {
      console.log(`❌ OTP not found for ${phone}`);
      return { valid: false, message: 'OTP not found or expired' };
    }
    
    // Check expiration with detailed logging
    const now = Date.now();
    const timeLeft = storedData.expiresAt - now;
    const minutesLeft = Math.floor(timeLeft / (1000 * 60));
    const secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    console.log(`⏰ Current time: ${new Date(now).toLocaleTimeString()}`);
    console.log(`⏰ Expires at: ${new Date(storedData.expiresAt).toLocaleTimeString()}`);
    console.log(`⏰ Time left: ${minutesLeft}:${secondsLeft.toString().padStart(2, '0')}`);
    
    if (now > storedData.expiresAt) {
      console.log(`❌ OTP expired for ${phone} (was ${Math.abs(minutesLeft)} minutes ago)`);
      delete store[key];
      this.saveStore(store);
      return { valid: false, message: 'OTP expired' };
    }
    
    // Check attempts
    if (storedData.attempts >= 3) {
      console.log(`❌ Too many attempts for ${phone}`);
      delete store[key];
      this.saveStore(store);
      return { valid: false, message: 'Too many attempts' };
    }
    
    // Increment attempts
    storedData.attempts++;
    
    // Verify OTP
    if (storedData.otp === enteredOTP) {
      console.log(`✅ OTP verified successfully for ${phone}`);
      delete store[key];
      this.saveStore(store);
      return { valid: true, message: 'OTP verified successfully' };
    }
    
    console.log(`❌ Invalid OTP for ${phone}. Expected: ${storedData.otp}, Got: ${enteredOTP}`);
    this.saveStore(store);
    return { valid: false, message: `Invalid OTP. ${3 - storedData.attempts} attempts remaining` };
  }

  static cleanupExpiredOTPs() {
    const store = this.loadStore();
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, data] of Object.entries(store)) {
      if (now > data.expiresAt) {
        delete store[key];
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      this.saveStore(store);
      console.log(`🧹 Cleaned up ${cleaned} expired OTPs`);
    }
  }
}

// Auto-cleanup every 5 minutes
setInterval(() => {
  OTPStore.cleanupExpiredOTPs();
}, 5 * 60 * 1000);
