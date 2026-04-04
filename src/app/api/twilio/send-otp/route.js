import { NextResponse } from 'next/server';
import { TwilioOTPService } from '@/lib/twilioOTPService';
import { twilioConfig } from '@/lib/twilioConfig';

console.log('🔍 API Route - Using Twilio Config:');
console.log('Account SID:', twilioConfig.accountSid.substring(0, 10) + '...');
console.log('Phone Number:', twilioConfig.phoneNumber);

export async function POST(request) {
  try {
    const { phone } = await request.json();
    
    if (!phone || phone.length < 10) {
      return NextResponse.json(
        { error: 'Valid phone number is required' },
        { status: 400 }
      );
    }

    // Check Twilio config
    if (!twilioConfig.accountSid || !twilioConfig.authToken || !twilioConfig.phoneNumber) {
      console.error('❌ Missing Twilio configuration');
      return NextResponse.json(
        { error: 'Twilio credentials not configured properly' },
        { status: 500 }
      );
    }

    // Generate OTP
    const otp = TwilioOTPService.generateOTP();
    
    // Store OTP
    TwilioOTPService.storeOTP(phone, otp);
    
    // Send OTP via Twilio
    const result = await TwilioOTPService.sendOTP(phone, otp);
    
    if (result.success) {
      console.log(`✅ Twilio OTP sent to ${phone}: ${otp}`);
      
      return NextResponse.json({
        success: true,
        message: result.message,
        development: result.development || false,
        // In development, return OTP for testing
        ...(result.development && { otp })
      });
    } else {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Twilio send-otp error:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
