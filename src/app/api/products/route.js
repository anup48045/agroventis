import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Product from '@/models/Product';
import Category from '@/models/Category';

export async function GET() {
  try {
    await connectDB();

    // Fetch all products and categories
    const products = await Product.find({}).sort({ name: 1 });
    const categories = await Category.find({}).sort({ name: 1 });

    return NextResponse.json({
      products,
      categories
    });

  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
