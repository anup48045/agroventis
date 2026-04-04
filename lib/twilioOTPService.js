import twilio from 'twilio';
import { twilioConfig } from './twilioConfig';
import { OTPStore } from './otpStore';

export class TwilioOTPService {
  // Initialize Twilio client
  static getClient() {
    try {
      console.log('🔍 Twilio Service - Using Config:');
      console.log('Account SID:', twilioConfig.accountSid.substring(0, 10) + '...');
      console.log('Auth Token:', twilioConfig.authToken ? 'Found' : 'Not found');
      
      if (!twilioConfig.accountSid || !twilioConfig.authToken) {
        console.warn('Twilio credentials not found in config');
        return null;
      }
      
      return twilio(twilioConfig.accountSid, twilioConfig.authToken);
    } catch (error) {
      console.error('Twilio client initialization error:', error);
      return null;
    }
  }

  // Generate 6-digit OTP
  static generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Store OTP with expiration (file-based)
  static storeOTP(phone, otp) {
    return OTPStore.storeOTP(phone, otp);
  }

  // Verify OTP (file-based)
  static verifyOTP(phone, enteredOTP) {
    return OTPStore.verifyOTP(phone, enteredOTP);
  }

  // Send OTP via Twilio SMS
  static async sendOTP(phone, otp) {
    // Check if we're in development mode and should skip real SMS
    const isDevelopment = process.env.NODE_ENV === 'development' && 
                         process.env.SKIP_TWILIO_SMS === 'true';
    
    if (isDevelopment) {
      console.log(`🔧 Development mode: OTP ${otp} stored for ${phone} (SMS skipped)`);
      return { 
        success: true, 
        message: 'OTP generated successfully (development mode)',
        development: true,
        otp: otp // Return OTP for auto-fill in development
      };
    }

    const client = this.getClient();
    
    if (!client) {
      console.error('❌ Twilio client not available, falling back to development mode');
      // Fallback to development mode if Twilio client fails
      return { 
        success: true, 
        message: 'OTP generated successfully (fallback mode)',
        development: true,
        otp: otp // Return OTP for testing
      };
    }
    
    try {
      const fromNumber = twilioConfig.phoneNumber;
      if (!fromNumber) {
        throw new Error('Twilio phone number not configured');
      }
      
      // Format phone number for Twilio (add +91 if not present)
      let formattedPhone = phone;
      if (!phone.startsWith('+')) {
        formattedPhone = `+91${phone}`;
      }
      
      const message = await client.messages.create({
        body: `Your AgroVentis OTP is: ${otp}. Valid for 30 minutes. Do not share this OTP.`,
        from: fromNumber,
        to: formattedPhone
      });
      
      console.log(`✅ Real Twilio SMS sent to ${formattedPhone}: SID ${message.sid}`);
      
      return { 
        success: true, 
        message: 'OTP sent successfully via real SMS',
        sid: message.sid,
        development: false
      };
      
    } catch (error) {
      console.error('❌ Twilio SMS error:', error);
      console.log('🔧 Falling back to development mode due to SMS error');
      
      // Fallback to development mode on SMS failure
      return { 
        success: true, 
        message: 'OTP generated successfully (fallback mode)',
        development: true,
        otp: otp // Return OTP for testing
      };
    }
  }
}
