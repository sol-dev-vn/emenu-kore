import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createDirectus, authentication, rest, readMe } from '@directus/sdk';
import type { Schema } from '@/types/directus-schema';

export async function POST(request: NextRequest) {
	try {
		const { email, password } = await request.json();

		if (!email || !password) {
			return NextResponse.json(
				{ error: 'Email and password are required' },
				{ status: 400 }
			);
		}

		const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
		if (!directusUrl) {
			return NextResponse.json(
				{ error: 'Directus URL not configured' },
				{ status: 500 }
			);
		}

		// Create Directus client for authentication
		const directus = createDirectus<Schema>(directusUrl)
			.with(rest())
			.with(authentication('json'));

		// Login with Directus
		await directus.login(email, password);

		// Fetch user data
		const user = await directus.request(
			readMe({
				fields: ['*', 'role.*'] as any
			})
		) as any;

		// Get the tokens from the response
		const response = await fetch(`${directusUrl}/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
			credentials: 'include',
		});

		if (!response.ok) {
			return NextResponse.json(
				{ error: 'Invalid credentials' },
				{ status: 401 }
			);
		}

		const data = await response.json();
		const { access_token, refresh_token, expires } = data.data;

		// Set HTTP-only cookies
		const cookieStore = await cookies();
		
		// Access token cookie (short-lived)
		cookieStore.set('access_token', access_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 60 * 15, // 15 minutes
			path: '/',
		});

		// Refresh token cookie (longer-lived)
		cookieStore.set('refresh_token', refresh_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 7, // 7 days
			path: '/',
		});

		return NextResponse.json({
			success: true,
			user: {
				id: user.id,
				email: user.email,
				first_name: user.first_name,
				last_name: user.last_name,
				role: user.role,
				avatar: user.avatar,
			},
		});
	} catch (error: any) {
		console.error('Login error:', error);
		
		// Handle specific Directus errors
		if (error.message?.includes('INVALID_CREDENTIALS')) {
			return NextResponse.json(
				{ error: 'Invalid email or password' },
				{ status: 401 }
			);
		}

		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}