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

export async function GET(request, { params }) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const connectionId = params.connectionId;

    await database.connect();

    // Verify user is part of this connection
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

    const messages = await database.all(`
      SELECT m.*, u.name as sender_name
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.connection_id = ?
      ORDER BY m.created_at ASC
    `, [connectionId]);

    return NextResponse.json(messages);

  } catch (error) {
    console.error('Messages fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
