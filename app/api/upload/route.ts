/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

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
    // Note: Cloudinary handles video/image types automatically if resource_type is 'auto'
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
        // We do not fail the request if deletion fails, just log it.
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
