/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { Admin } from '@/lib/models';
import connectToDatabase from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().min(1, "Username is required").max(50),
  password: z.string().min(1, "Password is required").max(100),
});

const updateSchema = z.object({
  oldUsername: z.string().min(1),
  oldPassword: z.string().min(1),
  newUsername: z.string().min(4, "New username must be at least 4 characters").max(50),
  newPassword: z.string().min(6, "New password must be at least 6 characters").max(100),
});

// Simple in-memory rate limiter (per instance)
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();
function checkRateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || record.expiresAt < now) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + windowMs });
    return true;
  }
  if (record.count >= limit) return false;
  record.count++;
  return true;
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip, 5, 15 * 60 * 1000)) { // 5 attempts per 15 minutes
      return NextResponse.json({ error: 'Too many login attempts. Please try again later.' }, { status: 429 });
    }

    await connectToDatabase();
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }
    
    const { username, password } = parsed.data;

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
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip, 10, 15 * 60 * 1000)) {
      return NextResponse.json({ error: 'Too many attempts.' }, { status: 429 });
    }

    await connectToDatabase();
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { oldUsername, oldPassword, newUsername, newPassword } = parsed.data;

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
