/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { PortfolioContent } from '@/lib/models';
import connectToDatabase from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    // Assuming there is only one settings document
    let content = await PortfolioContent.findOne();
    const defaultData = {
        hero: { 
          topSubheading: "AN AWARD-WINNING\nPHOTOGRAPHER", 
          signatureSubtext: "SCROLL\nMORE",
          mediaUrl: "" 
        },
        about: { title: "About Me", description: "Artist description...", mediaList: [] },
        works: { year: "2024", title: "My Works", description: "", grids: [] },
        services: { description: "My Services", list: [] },
        exhibitions: { year: "2024", title: "Exhibitions", description: "", list: [] },
        footer: { email: "hello@example.com", mobile: "+91 0000000000", mediaUrl: "" },
        socials: { instagram: "https://instagram.com", whatsapp: "https://wa.me/910000000000" }
    };

    if (!content) {
      // Auto-seed if it doesn't exist so the admin panel doesn't crash
      content = new PortfolioContent(defaultData);
      await content.save();
    } else {
      // Patch any missing fields from the previous bad seed
      let modified = false;
      Object.keys(defaultData).forEach((key) => {
        if (!content[key]) {
          content[key] = (defaultData as any)[key];
          modified = true;
        }
      });
      if (modified) {
        await content.save();
      }
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
    let content = await PortfolioContent.findOne();
    
    if (!content) {
      content = new PortfolioContent(data);
      await content.save();
      return NextResponse.json(content);
    }

    // Update document with new data
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
