import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, cookies }) => {
	// If user is already logged in, redirect to hub
	const token = cookies.get('auth_token');
	if (token) {
		throw redirect(302, '/hub');
	}

	// Get the return URL from query params
	const returnTo = url.searchParams.get('returnTo') || '/hub';

	return {
		returnTo
	};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email') as string;
		const password = data.get('password') as string;

		// Basic validation
		if (!email || !password) {
			return fail(400, {
				error: 'Email and password are required',
				email
			});
		}

		try {
			// For development, create a mock authentication
			// In production, this should connect to your actual authentication system
			const mockUser = {
				id: 'user-1',
				email: 'dev@sol.com.vn',
				first_name: 'Development',
				last_name: 'User',
				role: {
					name: 'Restaurant Staff'
				}
			};

			// Simple mock authentication check
			if (email === 'dev@sol.com.vn' && password === 'adminuser') {
				// Set authentication cookie
				cookies.set('auth_token', 'mock-jwt-token-for-development', {
					path: '/',
					httpOnly: true,
					sameSite: 'strict',
					secure: false, // Set to true in production with HTTPS
					maxAge: 60 * 60 * 24 * 7 // 7 days
				});

				// Return success
				return {
					success: true,
					user: mockUser
				};
			} else {
				return fail(401, {
					error: 'Invalid email or password',
					email
				});
			}
		} catch (error) {
			console.error('Login error:', error);
			return fail(500, {
				error: 'An error occurred during login. Please try again.',
				email
			});
		}
	}
};