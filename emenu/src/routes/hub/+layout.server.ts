import { redirect } from '@sveltejs/kit';
import { directusAuth, type DirectusUser } from '$lib/server/auth';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ cookies, url }) => {
	// Check for Directus authentication token
	const token = cookies.get('directus_token');

	// If no auth token, redirect to login with return URL
	if (!token) {
		throw redirect(302, '/auth/login?returnTo=' + encodeURIComponent(url.pathname));
	}

	try {
		// Set token for Directus client and get current user
		await directusAuth.loginWithToken(token);
		const user = await directusAuth.getCurrentUser();

		if (!user) {
			// User not found, clear token and redirect
			cookies.delete('directus_token', { path: '/' });
			throw redirect(302, '/auth/login?returnTo=' + encodeURIComponent(url.pathname));
		}

		return {
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
		console.error('Authentication error:', error);
		// Clear invalid token and redirect to login
		cookies.delete('directus_token', { path: '/' });
		cookies.delete('directus_refresh_token', { path: '/' });
		throw redirect(302, '/auth/login?returnTo=' + encodeURIComponent(url.pathname));
	}
};