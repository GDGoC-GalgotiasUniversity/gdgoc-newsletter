import { connectDB } from '@/lib/mongodb';
import Newsletter from '@/lib/models/Newsletter';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const newsletters = await Newsletter.find()
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Newsletter.countDocuments();

    return NextResponse.json({
      success: true,
      data: newsletters,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch newsletters' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { title, content, excerpt, author } = body;

    if (!title || !content || !excerpt || !author) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const newsletter = await Newsletter.create({
      title,
      slug,
      content,
      excerpt,
      author,
    });

    return NextResponse.json(
      { success: true, data: newsletter },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create newsletter' },
      { status: 500 }
    );
  }
}
