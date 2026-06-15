/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { Admin } from '@/lib/models';
import connectToDatabase from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { username, password } = await request.json();

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({ success: true, message: 'Authenticated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const { oldUsername, oldPassword, newUsername, newPassword } = await request.json();

    const admin = await Admin.findOne({ username: oldUsername });
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(oldPassword, admin.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid old password' }, { status: 401 });
    }

    // Update credentials
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);
    
    admin.username = newUsername;
    admin.passwordHash = newPasswordHash;
    await admin.save();

    return NextResponse.json({ success: true, message: 'Credentials updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
