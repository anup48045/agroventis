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

    let listings;

    if (decoded.userType === 'buyer') {
      // Buyer → only their listings
      listings = await BuyerListing.find({ buyerId: getUserIdFromToken(decoded) });
    } else {
      // Farmer → see all buyer listings
      listings = await BuyerListing.find();
    }

    listings = await BuyerListing.populate(listings, [
      { path: 'productId', select: 'name category unit' },
      { path: 'buyerId', select: 'name phone location' }
    ]);

    listings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json(listings);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
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
