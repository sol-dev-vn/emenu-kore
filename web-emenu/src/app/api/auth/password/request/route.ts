import { NextRequest, NextResponse } from 'next/server';
import { directusClient } from '@/lib/directus';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = body?.email as string | undefined;
    const reset_url = body?.reset_url as string | undefined;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await directusClient.requestPasswordReset(email, reset_url);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Password reset request failed:', error);
    return NextResponse.json({ error: 'Password reset request failed' }, { status: 500 });
  }
}