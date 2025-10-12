import { NextResponse } from 'next/server';
import { directusClient } from '@/lib/directus';

export async function GET() {
  try {
    const res = await directusClient.listAuthProviders();
    const providers = Array.isArray(res?.data) ? res.data : [];
    return NextResponse.json({ providers });
  } catch {
    // Gracefully degrade: return empty list so the login page can render without OAuth buttons
    return NextResponse.json({ providers: [] });
  }
}