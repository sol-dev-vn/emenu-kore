import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
	try {
		const cookieStore = await cookies();
		const refreshToken = cookieStore.get('refresh_token')?.value;

		if (!refreshToken) {
			return NextResponse.json(
				{ error: 'No refresh token provided' },
				{ status: 401 }
			);
		}

		const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
		if (!directusUrl) {
			return NextResponse.json(
				{ error: 'Directus URL not configured' },
				{ status: 500 }
			);
		}

		// Request new tokens from Directus
		const response = await fetch(`${directusUrl}/auth/refresh`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ refresh_token: refreshToken }),
			credentials: 'include',
		});

		if (!response.ok) {
			// Clear invalid refresh token
			cookieStore.delete('refresh_token');
			cookieStore.delete('access_token');
			
			return NextResponse.json(
				{ error: 'Invalid refresh token' },
				{ status: 401 }
			);
		}

		const data = await response.json();
		const { access_token, refresh_token: newRefreshToken, expires } = data.data;

		// Update access token cookie
		cookieStore.set('access_token', access_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 60 * 15, // 15 minutes
			path: '/',
		});

		// Update refresh token if a new one is provided
		if (newRefreshToken) {
			cookieStore.set('refresh_token', newRefreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 * 7, // 7 days
				path: '/',
			});
		}

		return NextResponse.json({
			success: true,
			access_token,
			expires,
		});
	} catch (error: any) {
		console.error('Token refresh error:', error);
		
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}