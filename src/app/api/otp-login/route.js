import { NextResponse } from "next/server";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongoose";

export async function POST(req) {
  try {
    await connectDB();

    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json(
        { error: "Phone is required" },
        { status: 400 }
      );
    }

    // Normalize phone (remove +91)
    const normalizedPhone = phone.replace("+91", "");

    let user = await User.findOne({ phone: normalizedPhone });

    if (!user) {
      user = await User.create({ phone: normalizedPhone });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined");
    }

    const token = jwt.sign(
      { id: user._id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      message: "Login successful",
      token,
      user
    });

  } catch (error) {
    console.error("OTP Login Error:", error);

    return NextResponse.json(
      { error: "Failed to login" },
      { status: 500 }
    );
  }
}