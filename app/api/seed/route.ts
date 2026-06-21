import { NextResponse } from 'next/server';
import { Admin } from '@/lib/models';
import connectToDatabase from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Clear existing
    await Admin.deleteMany({});
    
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('laxman', salt);

    const admin = new Admin({
      username: 'laxman',
      passwordHash
    });
    
    await admin.save();

    return NextResponse.json({ success: true, message: 'Admin seeded: username=laxman, password=laxman' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
