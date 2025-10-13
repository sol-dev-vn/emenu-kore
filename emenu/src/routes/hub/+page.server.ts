import type { PageServerLoad } from './$types';
import { getEnhancedDashboardData } from '$lib/server/dashboard';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, url }) => {
	try {
		// Get user from locals (should be set by auth hook)
		const user = locals.user;

		if (!user) {
			throw error(401, 'Unauthorized');
		}

		// Get branch ID from URL params or user preferences
		// For now, using a default branch ID
		const branchId = url.searchParams.get('branch') || user.default_branch || 'branch-1';

		// Fetch enhanced dashboard data
		const dashboardData = await getEnhancedDashboardData(branchId, user.id);

		return {
			user,
			branchId,
			dashboardData,
			// Pass initial data to client for real-time updates
			initialLoadTime: new Date().toISOString()
		};
	} catch (err) {
		console.error('Dashboard load error:', err);

		// If it's an authentication error, rethrow it
		if (err instanceof Error && err.message.includes('Unauthorized')) {
			throw err;
		}

		// For other errors, return empty data to prevent page crashes
		return {
			user: locals.user,
			branchId: 'branch-1',
			dashboardData: {
				stats: { todayOrders: 0, todayRevenue: 0, activeTables: 0, pendingOrders: 0 },
				recentActivities: [],
				performanceMetrics: []
			},
			initialLoadTime: new Date().toISOString(),
			error: 'Failed to load dashboard data'
		};
	}
};