import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongoose';
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

export async function PUT(request, context) {
  try {
    const params = await context.params;
    const connectionId = params.id;
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status } = await request.json();

    await connectDB();

    // Find connection
    const connection = await Connection.findOne({
      _id: connectionId,
      $or: [
        { buyerId: decoded.id },
        { farmerId: decoded.id }
      ]
    });

    if (!connection) {
      return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
    }
    
    if (
      connection.buyerId.toString() !== decoded.id &&
      connection.farmerId.toString() !== decoded.id
    ) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
    }

    connection.status = status;
    await connection.save();
    
    await connection.populate([
      { path: 'buyerId', select: 'name phone' },
      { path: 'farmerId', select: 'name phone' }
    ]);
    // Check authorization (buyer or farmer)

    return NextResponse.json({
      message: 'Connection updated successfully',
      connection
    });

  } catch (error) {
    console.error('Connection update error:', error);
    return NextResponse.json({ error: 'Failed to update connection' }, { status: 500 });
  }
}

export async function GET(request, context) {
  try {
    const params = await context.params;
    const connectionId = params.id;
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const connection = await Connection.findById(connectionId)
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
      });

    if (!connection) {
      return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
    }

    // Authorization check
    if (
      connection.buyerId._id.toString() !== decoded.id &&
      connection.farmerId._id.toString() !== decoded.id
    ) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
    }

    return NextResponse.json(connection);

  } catch (error) {
    console.error('Connection fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch connection' }, { status: 500 });
  }
}