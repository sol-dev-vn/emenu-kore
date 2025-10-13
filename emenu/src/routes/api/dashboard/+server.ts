import { json } from '@sveltejs/kit';
import { getDashboardData } from '$lib/server/dashboard';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const branchId = url.searchParams.get('branch') || 'branch-1';
		const userId = url.searchParams.get('userId');

		// Fetch fresh dashboard data
		const dashboardData = await getDashboardData(branchId, userId || undefined);

		return json({
			success: true,
			data: dashboardData,
			timestamp: new Date().toISOString()
		});
	} catch (error) {
		console.error('Dashboard API error:', error);
		return json(
			{
				success: false,
				error: 'Failed to fetch dashboard data',
				message: error instanceof Error ? error.message : 'Unknown error'
			},
			{ status: 500 }
		);
	}
};