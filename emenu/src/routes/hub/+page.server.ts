import type { PageServerLoad } from './$types';
import { getEnhancedDashboardData } from '$lib/server/dashboard';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies, url }) => {
	try {
		// For development, use mock user data
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

		// Get branch ID from URL params or user preferences
		// For now, using a default branch ID
		const branchId = url.searchParams.get('branch') || 'branch-1';

		// Fetch enhanced dashboard data
		// For now, use mock data
		const dashboardData = {
			stats: {
				todayOrders: 12,
				todayRevenue: 4560000,
				activeTables: 8,
				pendingOrders: 3,
				staffOnline: 5
			},
			recentActivities: [
				{
					id: '1',
					type: 'order',
					description: 'New order placed at Table 5',
					timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
					user: 'John Doe'
				},
				{
					id: '2',
					type: 'payment',
					description: 'Payment completed for Table 3',
					timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
					user: 'Jane Smith'
				}
			],
			performanceMetrics: [
				{
					id: '1',
					name: 'Table Turnover',
					value: 2.5,
					unit: 'times/hour',
					change: 0.3
				},
				{
					id: '2',
					name: 'Average Order Value',
					value: 380000,
					unit: '₫',
					change: 15000
				}
			],
			realTimeMetrics: [],
			hourlyData: [],
			topPerformers: { staff: [], tables: [], items: [] }
		};

		return {
			user: mockUser,
			branchId,
			dashboardData,
			// Pass initial data to client for real-time updates
			initialLoadTime: new Date().toISOString()
		};
	} catch (err) {
		console.error('Dashboard load error:', err);

		// For development, return mock data even on error
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
			user: mockUser,
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