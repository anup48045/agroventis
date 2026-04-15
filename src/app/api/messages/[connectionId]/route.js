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

export async function GET(request, context) {
  try {
    const params = await context.params;
    const connectionId = params.connectionId;
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }


    await connectDB();

    // ✅ Check if connection exists and user is part of it
    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return NextResponse.json(
        { error: 'Connection not found' },
        { status: 404 }
      );
    }

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

    // ✅ Fetch messages
    const messages = await Message.find({ connectionId })
      .populate('senderId', 'name')
      .sort({ createdAt: 1 });

    // ✅ Format response (important for your frontend)
    const formattedMessages = messages.map((msg) => ({
      _id: msg._id,
      sender_name: msg.senderId?.name || 'Unknown',
      message_text: msg.messageText,
      created_at: msg.createdAt,
      isOwnMessage: msg.senderId?._id.toString() === getUserIdFromToken(decoded)
    }));

    return NextResponse.json(formattedMessages);

  } catch (error) {
    console.error('Messages fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}