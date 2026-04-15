import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      name,
      phone,
      email,
      password,
      userType,
      state,
      district,
      village,
      pincode,
      languagePreference,
      company,
      city
    } = body;

    console.log('Register API: Request received for phone:', phone);

    // -----------------------------
    // VALIDATION
    // -----------------------------
    if (!name || !phone || !password || !userType) {
      return NextResponse.json(
        { error: 'Name, phone, password, and userType are required' },
        { status: 400 }
      );
    }

    if (!['farmer', 'buyer'].includes(userType)) {
      return NextResponse.json(
        { error: 'Invalid user type' },
        { status: 400 }
      );
    }

    // -----------------------------
    // HASH PASSWORD
    // -----------------------------
    const hashedPassword = await bcrypt.hash(password, 12);

    console.log('Register API: Password hashed for:', phone);

    // -----------------------------
    // CHECK EXISTING USER
    // -----------------------------
    const existingUser = await User.findOne({ phone });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this phone number' },
        { status: 409 }
      );
    }

    // -----------------------------
    // CREATE USER
    // -----------------------------
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
      city: userType === 'buyer' ? city : undefined,
      isPhoneVerified: true,
      isVerified: true
    });

    await user.save();

    // -----------------------------
    // GENERATE JWT TOKEN
    // -----------------------------
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const token = jwt.sign(
      {
        id: user._id,
        phone: user.phone,
        userType: user.userType
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // -----------------------------
    // CLEAN RESPONSE
    // -----------------------------
    const userResponse = user.toObject();
    delete userResponse.password;

    console.log('Register API: User created successfully:', phone);

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Register API error:', error);

    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}