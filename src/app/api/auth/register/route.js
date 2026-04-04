import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import { auth } from '@/lib/firebase';

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, phone, email, password, userType, state, district, village, pincode, languagePreference, company, city, idToken } = body;

    console.log('Register API: Received registration request:', { 
      name, 
      phone, 
      email, 
      userType, 
      hasPassword: !!password, 
      hasIdToken: !!idToken,
      languagePreference,
      company,
      city
    });

    // Support both Firebase OTP and traditional password registration
    if (idToken) {
      // Firebase OTP registration
      console.log('Register API: Processing Firebase OTP registration');
      
      const decodedToken = await auth.verifyIdToken(idToken);
      const { uid, phone_number } = decodedToken;

      console.log('Firebase token decoded:', { uid, phone_number });

      // Normalize phone numbers for comparison
      const normalizePhone = (phone) => {
        if (!phone) return '';
        // Remove all non-digit characters
        const cleaned = phone.replace(/\D/g, '');
        // Remove leading + if present
        return cleaned.startsWith('91') ? cleaned.substring(2) : cleaned;
      };

      const normalizedFirebasePhone = normalizePhone(phone_number);
      const normalizedFormPhone = normalizePhone(phone);

      console.log('Phone comparison:', {
        firebasePhone: phone_number,
        formPhone: phone,
        normalizedFirebase: normalizedFirebasePhone,
        normalizedForm: normalizedFormPhone
      });

      if (normalizedFirebasePhone !== normalizedFormPhone) {
        console.log('Register API: Phone number mismatch detected');
        return NextResponse.json(
          { error: 'Phone number mismatch. Please use the same phone number for OTP and registration.' },
          { status: 400 }
        );
      }

      // Check if user already exists
      const existingUser = await User.findOne({ 
        $or: [
          { firebaseUid: uid },
          { phone: phone }
        ]
      });
      
      if (existingUser) {
        console.log('Register API: User already exists for phone:', phone);
        return NextResponse.json(
          { error: 'User with this phone number already exists' },
          { status: 400 }
        );
      }

      // Create user with Firebase UID
      const user = new User({
        name,
        phone,
        email,
        firebaseUid: uid,
        userType,
        state,
        district,
        village,
        pincode,
        languagePreference: languagePreference || 'en',
        isPhoneVerified: true,
        isVerified: true,
        company: userType === 'buyer' ? company : undefined,
        city: userType === 'buyer' ? city : undefined
      });

      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user._id, 
          phone: user.phone, 
          userType: user.userType,
          firebaseUid: user.firebaseUid
        },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '7d' }
      );

      const userResponse = user.toObject();
      delete userResponse.password;

      console.log('Register API: Firebase registration successful for user:', userResponse);

      return NextResponse.json({
        message: 'User registered successfully',
        user: userResponse,
        token
      });

    } else {
      // Traditional password registration (backward compatibility)
      if (!name || !phone || !password || !userType) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }

      // Validate user type
      if (!['farmer', 'buyer'].includes(userType)) {
        return NextResponse.json(
          { error: 'Invalid user type' },
          { status: 400 }
        );
      }

      // Check if user already exists
      const existingUser = await User.findOne({ phone });
      if (existingUser) {
        console.log('Register API: User already exists for phone:', phone);
        return NextResponse.json(
          { error: 'User with this phone number already exists' },
          { status: 400 }
        );
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const user = new User({
        name,
        phone,
        email,
        password: hashedPassword,
        userType,
        state,
        district,
        village,
        pincode,
        languagePreference: languagePreference || 'en',
        company: userType === 'buyer' ? company : undefined,
        city: userType === 'buyer' ? city : undefined
      });

      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user._id, 
          phone: user.phone, 
          userType: user.userType 
        },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '7d' }
      );

      const userResponse = user.toObject();
      delete userResponse.password;

      console.log('Register API: Password registration successful for user:', userResponse);

      return NextResponse.json({
        message: 'User registered successfully',
        user: userResponse,
        token
      });
    }

  } catch (error) {
    console.error('Registration API error:', error);
    
    if (error.code === 'auth/id-token-expired') {
      return NextResponse.json(
        { error: 'Token expired. Please request new OTP.' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}
