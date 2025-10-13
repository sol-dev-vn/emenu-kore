import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createDirectus, rest, readMe, withToken } from '@directus/sdk';
import type { Schema } from '@/types/directus-schema';

export async function GET(request: NextRequest) {
	try {
		const cookieStore = await cookies();
		const accessToken = cookieStore.get('access_token')?.value;

		if (!accessToken) {
			return NextResponse.json(
				{ error: 'No access token provided' },
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

		// Create Directus client with token
		const directus = createDirectus<Schema>(directusUrl)
			.with(rest());

		// Get current user information
		const user = await directus.request(
			withToken(accessToken, readMe({
				fields: ['*', 'role.*']
			}))
		) as any;

		if (!user) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 }
			);
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
				title: user.title,
				description: user.description,
				location: user.location,
				status: user.status,
			},
		});
	} catch (error: any) {
		console.error('Get user error:', error);
		
		// If token is invalid, clear cookies
		if (error.message?.includes('TOKEN_INVALID') || error.status === 401) {
			const cookieStore = await cookies();
			cookieStore.delete('access_token');
			cookieStore.delete('refresh_token');
			
			return NextResponse.json(
				{ error: 'Invalid token' },
				{ status: 401 }
			);
		}

		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}