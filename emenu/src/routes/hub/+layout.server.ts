import { redirect } from '@sveltejs/kit';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ cookies, url }) => {
	// Check for authentication token
	const authToken = cookies.get('auth_token');

	// If no auth token, redirect to login with return URL
	if (!authToken) {
		throw redirect(302, '/auth/login?returnTo=' + encodeURIComponent(url.pathname));
	}

	// For development, we'll use mock user data
	// In production, validate the JWT token and fetch real user data
	const mockUser = {
		id: 'user-1',
		email: 'dev@sol.com.vn',
		first_name: 'Development',
		last_name: 'User',
		role: {
			name: 'Restaurant Staff'
		}
	};

	return {
		user: mockUser
	};
};