import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongoose';
import FarmerListing from '@/models/FarmerListing';
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

    let listings;
     
    if (decoded.userType === 'farmer') {
      listings = await FarmerListing.find({ farmerId: decoded.id });
    } else {
      listings = await FarmerListing.find();
    }

    listings = await FarmerListing.populate(listings, [
      { path: 'productId', select: 'name category unit' },
      { path: 'farmerId', select: 'name phone location' }
    ]);

    listings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json(listings);

  } catch (error) {
    console.error('Farmer listings fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch farmer listings' },
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
      quantityAvailable, 
      askingPrice, 
      qualityDescription, 
      harvestDate, 
      location, 
      expiresAt 
    } = body;

    await connectDB();

    // Create farmer listing
    const listing = new FarmerListing({
      farmerId: decoded.id,
      productId,
      quantityAvailable,
      askingPrice,
      qualityDescription,
      harvestDate,
      location,
      expiresAt
    });

    await listing.save();

    // Populate product details for response
    await listing.populate('productId', 'name category unit');

    return NextResponse.json({
      message: 'Farmer listing created successfully',
      listing
    });

  } catch (error) {
    console.error('Farmer listing creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create farmer listing' },
      { status: 500 }
    );
  }
}
