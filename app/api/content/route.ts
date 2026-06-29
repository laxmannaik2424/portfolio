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
    if (!content) {
      // Auto-seed if it doesn't exist so the admin panel doesn't crash
      content = new PortfolioContent({
        hero: { heading: "Welcome", subheading: "Update this text in admin panel" },
        about: { title: "About", description: "", text: "", image: "", stats: [] },
        works: { title: "Works", description: "", list: [] },
        services: { title: "Services", description: "", list: [] },
        exhibitions: { title: "Exhibitions", description: "", list: [] },
        footer: { text: "© 2026", email: "", phone: "", address: "" },
        socials: { instagram: "", whatsapp: "", youtube: "" }
      });
      await content.save();
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
