import { NextRequest, NextResponse } from 'next/server';
import { directusClient } from '@/lib/directus';

export async function GET(request: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
  try {
    const { provider } = await params;
    const urlBase = process.env.NEXT_PUBLIC_DIRECTUS_URL || process.env.DIRECTUS_URL;
    if (!urlBase) {
      return NextResponse.json({ error: 'Directus URL not configured' }, { status: 500 });
    }

    const redirect = new URL('/api/auth/oauth/callback', request.url).toString();
    // Directus OAuth start URL, cookie-mode
    const oauthUrl = `${urlBase}/auth/oauth/${encodeURIComponent(provider)}?redirect=${encodeURIComponent(redirect)}`;

    return NextResponse.redirect(oauthUrl);
  } catch (error) {
    console.error('OAuth start failed:', error);
    return NextResponse.json({ error: 'OAuth start failed' }, { status: 500 });
  }
}