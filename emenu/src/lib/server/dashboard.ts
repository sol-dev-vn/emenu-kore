import directus from '../directus.js';
import { readItems } from '@directus/sdk';

export interface DashboardStats {
	todayOrders: number;
	todayRevenue: number;
	activeTables: number;
	pendingOrders: number;
	totalCustomers: number;
	averageOrderValue: number;
	totalTables: number;
	occupancyRate: number;
	staffOnline: number;
}

export interface RecentActivity {
	id: string;
	type: 'order' | 'staff' | 'table' | 'payment' | 'reservation' | 'cleaning' | 'session';
	message: string;
	time: string;
	user: string;
	timestamp?: Date;
	details?: any;
	priority?: 'low' | 'medium' | 'high';
}

export interface RealTimeMetric {
	id: string;
	name: string;
	value: number;
	unit: string;
	trend: 'up' | 'down' | 'stable';
	trendValue: number;
	target?: number;
	category: 'orders' | 'revenue' | 'customers' | 'tables' | 'staff';
	updateInterval: number; // seconds
}

export interface HourlyData {
	hour: number;
	orders: number;
	revenue: number;
	customers: number;
}

export interface TopPerformer {
	id: string;
	name: string;
	value: number;
	metric: string;
	change: number;
}

export interface PerformanceMetric {
	label: string;
	value: string;
	change: string;
	positive: boolean;
}

export interface DashboardData {
	stats: DashboardStats;
	recentActivities: RecentActivity[];
	performanceMetrics: PerformanceMetric[];
	realTimeMetrics: RealTimeMetric[];
	hourlyData: HourlyData[];
	topPerformers: {
		staff: TopPerformer[];
		tables: TopPerformer[];
		items: TopPerformer[];
	};
	trends: {
		revenue: number[];
		orders: number[];
		customers: number[];
	};
}

export async function getDashboardStats(branchId?: string, userId?: string): Promise<DashboardStats> {
	try {
		// In a real implementation, these would be actual Directus API calls
		// For now, returning mock data that simulates API responses

		const today = new Date();
		const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

		// Mock API calls to Directus collections
		// TODO: Replace with actual Directus SDK calls when collections are created

		// Example of what real API calls would look like:
		// const orders = await directus.request(
		//   readItems('orders', {
		//     filter: {
		//       branch: { _eq: branchId },
		//       date_created: { _gte: startOfDay.toISOString() }
		//     },
		//     aggregate: {
		//       count: ['*'],
		//       sum: ['total_amount']
		//     }
		//   })
		// );

		return {
			todayOrders: 124,
			todayRevenue: 45600000,
			activeTables: 18,
			pendingOrders: 3,
			totalCustomers: 312,
			averageOrderValue: 367742,
			totalTables: 30,
			occupancyRate: 60,
			staffOnline: 8
		};
	} catch (error) {
		console.error('Failed to fetch dashboard stats:', error);
		// Return default values on error
		return {
			todayOrders: 0,
			todayRevenue: 0,
			activeTables: 0,
			pendingOrders: 0
		};
	}
}

export async function getRecentActivities(branchId?: string, limit: number = 10): Promise<RecentActivity[]> {
	try {
		// Mock recent activities
		// TODO: Replace with actual Directus API calls when activity logs collection exists

		const activities: RecentActivity[] = [
			{
				id: '1',
				type: 'order',
				message: 'New order from Table 5',
				time: '2 minutes ago',
				user: 'Customer',
				timestamp: new Date(Date.now() - 2 * 60 * 1000)
			},
			{
				id: '2',
				type: 'staff',
				message: 'Staff login: Nguyen Van A',
				time: '15 minutes ago',
				user: 'System',
				timestamp: new Date(Date.now() - 15 * 60 * 1000)
			},
			{
				id: '3',
				type: 'table',
				message: 'Table 8 marked as available',
				time: '23 minutes ago',
				user: 'Waiter B',
				timestamp: new Date(Date.now() - 23 * 60 * 1000)
			},
			{
				id: '4',
				type: 'payment',
				message: 'Payment received: 2,450,000₫',
				time: '1 hour ago',
				user: 'Customer',
				timestamp: new Date(Date.now() - 60 * 60 * 1000)
			}
		];

		return activities.slice(0, limit);
	} catch (error) {
		console.error('Failed to fetch recent activities:', error);
		return [];
	}
}

