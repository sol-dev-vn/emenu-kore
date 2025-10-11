import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const branchId = body?.branch_id as string | undefined;

    const response = NextResponse.json({ success: true, branch_id: branchId || null });
    const opts = {
      httpOnly: false, // allow reading via document.cookie for UI
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: branchId ? 60 * 60 * 24 * 7 : 0, // 7 days or clear
    };

    response.cookies.set('selected_branch', encodeURIComponent(branchId || ''), opts);
    return response;
  } catch (error) {
    console.error('Impersonate error:', error);
    return NextResponse.json({ error: 'Failed to set selected branch' }, { status: 500 });
  }
}