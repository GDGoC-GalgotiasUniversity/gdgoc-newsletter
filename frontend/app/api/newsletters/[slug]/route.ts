import { connectDB } from '@/lib/mongodb';
import Newsletter from '@/lib/models/Newsletter';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    const { slug } = await params;
    const newsletter = await Newsletter.findOne({ slug });

    if (!newsletter) {
      return NextResponse.json(
        { success: false, error: 'Newsletter not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: newsletter });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch newsletter' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    const { slug } = await params;
    const body = await request.json();
    const { title, content, excerpt, author, featured } = body;

    const newsletter = await Newsletter.findOneAndUpdate(
      { slug },
      { title, content, excerpt, author, featured },
      { new: true, runValidators: true }
    );

    if (!newsletter) {
      return NextResponse.json(
        { success: false, error: 'Newsletter not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: newsletter });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update newsletter' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    const { slug } = await params;
    const newsletter = await Newsletter.findOneAndDelete({ slug });

    if (!newsletter) {
      return NextResponse.json(
        { success: false, error: 'Newsletter not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: newsletter });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete newsletter' },
      { status: 500 }
    );
  }
}
