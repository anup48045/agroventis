import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, phone, email, password, userType, state, district, village, pincode, languagePreference, company, city } = body;

    console.log('Register API: Received registration request:', { ...body, password: '[HIDDEN]' });

    // Validate required fields
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

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    console.log('Register API: Registration successful for user:', userResponse);

    return NextResponse.json({
      message: 'User registered successfully',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}
