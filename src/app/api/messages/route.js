import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import database from '@/lib/database';

// Helper function to verify JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
  } catch (error) {
    return null;
  }
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

    const body = await request.json();
    const { receiverId, connectionId, messageText, messageType = 'text' } = body;

    await database.connect();

    // Verify sender is part of the connection
    if (connectionId) {
      const connection = await database.get(`
        SELECT c.*, bl.buyer_id, fl.farmer_id
        FROM connections c
        JOIN buyer_listings bl ON c.buyer_listing_id = bl.id
        JOIN farmer_listings fl ON c.farmer_listing_id = fl.id
        WHERE c.id = ? AND (bl.buyer_id = ? OR fl.farmer_id = ?)
      `, [connectionId, decoded.id, decoded.id]);

      if (!connection) {
        return NextResponse.json(
          { error: 'Connection not found or unauthorized' },
          { status: 404 }
        );
      }
    }

    // Create message
    const result = await database.run(
      'INSERT INTO messages (sender_id, receiver_id, connection_id, message_text, message_type) VALUES (?, ?, ?, ?, ?)',
      [decoded.id, receiverId, connectionId, messageText, messageType]
    );

    return NextResponse.json({
      message: 'Message sent successfully',
      messageId: result.id
    });

  } catch (error) {
    console.error('Message send error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
