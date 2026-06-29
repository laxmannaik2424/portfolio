/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

// Generate signature for direct client-side upload to Cloudinary
// This bypasses Vercel's strict 4.5MB serverless payload limit for videos!
export async function GET() {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder: 'squidwod_portfolio' },
      process.env.CLOUDINARY_API_SECRET as string
    );
    
    return NextResponse.json({
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Route to delete an old asset
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'No publicId provided' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const oldPublicId = formData.get('oldPublicId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to base64 for Cloudinary upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload new file to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(base64Data, {
      folder: 'squidwod_portfolio',
      resource_type: 'auto',
    });

    // Delete old file if a public_id was provided
    if (oldPublicId && oldPublicId.trim() !== '') {
      try {
        await cloudinary.uploader.destroy(oldPublicId);
        console.log(`Deleted old asset: ${oldPublicId}`);
      } catch (delError) {
        console.error('Failed to delete old asset:', delError);
      }
    }

    return NextResponse.json({
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
    });

  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
