import { redirect } from '@sveltejs/kit';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ cookies, url }) => {
	// Check for authentication token or session
	const authToken = cookies.get('auth_token');

	// For now, we'll create a simple mock user for development
	// In production, this should validate against your authentication system
	if (!authToken) {
		// If no auth token, redirect to login
		throw redirect(302, '/auth/login?returnTo=' + encodeURIComponent(url.pathname));
	}

	// Mock user data for development
	// In production, fetch this from your database based on the token
	const mockUser = {
		id: 'user-1',
		email: 'staff@solrestaurant.vn',
		first_name: 'Staff',
		last_name: 'User',
		role: {
			name: 'Restaurant Staff'
		}
	};

	return {
		user: mockUser
	};
};