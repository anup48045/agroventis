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

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await database.connect();

    const connections = await database.all(`
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
      WHERE bl.buyer_id = ? OR fl.farmer_id = ?
      ORDER BY c.created_at DESC
    `, [decoded.id, decoded.id]);

    return NextResponse.json(connections);

  } catch (error) {
    console.error('Connections fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch connections' },
      { status: 500 }
    );
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
    const { buyerListingId, farmerListingId } = body;

    await database.connect();

    // Verify user is authorized to create this connection
    const buyerListing = await database.get(
      'SELECT buyer_id FROM buyer_listings WHERE id = ?',
      [buyerListingId]
    );

    const farmerListing = await database.get(
      'SELECT farmer_id FROM farmer_listings WHERE id = ?',
      [farmerListingId]
    );

    if (!buyerListing || !farmerListing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    if (buyerListing.buyer_id !== decoded.id && farmerListing.farmer_id !== decoded.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Check if connection already exists
    const existingConnection = await database.get(
      'SELECT id FROM connections WHERE buyer_listing_id = ? AND farmer_listing_id = ?',
      [buyerListingId, farmerListingId]
    );

    if (existingConnection) {
      return NextResponse.json(
        { error: 'Connection already exists' },
        { status: 400 }
      );
    }

    // Create connection
    const result = await database.run(
      'INSERT INTO connections (buyer_listing_id, farmer_listing_id) VALUES (?, ?)',
      [buyerListingId, farmerListingId]
    );

    return NextResponse.json({
      message: 'Connection created successfully',
      connectionId: result.id
    });

  } catch (error) {
    console.error('Connection creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create connection' },
      { status: 500 }
    );
  }
}
