import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongoose';
import Message from '@/models/Message';
import Connection from '@/models/Connection';
import User from '@/models/User';

// Verify JWT
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
  } catch {
    return null;
  }
}

// Helper function to get user ID from token (handles both id and userId)
function getUserIdFromToken(decoded) {
  return decoded.id || decoded.userId || decoded._id;
}

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { receiverId, connectionId, messageText } = await request.json();

    if (!messageText?.trim()) {
      return NextResponse.json(
        { error: 'Message cannot be empty' },
        { status: 400 }
      );
    }

    await connectDB();

    // ✅ Check connection exists
    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return NextResponse.json(
        { error: 'Connection not found' },
        { status: 404 }
      );
    }

    // Verify sender is part of connection
    const userId = getUserIdFromToken(decoded);
    const isAuthorized =
      connection.buyerId.toString() === userId ||
      connection.farmerId.toString() === userId;

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // ✅ Optional: validate receiver
    if (receiverId) {
      const receiver = await User.findById(receiverId);
      if (!receiver) {
        return NextResponse.json(
          { error: 'Receiver not found' },
          { status: 404 }
        );
      }
    }

    // Create message
    const message = new Message({
      senderId: userId,
      receiverId,
      connectionId,
      messageText
    });

    await message.save();

    // ✅ Populate sender name for frontend
    await message.populate('senderId', 'name');

    return NextResponse.json({
      message: 'Message sent successfully',
      data: {
        _id: message._id,
        sender_name: message.senderId.name,
        message_text: message.messageText,
        created_at: message.createdAt
      }
    });

  } catch (error) {
    console.error('Message send error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}