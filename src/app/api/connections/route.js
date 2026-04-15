import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongoose';
import Connection from '@/models/Connection';
import BuyerListing from '@/models/BuyerListing';
import FarmerListing from '@/models/FarmerListing';
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

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get all connections where user is buyer OR farmer
    const connections = await Connection.find({
      $or: [
        { buyerId: getUserIdFromToken(decoded) },
        { farmerId: getUserIdFromToken(decoded) }
      ]
    })
      .populate({
        path: 'buyerId',
        select: 'name phone'
      })
      .populate({
        path: 'farmerId',
        select: 'name phone'
      })
      .populate({
        path: 'buyerListingId',
        populate: {
          path: 'productId',
          select: 'name category'
        }
      })
      .populate({
        path: 'farmerListingId',
        populate: {
          path: 'productId',
          select: 'name category'
        }
      })
      .sort({ createdAt: -1 });

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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { buyerListingId, farmerListingId } = await request.json();
    if (!buyerListingId || !farmerListingId) {
      return NextResponse.json({ error: 'Missing IDs' }, { status: 400 });
    }

    await connectDB();

    // Check listings exist
    const buyerListing = await BuyerListing.findById(buyerListingId);
    const farmerListing = await FarmerListing.findById(farmerListingId);

    if (!buyerListing || !farmerListing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Authorization check (user must be either buyer OR farmer)
    if (
      buyerListing.buyerId.toString() !== getUserIdFromToken(decoded) &&
      farmerListing.farmerId.toString() !== getUserIdFromToken(decoded)
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    if (buyerListing.productId.toString() !== farmerListing.productId.toString()) {
      return NextResponse.json(
        { error: 'Product mismatch between listings' },
        { status: 400 }
      );
    }
    // Check duplicate connection
    const existing = await Connection.findOne({
      buyerListingId,
      farmerListingId
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Connection already exists' },
        { status: 400 }
      );
    }

    // Create connection
    const connection = new Connection({
      buyerId: buyerListing.buyerId,
      farmerId: farmerListing.farmerId,
      buyerListingId,
      farmerListingId,
      productId: buyerListing.productId,
      status: 'pending'
    });

    await connection.save();

    return NextResponse.json({
      message: 'Connection created successfully',
      connection
    });

  } catch (error) {
    console.error('Connection creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create connection' },
      { status: 500 }
    );
  }
}