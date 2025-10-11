import { NextRequest, NextResponse } from 'next/server';
import { directusClient } from '@/lib/directus';

export async function POST(request: NextRequest) {
  try {
    const refresh_token = request.cookies.get('directus_refresh_token')?.value;

    if (refresh_token) {
      try {
        await directusClient.logout(refresh_token);
      } catch (e) {
        console.warn('Directus logout error:', e);
      }
    }

    const response = NextResponse.json({ success: true });
    const opts = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 0,
    };

    response.cookies.set('directus_access_token', '', opts);
    response.cookies.set('directus_refresh_token', '', opts);

    return response;
  } catch (error) {
    console.error('Logout failed:', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}