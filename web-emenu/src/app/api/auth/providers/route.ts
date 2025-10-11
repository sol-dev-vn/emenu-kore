import { NextResponse } from 'next/server';
import { directusClient } from '@/lib/directus';

export async function GET() {
  try {
    const res = await directusClient.listAuthProviders();
    const providers = Array.isArray(res?.data) ? res.data : [];
    return NextResponse.json({ providers });
  } catch (error) {
    console.error('List auth providers failed:', error);
    return NextResponse.json({ error: 'Failed to list auth providers' }, { status: 500 });
  }
}