import { redirect } from '@sveltejs/kit';
import { directusAuth } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
	try {
		// Logout from Directus
		await directusAuth.logout();
	} catch (error) {
		console.error('Logout error:', error);
		// Continue with clearing cookies even if logout fails
	}

	// Clear the Directus authentication cookies
	cookies.delete('directus_token', {
		path: '/'
	});

	cookies.delete('directus_refresh_token', {
		path: '/'
	});

	// Redirect to login page
	throw redirect(302, '/auth/login');
};