import { NextRequest, NextResponse } from 'next/server';
import { directusClient } from '@/lib/directus';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const token = body?.token as string | undefined;
    const password = body?.password as string | undefined;

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
    }

    await directusClient.resetPassword(token, password);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Password reset failed:', error);
    return NextResponse.json({ error: 'Password reset failed' }, { status: 500 });
  }
}