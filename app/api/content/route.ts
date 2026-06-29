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
      // COMPREHENSIVE FORCED SEED TO MATCH EXACT LANDING PAGE TEXT & ARRAYS
      // ----------------------------------------------------
      let isForcedUpdate = false;

      // 1. Hero
      if (content.hero?.topSubheading !== "AN AWARD-WINNING\nPHOTOGRAPHER WHOSE LENS\nTRANSFORMS MOMENTS INTO\nTIMELESS MASTERPIECES") {
        if (!content.hero) content.hero = {};
        content.hero.topSubheading = "AN AWARD-WINNING\nPHOTOGRAPHER WHOSE LENS\nTRANSFORMS MOMENTS INTO\nTIMELESS MASTERPIECES";
        content.hero.signatureSubtext = "SCROLL\nMORE";
        content.markModified('hero');
        isForcedUpdate = true;
      }

      // 2. About
      if (content.about?.description !== "DISTINGUISHED BY A MYRIAD OF\nACCOLADES AND INTERNATIONAL\nRECOGNITION, I STAND\nAS A LUMINARY IN THE REALM OF\nVISUAL STORYTELLING") {
        if (!content.about) content.about = {};
        content.about.title = "About Me";
        content.about.description = "DISTINGUISHED BY A MYRIAD OF\nACCOLADES AND INTERNATIONAL\nRECOGNITION, I STAND\nAS A LUMINARY IN THE REALM OF\nVISUAL STORYTELLING";
        content.markModified('about');
        isForcedUpdate = true;
      }

      // 3. Works
      if (content.works?.description !== "Every image is a meticulous\ncomposition, carefully curated to\nevoke emotion and provoke thought.\nWhether it's a candid moment frozen\nin time or the grandeur of nature's\nspectacle") {
        if (!content.works) content.works = {};
        content.works.year = "2023";
        content.works.title = "My Works";
        content.works.description = "Every image is a meticulous\ncomposition, carefully curated to\nevoke emotion and provoke thought.\nWhether it's a candid moment frozen\nin time or the grandeur of nature's\nspectacle";
        if (!content.works.grids || content.works.grids.length === 0) {
           content.works.grids = [
             {
               id: "grid_1",
               mediaList: [
                 { url: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&q=80&w=800&grayscale=true" },
                 { url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800&grayscale=true" },
                 { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800&grayscale=true" },
                 { url: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&q=80&w=800&grayscale=true" },
                 { url: "https://images.unsplash.com/photo-1548625361-ec8492067568?auto=format&fit=crop&q=80&w=800&grayscale=true" },
                 { url: "https://images.unsplash.com/photo-1618090584126-129cd1f3f316?auto=format&fit=crop&q=80&w=800&grayscale=true" },
                 { url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800&grayscale=true" },
                 { url: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=800&grayscale=true" }
               ]
             }
           ]
        }
        content.markModified('works');
        isForcedUpdate = true;
      }

      // 4. Services
      if (content.services?.description !== "Whether it's capturing the\nessence of a corporate\nevent, immortalizing a\ncouple's special day, or\ncollaborating on artistic\nprojects") {
        if (!content.services) content.services = {};
        content.services.description = "Whether it's capturing the\nessence of a corporate\nevent, immortalizing a\ncouple's special day, or\ncollaborating on artistic\nprojects";
        if (!content.services.list || content.services.list.length === 0) {
          content.services.list = [
            { title: 'PORTRAITURE', mediaUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800&grayscale=true' },
            { title: 'EVENT COVERAGE', mediaUrl: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=800&grayscale=true' },
            { title: 'COMMERCIAL PHOTO', mediaUrl: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?auto=format&fit=crop&q=80&w=800&grayscale=true' },
            { title: 'WEDDING PHOTO', mediaUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800&grayscale=true' },
            { title: 'FINE ART PHOTO', mediaUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800&grayscale=true' }
          ]
        }
        content.markModified('services');
        isForcedUpdate = true;
      }

      // 5. Exhibitions
      if (content.exhibitions?.description !== "The artist's ability to transcend\nboundaries and connect with a\nglobal audience is a testament to\nthe universal language of\nvisual storytelling") {
        if (!content.exhibitions) content.exhibitions = {};
        content.exhibitions.year = "2024";
        content.exhibitions.title = "My Exhibitions";
        content.exhibitions.description = "The artist's ability to transcend\nboundaries and connect with a\nglobal audience is a testament to\nthe universal language of\nvisual storytelling";
        if (!content.exhibitions.list || content.exhibitions.list.length === 0) {
          content.exhibitions.list = [
            { text: "MADRID, JAN 2024\nFEEL FREE PHOTOGRAPHY", mediaUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600&grayscale=true" },
            { text: "PARIS, MAR 2024\nLUMIERE STUDIOS", mediaUrl: "https://images.unsplash.com/photo-1518998053401-b2b9187313bd?auto=format&fit=crop&q=80&w=1600&grayscale=true" },
            { text: "TOKYO, JUL 2024\nNEON VISIONS", mediaUrl: "https://images.unsplash.com/photo-1541123437800-1bb1317bc920?auto=format&fit=crop&q=80&w=1600&grayscale=true" }
          ]
        }
        content.markModified('exhibitions');
        isForcedUpdate = true;
      }

      if (isForcedUpdate) {
        try {
          await content.save();
        } catch (e) {
          console.error("Comprehensive forced seed failed", e);
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
