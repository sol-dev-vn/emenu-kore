import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createDirectus, authentication, rest, readMe } from '@directus/sdk';
import type { Schema } from '@/types/directus-schema';

export async function POST(request: NextRequest) {
	try {
		const { email, password, rememberMe = false } = await request.json();

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

		// Determine cookie expiration based on remember me preference
		const accessTokenMaxAge = 60 * 15; // Always 15 minutes for access token
		const refreshTokenMaxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7; // 30 days if remember me, 7 days if not

		// Access token cookie (short-lived)
		cookieStore.set('access_token', access_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: accessTokenMaxAge,
			path: '/',
		});

		// Refresh token cookie (duration based on remember me)
		cookieStore.set('refresh_token', refresh_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: refreshTokenMaxAge,
			path: '/',
		});

		// Optional: Set a session cookie to indicate remember me status
		if (rememberMe) {
			cookieStore.set('remember_me', 'true', {
				httpOnly: false, // Allow client-side access
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				maxAge: refreshTokenMaxAge,
				path: '/',
			});
		}

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