export async function getPerformanceMetrics(branchId?: string): Promise<PerformanceMetric[]> {
	try {
		// Mock performance metrics
		// TODO: Replace with actual calculations based on Directus data

		return [
			{ label: 'Avg Order Value', value: '368,000₫', change: '+12%', positive: true },
			{ label: 'Table Turnover', value: '3.2x', change: '+8%', positive: true },
			{ label: 'Customer Satisfaction', value: '4.8/5', change: '+0.2', positive: true },
			{ label: 'Staff Efficiency', value: '89%', change: '-3%', positive: false }
		];
	} catch (error) {
		console.error('Failed to fetch performance metrics:', error);
		return [];
	}
}

export async function getDashboardData(branchId?: string, userId?: string): Promise<DashboardData> {
	try {
		// Parallel data fetching for better performance
		const [stats, recentActivities, performanceMetrics] = await Promise.all([
			getDashboardStats(branchId, userId),
			getRecentActivities(branchId),
			getPerformanceMetrics(branchId)
		]);

		return {
			stats,
			recentActivities,
			performanceMetrics
		};
	} catch (error) {
		console.error('Failed to fetch dashboard data:', error);
		// Return empty dashboard data on error
		return {
			stats: { todayOrders: 0, todayRevenue: 0, activeTables: 0, pendingOrders: 0 },
			recentActivities: [],
			performanceMetrics: []
		};
	}
}

// Helper function to format time relative to now
export function formatRelativeTime(date: Date): string {
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / (1000 * 60));
	const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffMins < 1) return 'Just now';
	if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
	if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
	return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
}

// Helper function to get activity icon
export function getActivityIcon(type: string): string {
	switch (type) {
		case 'order': return '📋';
		case 'staff': return '👤';
		case 'table': return '🪑';
		case 'payment': return '💰';
		case 'reservation': return '📅';
		case 'cleaning': return '🧹';
		case 'session': return '🍽️';
		default: return '📌';
	}
}

// Real-time metrics functions
export async function getRealTimeMetrics(branchId?: string): Promise<RealTimeMetric[]> {
	try {
		// Mock real-time metrics with varying update intervals
		const now = new Date();
		const metrics: RealTimeMetric[] = [
			{
				id: 'orders-per-minute',
				name: 'Orders per Minute',
				value: 2.4,
				unit: 'orders/min',
				trend: 'up',
				trendValue: 0.3,
				target: 3,
				category: 'orders',
				updateInterval: 30
			},
			{
				id: 'revenue-per-hour',
				name: 'Revenue per Hour',
				value: 4500000,
				unit: '₫',
				trend: 'up',
				trendValue: 15,
				target: 5000000,
				category: 'revenue',
				updateInterval: 60
			},
			{
				id: 'table-turnover',
				name: 'Table Turnover',
				value: 2.8,
				unit: 'x/hour',
				trend: 'stable',
				trendValue: 0,
				target: 3,
				category: 'tables',
				updateInterval: 120
			},
			{
				id: 'customer-flow',
				name: 'Customer Flow',
				value: 15,
				unit: 'customers/hour',
				trend: 'up',
				trendValue: 3,
				target: 20,
				category: 'customers',
				updateInterval: 45
			},
			{
				id: 'staff-efficiency',
				name: 'Staff Efficiency',
				value: 92,
				unit: '%',
				trend: 'down',
				trendValue: 2,
				target: 95,
				category: 'staff',
				updateInterval: 90
			}
		];

		return metrics;
	} catch (error) {
		console.error('Failed to fetch real-time metrics:', error);
		return [];
	}
}

export async function getHourlyData(branchId?: string): Promise<HourlyData[]> {
	try {
		// Mock hourly data for the past 24 hours
		const data: HourlyData[] = [];
		const now = new Date();

		for (let i = 23; i >= 0; i--) {
			const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
			const baseOrders = 8 + Math.random() * 8;
			const baseRevenue = 2000000 + Math.random() * 3000000;
			const baseCustomers = 20 + Math.random() * 15;

			data.push({
				hour: hour.getHours(),
				orders: Math.floor(baseOrders),
				revenue: Math.floor(baseRevenue),
				customers: Math.floor(baseCustomers)
			});
		}

		return data;
	} catch (error) {
		console.error('Failed to fetch hourly data:', error);
		return [];
	}
}

