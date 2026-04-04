import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import { auth } from '@/lib/firebase';

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { idToken } = body;

    console.log('Login API: Received Firebase ID token');

    // Validate required fields
    if (!idToken) {
      return NextResponse.json(
        { error: 'Firebase ID token is required' },
        { status: 400 }
      );
    }

    // Verify Firebase ID token
    const decodedToken = await auth.verifyIdToken(idToken);
    const { uid, phone_number } = decodedToken;

    if (!phone_number) {
      return NextResponse.json(
        { error: 'Phone number not found in Firebase token' },
        { status: 400 }
      );
    }

    console.log('Login API: Firebase token verified for phone:', phone_number);

    // Find user by Firebase UID or phone
    let user = await User.findOne({ 
      $or: [
        { firebaseUid: uid },
        { phone: phone_number }
      ]
    });

    // If user doesn't exist, create one (auto-registration)
    if (!user) {
      console.log('Login API: Creating new user for phone:', phone_number);
      
      user = new User({
        firebaseUid: uid,
        phone: phone_number,
        name: `User ${phone_number.slice(-4)}`, // Default name
        userType: 'farmer', // Default type
        isPhoneVerified: true,
        isVerified: true
      });

      await user.save();
      console.log('Login API: New user created successfully');
    } else {
      // Update existing user with Firebase UID if missing
      if (!user.firebaseUid) {
        user.firebaseUid = uid;
        user.isPhoneVerified = true;
        await user.save();
      }
    }

    // Generate JWT token (same as before)
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

    // Remove sensitive fields from response
    const userResponse = user.toObject();
    delete userResponse.password;

    console.log('Login API: Firebase login successful for user:', userResponse);

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Login API error:', error);
    
    if (error.code === 'auth/id-token-expired') {
      return NextResponse.json(
        { error: 'Token expired. Please request new OTP.' },
        { status: 401 }
      );
    }
    
    if (error.code === 'auth/id-token-revoked') {
      return NextResponse.json(
        { error: 'Token revoked. Please request new OTP.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}
