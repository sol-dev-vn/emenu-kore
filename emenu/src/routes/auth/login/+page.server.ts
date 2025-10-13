import { fail, redirect } from '@sveltejs/kit';
import { directusAuth, type DirectusUser } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, cookies }) => {
	// Check if user is already authenticated via Directus token
	const token = cookies.get('directus_token');
	if (token) {
		// Verify token is valid by trying to get current user
		try {
			// Set token for Directus client
			await directusAuth.loginWithToken(token);
			const user = await directusAuth.getCurrentUser();
			if (user) {
				throw redirect(302, '/hub');
			}
		} catch (error) {
			// Token invalid, clear it and continue
			cookies.delete('directus_token', { path: '/' });
		}
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
			// Authenticate with Directus
			const user = await directusAuth.login(email, password);
			const token = directusAuth.getToken();

			if (!user || !token) {
				return fail(401, {
					error: 'Invalid email or password',
					email
				});
			}

			// Set Directus authentication cookies
			cookies.set('directus_token', token, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 7 // 7 days
			});

			// Also set refresh token if available
			const refreshToken = directusAuth.getRefreshToken();
			if (refreshToken) {
				cookies.set('directus_refresh_token', refreshToken, {
					path: '/',
					httpOnly: true,
					sameSite: 'strict',
					secure: process.env.NODE_ENV === 'production',
					maxAge: 60 * 60 * 24 * 30 // 30 days
				});
			}

			// Return success with user data
			return {
				success: true,
				user: {
					id: user.id,
					email: user.email,
					first_name: user.first_name,
					last_name: user.last_name,
					phone: user.phone,
					avatar: user.avatar,
					role: user.role,
					roles: user.roles
				}
			};
		} catch (error) {
			console.error('Login error:', error);

			// Provide more specific error messages
			let errorMessage = 'An error occurred during login. Please try again.';
			if (error instanceof Error) {
				if (error.message.includes('Invalid credentials')) {
					errorMessage = 'Invalid email or password';
				} else if (error.message.includes('User not found')) {
					errorMessage = 'User not found';
				} else if (error.message.includes('Network error')) {
					errorMessage = 'Network error. Please check your connection.';
				}
			}

			return fail(500, {
				error: errorMessage,
				email
			});
		}
	}
};