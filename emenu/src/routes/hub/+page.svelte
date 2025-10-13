<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import directusAuth, { type DirectusUser } from '$lib/server/auth';
	import Card from '$lib/components/flowbite/Card.svelte';
	import Button from '$lib/components/flowbite/Button.svelte';
	import Badge from '$lib/components/flowbite/Badge.svelte';
	import { formatRelativeTime, getActivityIcon } from '$lib/server/dashboard';
	import RealTimeMetrics from '$lib/components/RealTimeMetrics.svelte';
	import ActivityFeed from '$lib/components/ActivityFeed.svelte';
	import PerformanceAnalytics from '$lib/components/PerformanceAnalytics.svelte';

	export let data;

	let currentUser: DirectusUser | null = data.user;
	let isLoading = false;
	let error = data.error || null;

	// Dashboard data from server load
	let stats = data.dashboardData.stats;
	let recentActivities = data.dashboardData.recentActivities;
	let performanceMetrics = data.dashboardData.performanceMetrics;
	let realTimeMetrics = data.dashboardData.realTimeMetrics || [];
	let hourlyData = data.dashboardData.hourlyData || [];
	let topPerformers = data.dashboardData.topPerformers || { staff: [], tables: [], items: [] };

	// Quick actions (static configuration)
	let quickActions = [
		{ id: 1, title: 'View Orders', icon: '📋', href: '/hub/orders', color: 'bg-blue-500' },
		{ id: 2, title: 'Manage Tables', icon: '🪑', href: '/hub/tables', color: 'bg-green-500' },
		{ id: 3, title: 'Generate QR Codes', icon: '📱', href: '/hub/qr-codes', color: 'bg-purple-500' },
		{ id: 4, title: 'Menu Management', icon: '📝', href: '/hub/menu', color: 'bg-orange-500' },
		{ id: 5, title: 'Staff Schedule', icon: '👥', href: '/hub/schedule', color: 'bg-indigo-500' },
		{ id: 6, title: 'Reports', icon: '📊', href: '/hub/reports', color: 'bg-red-500' }
	];

	onMount(async () => {
		// Initialize real-time data updates
		startRealTimeUpdates();
	});

	async function startRealTimeUpdates() {
		// TODO: Implement WebSocket or polling for real-time updates
		// For now, using a simple polling mechanism every 30 seconds
		const updateInterval = setInterval(async () => {
			await refreshDashboardData();
		}, 30000); // 30 seconds

		// Cleanup interval on component unmount
		return () => clearInterval(updateInterval);
	}

	async function refreshDashboardData() {
		try {
			isLoading = true;
			error = null;

			const response = await fetch(`/api/dashboard?branch=${data.branchId}&userId=${currentUser?.id}`);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();

			if (!result.success) {
				throw new Error(result.error || 'Unknown API error');
			}

			// Update dashboard data
			stats = result.data.stats;
			recentActivities = result.data.recentActivities;
			performanceMetrics = result.data.performanceMetrics;
			realTimeMetrics = result.data.realTimeMetrics || [];
		} catch (error) {
			console.error('Failed to refresh dashboard data:', error);
			error = error instanceof Error ? error.message : 'Unknown error occurred';
		} finally {
			isLoading = false;
		}
	}

	// Real-time metrics update handler
	function handleRealTimeUpdate(metrics: any[], updatedStats: any) {
		realTimeMetrics = metrics;
		stats = updatedStats;
	}

	// Activity feed update handler
	function handleActivityUpdate(updatedActivities: any[]) {
		recentActivities = updatedActivities.slice(0, 10); // Keep first 10 for the sidebar
	}

	// Performance analytics update handler
	function handleAnalyticsUpdate(analyticsData: any) {
		if (analyticsData.hourlyData) hourlyData = analyticsData.hourlyData;
		if (analyticsData.topPerformers) topPerformers = analyticsData.topPerformers;
		if (analyticsData.stats) stats = analyticsData.stats;
	}

	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
	}

	function getUserDisplayName(user: DirectusUser | null): string {
		if (!user) return 'Guest';
		if (user.first_name && user.last_name) {
			return `${user.first_name} ${user.last_name}`;
		}
		return user.email;
	}

	function formatActivityTime(activity: any): string {
		if (activity.timestamp) {
			return formatRelativeTime(new Date(activity.timestamp));
		}
		return activity.time;
	}
</script>

<svelte:head>
	<title>Dashboard - Staff Hub</title>
	<meta name="description" content="SOL Restaurant staff management dashboard" />
</svelte:head>

