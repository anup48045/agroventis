import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import { TwilioOTPService } from '@/lib/twilioOTPService';

export async function POST(request) {
  try {
    // Set a timeout for the entire request
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 30000); // 30 second timeout
    });

    const mainOperation = async () => {
      await connectDB();

      // Parse JSON with error handling
      let body;
      try {
        body = await request.json();
      } catch (jsonError) {
        console.error('JSON Parse Error:', jsonError);
        return NextResponse.json(
          { error: 'Invalid request format' },
          { status: 400 }
        );
      }

      const { phone, otp, userData } = body;
      
      console.log('🔍 Verify OTP Request:', { phone, otp: otp ? '***' : 'missing', userData: userData ? 'present' : 'missing' });
      
      if (!phone || !otp) {
        return NextResponse.json(
          { error: 'Phone number and OTP are required' },
          { status: 400 }
        );
      }

      // Verify OTP
      const verification = TwilioOTPService.verifyOTP(phone, otp);
      
      if (!verification.valid) {
        return NextResponse.json(
          { error: verification.message },
          { status: 400 }
        );
      }

      console.log(`✅ Twilio OTP verified for ${phone}`);

      // For login: find existing user with retry logic
      if (!userData) {
        let user;
        let retries = 3;
        
        while (retries > 0) {
          try {
            user = await User.findOne({ phone: phone.replace(/\D/g, '') });
            break; // Success, exit retry loop
          } catch (dbError) {
            console.error(`Database query error (retries left: ${retries - 1}):`, dbError);
            retries--;
            if (retries === 0) throw dbError;
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms before retry
          }
        }
        
        if (!user) {
          console.log('❌ User not found, creating new user for login...');
          
          // Auto-register user for login flow with retry
          let newUser;
          retries = 3;
          
          while (retries > 0) {
            try {
              newUser = new User({
                name: 'User ' + phone.slice(-4), // Default name
                phone: phone.replace(/\D/g, ''),
                email: '', // Empty email
                userType: 'farmer', // Default type
                state: '',
                district: '',
                village: '',
                pincode: '',
                languagePreference: 'en',
                isPhoneVerified: true,
                isVerified: true
              });

              await newUser.save();
              console.log('✅ Auto-registered user for login:', newUser._id);
              break; // Success, exit retry loop
            } catch (saveError) {
              console.error(`User creation error (retries left: ${retries - 1}):`, saveError);
              retries--;
              if (retries === 0) throw saveError;
              await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms before retry
            }
          }

          // Generate JWT token
          const token = jwt.sign(
            { 
              userId: newUser._id, 
              phone: newUser.phone, 
              userType: newUser.userType 
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
          );

          return NextResponse.json({
            success: true,
            message: 'Login successful (auto-registered)',
            user: {
              _id: newUser._id,
              name: newUser.name,
              phone: newUser.phone,
              email: newUser.email,
              userType: newUser.userType,
              isPhoneVerified: newUser.isPhoneVerified
            },
            token
          });
        }

        // Update phone verification status with retry
        let updateRetries = 3;
        while (updateRetries > 0) {
          try {
            user.isPhoneVerified = true;
            await user.save();
            break; // Success, exit retry loop
          } catch (saveError) {
            console.error(`User update error (retries left: ${updateRetries - 1}):`, saveError);
            updateRetries--;
            if (updateRetries === 0) throw saveError;
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms before retry
          }
        }

        // Generate JWT token
        const token = jwt.sign(
          { 
            userId: user._id, 
            phone: user.phone, 
            userType: user.userType 
          },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        );

        return NextResponse.json({
          success: true,
          message: 'Login successful',
          user: {
            _id: user._id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            userType: user.userType,
            isPhoneVerified: user.isPhoneVerified
          },
          token
        });
      }

      // For registration: create new user with retry logic
      const { name, email, userType, state, district, village, pincode, languagePreference, company, city } = userData;

      console.log('🔍 Registration Data:', { 
        name, 
        email, 
        userType, 
        state, 
        district, 
        village, 
        pincode, 
        languagePreference, 
        company, 
        city,
        phone: phone.replace(/\D/g, '')
      });

      // Check if user already exists with retry
      let existingUser;
      let checkRetries = 3;
      
      while (checkRetries > 0) {
        try {
          existingUser = await User.findOne({ 
            $or: [
              { phone: phone.replace(/\D/g, '') },
              { email: email }
            ]
          });
          break; // Success, exit retry loop
        } catch (dbError) {
          console.error(`Database query error (retries left: ${checkRetries - 1}):`, dbError);
          checkRetries--;
          if (checkRetries === 0) throw dbError;
          await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms before retry
        }
      }
      
      if (existingUser) {
        console.log('❌ User already exists:', existingUser.phone);
        return NextResponse.json(
          { error: 'User with this phone number or email already exists' },
          { status: 400 }
        );
      }

      // Create new user with retry
      let newUser;
      let createRetries = 3;
      
      while (createRetries > 0) {
        try {
          newUser = new User({
            name,
            phone: phone.replace(/\D/g, ''),
            email,
            userType,
            state,
            district,
            village,
            pincode,
            languagePreference: languagePreference || 'en',
            company: userType === 'buyer' ? company : undefined,
            city: userType === 'buyer' ? city : undefined,
            isPhoneVerified: true,
            isVerified: true
          });

          await newUser.save();
          console.log('✅ New user created successfully:', newUser._id);
          break; // Success, exit retry loop
        } catch (saveError) {
          console.error(`User creation error (retries left: ${createRetries - 1}):`, saveError);
          createRetries--;
          if (createRetries === 0) throw saveError;
          await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms before retry
        }
      }

      console.log('✅ New user created successfully with Twilio OTP verification');

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: newUser._id, 
          phone: newUser.phone, 
          userType: newUser.userType 
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return NextResponse.json({
        success: true,
        message: 'Registration successful',
        user: {
          _id: newUser._id,
          name: newUser.name,
          phone: newUser.phone,
          email: newUser.email,
          userType: newUser.userType,
          isPhoneVerified: newUser.isPhoneVerified
        },
        token
      });
    };

    // Race between timeout and main operation
    const result = await Promise.race([mainOperation(), timeoutPromise]);
    return result;

  } catch (error) {
    console.error('Twilio verify-otp error:', error);
    
    // Handle specific error types
    if (error.message === 'Request timeout') {
      return NextResponse.json(
        { error: 'Request timed out. Please try again.' },
        { status: 408 }
      );
    }
    
    if (error.name === 'MongoNetworkError' || error.message.includes('ECONNRESET')) {
      return NextResponse.json(
        { error: 'Database connection error. Please try again.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}