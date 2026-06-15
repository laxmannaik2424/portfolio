/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { PortfolioContent } from '@/lib/models';
import connectToDatabase from '@/lib/mongodb';

export async function GET() {
  try {
    await connectToDatabase();
    // Assuming there is only one settings document
    const content = await PortfolioContent.findOne();
    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }
    return NextResponse.json(content);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();

    // Since we only have one document, we just update the first one we find
    const content = await PortfolioContent.findOne();
    
    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    // Update document with new data
    // Deep merge or overwrite fields based on the payload structure
    // The payload should be the complete object from the client
    const updated = await PortfolioContent.findOneAndUpdate(
      { _id: content._id },
      { $set: data },
      { new: true }
    );

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
