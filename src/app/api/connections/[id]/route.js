import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
// import database from '@/lib/database';

// Helper function to verify JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
  } catch (error) {
    return null;
  }
}

export async function PUT(request, { params }) {
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
    const { status } = body;
    const connectionId = params.id;

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

    // Update connection status
    const result = await database.run(
      'UPDATE connections SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, connectionId]
    );

    return NextResponse.json({
      message: 'Connection updated successfully',
      changes: result.changes
    });

  } catch (error) {
    console.error('Connection update error:', error);
    return NextResponse.json(
      { error: 'Failed to update connection' },
      { status: 500 }
    );
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

    const connectionId = params.id;

    await database.connect();

    const connection = await database.get(`
      SELECT c.*, 
             bl.buyer_id, u_buyer.name as buyer_name, u_buyer.phone as buyer_phone,
             fl.farmer_id, u_farmer.name as farmer_name, u_farmer.phone as farmer_phone,
             p.name as product_name, p.category
      FROM connections c
      JOIN buyer_listings bl ON c.buyer_listing_id = bl.id
      JOIN farmer_listings fl ON c.farmer_listing_id = fl.id
      JOIN users u_buyer ON bl.buyer_id = u_buyer.id
      JOIN users u_farmer ON fl.farmer_id = u_farmer.id
      JOIN products p ON bl.product_id = p.id
      WHERE c.id = ? AND (bl.buyer_id = ? OR fl.farmer_id = ?)
    `, [connectionId, decoded.id, decoded.id]);

    if (!connection) {
      return NextResponse.json(
        { error: 'Connection not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(connection);

  } catch (error) {
    console.error('Connection fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch connection' },
      { status: 500 }
    );
  }
}
