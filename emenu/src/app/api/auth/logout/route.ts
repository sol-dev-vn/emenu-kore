import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
	try {
		const cookieStore = await cookies();
		
		// Clear the authentication cookies
		cookieStore.delete('access_token');
		cookieStore.delete('refresh_token');
		
		// Optionally call Directus logout endpoint if needed
		const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
		if (directusUrl) {
			try {
				await fetch(`${directusUrl}/auth/logout`, {
					method: 'POST',
					credentials: 'include',
				});
			} catch (error) {
				console.error('Directus logout error:', error);
				// Continue even if Directus logout fails
			}
		}

		return NextResponse.json({
			success: true,
			message: 'Logged out successfully',
		});
	} catch (error: any) {
		console.error('Logout error:', error);
		
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}