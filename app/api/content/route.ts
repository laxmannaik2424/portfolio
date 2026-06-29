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
      // Patch any missing fields from the previous bad seed safely
      let modified = false;
      Object.keys(defaultData).forEach((key) => {
        // Mongoose documents can be safely checked using .get()
        if (!content.get(key) || Object.keys(content.get(key)).length === 0) {
          content.set(key, (defaultData as any)[key]);
          modified = true;
        }
      });
      if (modified) {
        try {
          await content.save();
        } catch (saveErr) {
          console.error("Failed to save patched document", saveErr);
          // Continue anyway to serve the patched in-memory document to the client!
        }
      }

      // ----------------------------------------------------
      // FORCED SEED TO MATCH EXACT LANDING PAGE TEXT
      // ----------------------------------------------------
      const needsHeroUpdate = content.hero?.topSubheading !== "AN AWARD-WINNING\nPHOTOGRAPHER WHOSE LENS\nTRANSFORMS MOMENTS INTO\nTIMELESS MASTERPIECES";
      const needsAboutUpdate = content.about?.description !== "DISTINGUISHED BY A MYRIAD OF\nACCOLADES AND INTERNATIONAL\nRECOGNITION, I STAND\nAS A LUMINARY IN THE REALM OF\nVISUAL STORYTELLING";
      const needsExhibitionsUpdate = content.exhibitions?.description !== "The artist's ability to transcend\nboundaries and connect with a\nglobal audience is a testament to\nthe universal language of\nvisual storytelling";

      if (needsHeroUpdate || needsAboutUpdate || needsExhibitionsUpdate) {
        if (!content.hero) content.hero = {};
        if (!content.about) content.about = {};
        if (!content.exhibitions) content.exhibitions = {};

        content.hero.topSubheading = "AN AWARD-WINNING\nPHOTOGRAPHER WHOSE LENS\nTRANSFORMS MOMENTS INTO\nTIMELESS MASTERPIECES";
        content.about.description = "DISTINGUISHED BY A MYRIAD OF\nACCOLADES AND INTERNATIONAL\nRECOGNITION, I STAND\nAS A LUMINARY IN THE REALM OF\nVISUAL STORYTELLING";
        content.exhibitions.description = "The artist's ability to transcend\nboundaries and connect with a\nglobal audience is a testament to\nthe universal language of\nvisual storytelling";
        
        content.markModified('hero');
        content.markModified('about');
        content.markModified('exhibitions');
        
        try {
          await content.save();
        } catch (e) {
          console.error("Forced seed failed", e);
        }
      }
    }
    
    // Ensure we return a plain JSON object to completely avoid Next.js serialization bugs with Mongoose docs
    return NextResponse.json(JSON.parse(JSON.stringify(content)));
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
    // Remove immutable fields from payload to prevent MongoServerError
    delete data._id;
    delete data.__v;

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
