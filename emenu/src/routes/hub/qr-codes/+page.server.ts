import { redirect } from '@sveltejs/kit';
import directusAuth, { type DirectusUser } from '$lib/server/auth';

export async function load({ locals, url }) {
	try {
		// Check authentication
		const currentUser = await directusAuth.getUser(locals);

		if (!currentUser) {
			throw redirect(302, '/auth/login?returnTo=' + encodeURIComponent(url.pathname));
		}

		// Get branch context from session or query params
		const branchId = url.searchParams.get('branch') || locals.session?.branchId || 'default';

		// Return user data and initial state
		return {
			user: currentUser,
			branchId,
			error: null
		};

	} catch (error) {
		// If it's a redirect, re-throw it
		if (error instanceof redirect) {
			throw error;
		}

		console.error('QR codes page load error:', error);

		// Return error state instead of redirecting to prevent infinite loops
		return {
			user: null,
			branchId: null,
			error: error instanceof Error ? error.message : 'Failed to load QR codes page'
		};
	}
}