<div class="p-6">
	<!-- Page Header -->
	<div class="mb-8">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
				<p class="text-gray-600 mt-2">Welcome back, {getUserDisplayName(currentUser)}! Here's what's happening today.</p>
			</div>
			{#if isLoading}
				<div class="flex items-center space-x-2">
					<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-600"></div>
					<span class="text-sm text-gray-600">Updating...</span>
				</div>
			{/if}
		</div>
	</div>

	<!-- Error Message -->
	{#if error}
		<div class="mb-6">
			<Card class="border-red-200 bg-red-50 dark:bg-red-900/20">
				<div class="p-4">
					<div class="flex items-center">
						<svg class="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
						<div>
							<h3 class="text-sm font-medium text-red-800 dark:text-red-200">Data Loading Error</h3>
							<p class="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
						</div>
						<Button color="red" size="sm" onclick={refreshDashboardData} class="ml-auto">
							Retry
						</Button>
					</div>
				</div>
			</Card>
		</div>
	{/if}

	<!-- Enhanced Stats Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
		<Card hover={true} class="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/30 border-cyan-200 dark:border-cyan-800">
			<div class="p-6">
				<div class="flex items-center justify-between mb-4">
					<div class="p-3 bg-cyan-500 dark:bg-cyan-600 rounded-lg shadow-lg">
						<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"></path>
						</svg>
					</div>
					<Badge color="cyan" size="sm">+2.5%</Badge>
				</div>
				<div>
					<p class="text-sm font-medium text-cyan-700 dark:text-cyan-300 mb-1">Active Tables</p>
					<p class="text-3xl font-bold text-cyan-900 dark:text-cyan-100">{stats.activeTables}</p>
					<p class="text-xs text-cyan-600 dark:text-cyan-400 mt-2">2 tables waiting</p>
				</div>
			</div>
		</Card>

		<Card hover={true} class="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 border-green-200 dark:border-green-800">
			<div class="p-6">
				<div class="flex items-center justify-between mb-4">
					<div class="p-3 bg-green-500 dark:bg-green-600 rounded-lg shadow-lg">
						<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
					</div>
					<Badge color="success" size="sm">+8.2%</Badge>
				</div>
				<div>
					<p class="text-sm font-medium text-green-700 dark:text-green-300 mb-1">Today's Revenue</p>
					<p class="text-3xl font-bold text-green-900 dark:text-green-100">{formatCurrency(stats.todayRevenue)}</p>
					<p class="text-xs text-green-600 dark:text-green-400 mt-2">On track to exceed goal</p>
				</div>
			</div>
		</Card>

		<Card hover={true} class="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30 border-purple-200 dark:border-purple-800">
			<div class="p-6">
				<div class="flex items-center justify-between mb-4">
					<div class="p-3 bg-purple-500 dark:bg-purple-600 rounded-lg shadow-lg">
						<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
						</svg>
					</div>
					<Badge color="purple" size="sm">+12%</Badge>
				</div>
				<div>
					<p class="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">QR Codes Generated</p>
					<p class="text-3xl font-bold text-purple-900 dark:text-purple-100">24</p>
					<p class="text-xs text-purple-600 dark:text-purple-400 mt-2">All tables covered</p>
				</div>
			</div>
		</Card>

		<Card hover={true} class="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/30 border-orange-200 dark:border-orange-800">
			<div class="p-6">
				<div class="flex items-center justify-between mb-4">
					<div class="p-3 bg-orange-500 dark:bg-orange-600 rounded-lg shadow-lg">
						<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
						</svg>
					</div>
					<Badge color="warning" size="sm">Updated</Badge>
				</div>
				<div>
					<p class="text-sm font-medium text-orange-700 dark:text-orange-300 mb-1">Menu Items</p>
					<p class="text-3xl font-bold text-orange-900 dark:text-orange-100">156</p>
					<p class="text-xs text-orange-600 dark:text-orange-400 mt-2">Seasonal items added</p>
				</div>
			</div>
		</Card>
	</div>

	<!-- Real-time Metrics Section -->
	<div class="mb-8">
		<RealTimeMetrics
			metrics={realTimeMetrics}
			initialStats={stats}
			onUpdate={handleRealTimeUpdate}
		/>
	</div>

	<!-- Activity Feed Section -->
	<div class="mb-8">
		<ActivityFeed
			activities={recentActivities}
			maxItems={15}
			showFilters={true}
			realTimeUpdates={true}
			onUpdate={handleActivityUpdate}
		/>
	</div>

	<!-- Performance Analytics Section -->
	<div class="mb-8">
		<PerformanceAnalytics
			hourlyData={hourlyData}
			topPerformers={topPerformers}
			stats={stats}
			timeRange="today"
			onUpdate={handleAnalyticsUpdate}
		/>
	</div>

	<!-- Enhanced Main Content Grid -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Quick Actions (without Orders) -->
		<div class="lg:col-span-2">
			<Card class="p-6">
				<div class="flex items-center justify-between mb-6">
					<h2 class="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
					<Badge color="cyan" size="sm">4 Actions</Badge>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<a href="/hub/tables">
						<Card hover={true} class="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/30 border-cyan-200 dark:border-cyan-800 group">
							<div class="p-6 text-center">
								<div class="bg-cyan-500 dark:bg-cyan-600 p-4 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg mx-auto w-fit">
									<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"></path>
									</svg>
								</div>
								<h3 class="font-bold text-cyan-900 dark:text-cyan-100 mb-2">Manage Tables</h3>
								<p class="text-sm text-cyan-700 dark:text-cyan-300">View and update table status</p>
								<Badge color="cyan" size="xs" class="mt-3">18 Tables</Badge>
							</div>
						</Card>
					</a>

					<a href="/hub/qr-codes">
						<Card hover={true} class="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30 border-purple-200 dark:border-purple-800 group">
							<div class="p-6 text-center">
								<div class="bg-purple-500 dark:bg-purple-600 p-4 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg mx-auto w-fit">
									<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
									</svg>
								</div>
								<h3 class="font-bold text-purple-900 dark:text-purple-100 mb-2">QR Codes</h3>
								<p class="text-sm text-purple-700 dark:text-purple-300">Generate & manage QR codes</p>
								<Badge color="purple" size="xs" class="mt-3">24 Generated</Badge>
							</div>
						</Card>
					</a>

					<a href="/hub/qr-analytics">
						<Card hover={true} class="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/30 border-indigo-200 dark:border-indigo-800 group">
							<div class="p-6 text-center">
								<div class="bg-indigo-500 dark:bg-indigo-600 p-4 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg mx-auto w-fit">
									<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
									</svg>
								</div>
								<h3 class="font-bold text-indigo-900 dark:text-indigo-100 mb-2">QR Analytics</h3>
								<p class="text-sm text-indigo-700 dark:text-indigo-300">Track QR performance</p>
								<Badge color="info" size="xs" class="mt-3">Real-time</Badge>
							</div>
						</Card>
					</a>

					<a href="/hub/menu">
						<Card hover={true} class="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/30 border-orange-200 dark:border-orange-800 group">
							<div class="p-6 text-center">
								<div class="bg-orange-500 dark:bg-orange-600 p-4 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg mx-auto w-fit">
									<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
									</svg>
								</div>
								<h3 class="font-bold text-orange-900 dark:text-orange-100 mb-2">Menu Management</h3>
								<p class="text-sm text-orange-700 dark:text-orange-300">Update menu items and pricing</p>
								<Badge color="warning" size="xs" class="mt-3">156 Items</Badge>
							</div>
						</Card>
					</a>

					<a href="/hub/reports">
						<Card hover={true} class="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/30 border-red-200 dark:border-red-800 group">
							<div class="p-6 text-center">
								<div class="bg-red-500 dark:bg-red-600 p-4 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg mx-auto w-fit">
									<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
									</svg>
								</div>
								<h3 class="font-bold text-red-900 dark:text-red-100 mb-2">Reports</h3>
								<p class="text-sm text-red-700 dark:text-red-300">View analytics and insights</p>
								<Badge color="danger" size="xs" class="mt-3">New Reports</Badge>
							</div>
						</Card>
					</a>
				</div>
			</Card>
		</div>

		<!-- Quick Stats Summary -->
		<div>
			<Card class="p-6">
				<div class="flex items-center justify-between mb-6">
					<h2 class="text-xl font-bold text-gray-900 dark:text-white">Quick Stats</h2>
					<Badge color="cyan" size="sm">Today</Badge>
				</div>
				<div class="space-y-4">
					<div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
						<div class="flex items-center space-x-3">
							<div class="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
								<svg class="w-4 h-4 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"></path>
								</svg>
							</div>
							<div>
								<p class="text-sm font-medium text-gray-900 dark:text-white">Active Tables</p>
								<p class="text-xs text-gray-500 dark:text-gray-400">Currently in use</p>
							</div>
						</div>
						<span class="text-lg font-bold text-cyan-600 dark:text-cyan-400">{stats.activeTables}</span>
					</div>

					<div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
						<div class="flex items-center space-x-3">
							<div class="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
								<svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
								</svg>
							</div>
							<div>
								<p class="text-sm font-medium text-gray-900 dark:text-white">Revenue</p>
								<p class="text-xs text-gray-500 dark:text-gray-400">Today's total</p>
							</div>
						</div>
						<span class="text-lg font-bold text-green-600 dark:text-green-400">{formatCurrency(stats.todayRevenue / 1000000)}M</span>
					</div>

					<div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
						<div class="flex items-center space-x-3">
							<div class="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
								<svg class="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
								</svg>
							</div>
							<div>
								<p class="text-sm font-medium text-gray-900 dark:text-white">Staff Online</p>
								<p class="text-xs text-gray-500 dark:text-gray-400">Active now</p>
							</div>
						</div>
						<span class="text-lg font-bold text-purple-600 dark:text-purple-400">{stats.staffOnline}</span>
					</div>

					<div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
						<div class="flex items-center space-x-3">
							<div class="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
								<svg class="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
								</svg>
							</div>
							<div>
								<p class="text-sm font-medium text-gray-900 dark:text-white">Pending</p>
								<p class="text-xs text-gray-500 dark:text-gray-400">Orders waiting</p>
							</div>
						</div>
						<span class="text-lg font-bold text-orange-600 dark:text-orange-400">{stats.pendingOrders}</span>
					</div>
				</div>
			</Card>
		</div>
	</div>
</div>