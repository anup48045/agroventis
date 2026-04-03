import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongoose';
import BuyerListing from '@/models/BuyerListing';
import User from '@/models/User';
import Product from '@/models/Product';

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

    await connectDB();

    // Fetch buyer listings with product details
    const listings = await BuyerListing.find({buyerId: decoded.id})
      .populate('productId', 'name category unit')
      .populate('buyerId', 'name phone location')
      .sort({ createdAt: -1 });

    return NextResponse.json(listings);

  } catch (error) {
    console.error('Buyer listings fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch buyer listings' },
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
    const { 
      productId, 
      quantityRequired, 
      maxPrice, 
      qualityRequirements, 
      deliveryLocation, 
      deliveryDate,
      expiresAt 
    } = body;

    await connectDB();

    // Create buyer listing
    const listing = new BuyerListing({
      buyerId: decoded.id,
      productId,
      quantityRequired,
      maxPrice,
      qualityRequirements,
      deliveryLocation,
      deliveryDate,
      expiresAt
    });

    await listing.save();

    // Populate product details for response
    await listing.populate('productId', 'name category unit');

    return NextResponse.json({
      message: 'Buyer listing created successfully',
      listing
    });

  } catch (error) {
    console.error('Buyer listing creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create buyer listing' },
      { status: 500 }
    );
  }
}
