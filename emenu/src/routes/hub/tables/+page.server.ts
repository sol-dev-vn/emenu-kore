import type { PageServerLoad } from './$types';
import { TableService } from '$lib/server/tableService';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, url }) => {
	try {
		// Get user from locals (should be set by auth hook)
		const user = locals.user;

		if (!user) {
			throw error(401, 'Unauthorized');
		}

		// Get branch ID from URL params or user preferences
		const branchId = url.searchParams.get('branch') || user.default_branch || 'branch-1';

		// Fetch tables and zones data
		const [tables, zones] = await Promise.all([
			TableService.getTables(branchId),
			TableService.getZones(branchId)
		]);

		// Get table metrics
		const metrics = await TableService.getTableMetrics(branchId);

		return {
			user,
			branchId,
			tables,
			zones,
			metrics,
			initialLoadTime: new Date().toISOString()
		};
	} catch (err) {
		console.error('Tables page load error:', err);

		// If it's an authentication error, rethrow it
		if (err instanceof Error && err.message.includes('Unauthorized')) {
			throw err;
		}

		// For other errors, return empty data to prevent page crashes
		return {
			user: locals.user,
			branchId: 'branch-1',
			tables: [],
			zones: [],
			metrics: {
				totalTables: 0,
				availableTables: 0,
				occupiedTables: 0,
				reservedTables: 0,
				cleaningTables: 0,
				maintenanceTables: 0,
				occupancyRate: 0,
				averageSessionDuration: 0,
				totalRevenue: 0,
				activeStaff: 0
			},
			initialLoadTime: new Date().toISOString(),
			error: 'Failed to load tables data'
		};
	}
};