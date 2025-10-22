import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = ['/login', '/api/auth/login', '/api/auth/refresh', '/api/auth/me', '/api/auth/logout'];

// Define routes that require authentication
const protectedRoutes = ['/hub'];

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Add pathname to headers for layout detection
	const requestHeaders = new Headers(request.headers);
	requestHeaders.set('x-pathname', pathname);

	// Check if the route is public
	if (publicRoutes.some(route => pathname.startsWith(route))) {
		return NextResponse.next({
			request: {
				headers: requestHeaders,
			},
		});
	}

	// Check if the route is protected
	if (protectedRoutes.some(route => pathname.startsWith(route))) {
		// Get the access token from cookies
		const accessToken = request.cookies.get('access_token')?.value;

		// If no token, redirect to login
		if (!accessToken) {
			const loginUrl = new URL('/login', request.url);
			loginUrl.searchParams.set('redirect', pathname);
			return NextResponse.redirect(loginUrl);
		}

		// For now, just check if the token exists
		// We can add additional verification if needed, but it might impact performance
		// The client-side AuthContext will handle token validation and refresh
	}

	// For all other routes, continue
	return NextResponse.next({
		request: {
			headers: requestHeaders,
		},
	});
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder
		 */
		'/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
	],
};