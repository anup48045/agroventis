import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { phone, password, userType } = body;

    console.log('Login API: Received login request for phone:', phone);

    // Validate required fields
    if (!phone || !password) {
      return NextResponse.json(
        { error: 'Phone number and password are required' },
        { status: 400 }
      );
    }

    // Format phone number (remove special characters)
    const formattedPhone = phone.replace(/\D/g, '');

    // Find user by phone and user type
    const user = await User.findOne({ 
      phone: formattedPhone,
      userType: userType || 'farmer'
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found. Please register first.' },
        { status: 404 }
      );
    }

    // Check if user has password 
    if (!user.password) {
      return NextResponse.json(
        { error: 'Account not set up for password login. Please use OTP login.' },
        { status: 400 }
      );
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid phone number or password' },
        { status: 401 }
      );
    }

    console.log('Login API: Password verified for user:', user.phone);

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        phone: user.phone, 
        userType: user.userType
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove sensitive fields from response
    const userResponse = user.toObject();
    delete userResponse.password;

    console.log('Login API: Login successful for user:', userResponse.phone);

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}