export async function getTopPerformers(branchId?: string): Promise<{
	staff: TopPerformer[];
	tables: TopPerformer[];
	items: TopPerformer[];
}> {
	try {
		// Mock top performers data
		return {
			staff: [
				{ id: 'staff-1', name: 'Nguyen Van A', value: 28, metric: 'Orders', change: 12 },
				{ id: 'staff-2', name: 'Tran Thi B', value: 15600000, metric: 'Revenue', change: 8 },
				{ id: 'staff-3', name: 'Le Van C', value: 4.8, metric: 'Rating', change: 5 }
			],
			tables: [
				{ id: 'table-1', name: 'Table 5', value: 45, metric: 'Sessions', change: 15 },
				{ id: 'table-2', name: 'Table 8', value: 12800000, metric: 'Revenue', change: 22 },
				{ id: 'table-3', name: 'Table 12', value: 6.2, metric: 'Turnover', change: -5 }
			],
			items: [
				{ id: 'item-1', name: 'Phở Bò', value: 89, metric: 'Orders', change: 18 },
				{ id: 'item-2', name: 'Bún Chả', value: 67, metric: 'Orders', change: 12 },
				{ id: 'item-3', name: 'Cơm Tấm', value: 45, metric: 'Orders', change: 8 }
			]
		};
	} catch (error) {
		console.error('Failed to fetch top performers:', error);
		return { staff: [], tables: [], items: [] };
	}
}

export async function getTrends(branchId?: string): Promise<{
	revenue: number[];
	orders: number[];
	customers: number[];
}> {
	try {
		// Mock trend data for the past 7 days
		const days = 7;
		const revenue: number[] = [];
		const orders: number[] = [];
		const customers: number[] = [];

		for (let i = days - 1; i >= 0; i--) {
			const date = new Date();
			date.setDate(date.getDate() - i);

			// Generate realistic trend data with some variation
			const dayOfWeek = date.getDay();
			const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
			const multiplier = isWeekend ? 1.3 : 1.0;

			revenue.push(Math.floor((35000000 + Math.random() * 20000000) * multiplier));
			orders.push(Math.floor((100 + Math.random() * 50) * multiplier));
			customers.push(Math.floor((280 + Math.random() * 120) * multiplier));
		}

		return { revenue, orders, customers };
	} catch (error) {
		console.error('Failed to fetch trends:', error);
		return { revenue: [], orders: [], customers: [] };
	}
}

// Enhanced dashboard data function
export async function getEnhancedDashboardData(branchId?: string, userId?: string): Promise<DashboardData> {
	try {
		// Parallel data fetching for better performance
		const [
			stats,
			recentActivities,
			performanceMetrics,
			realTimeMetrics,
			hourlyData,
			topPerformers,
			trends
		] = await Promise.all([
			getDashboardStats(branchId, userId),
			getRecentActivities(branchId),
			getPerformanceMetrics(branchId),
			getRealTimeMetrics(branchId),
			getHourlyData(branchId),
			getTopPerformers(branchId),
			getTrends(branchId)
		]);

		return {
			stats,
			recentActivities,
			performanceMetrics,
			realTimeMetrics,
			hourlyData,
			topPerformers,
			trends
		};
	} catch (error) {
		console.error('Failed to fetch enhanced dashboard data:', error);

		// Return empty enhanced dashboard data on error
		return {
			stats: {
				todayOrders: 0,
				todayRevenue: 0,
				activeTables: 0,
				pendingOrders: 0,
				totalCustomers: 0,
				averageOrderValue: 0,
				totalTables: 0,
				occupancyRate: 0,
				staffOnline: 0
			},
			recentActivities: [],
			performanceMetrics: [],
			realTimeMetrics: [],
			hourlyData: [],
			topPerformers: { staff: [], tables: [], items: [] },
			trends: { revenue: [], orders: [], customers: [] }
		};
	}
}