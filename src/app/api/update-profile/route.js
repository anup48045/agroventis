import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import User from '@/models/User'

export async function PUT(req) {
  try {
    await connectDB()

    const body = await req.json()
    const { userId, ...updateData } = body

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    )

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      message: 'Profile updated',
      user: updatedUser
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}