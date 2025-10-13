<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	// Mock user data - will be replaced with actual authentication
	let currentUser = {
		name: 'John Doe',
		role: 'Branch Manager',
		brand: 'Kohaku',
		branch: 'S79 Teppanyaki - District 1',
		phone: '+84912345678',
		email: 'john.doe@sol.com.vn',
		avatar: null
	};

	// Dashboard stats
	let stats = {
		todayOrders: 124,
		todayRevenue: 45600000,
		activeTables: 18,
		pendingOrders: 3
	};

	// Recent activities
	let recentActivities = [
		{ id: 1, type: 'order', message: 'New order from Table 5', time: '2 minutes ago', user: 'Customer' },
		{ id: 2, type: 'staff', message: 'Staff login: Nguyen Van A', time: '15 minutes ago', user: 'System' },
		{ id: 3, type: 'table', message: 'Table 8 marked as available', time: '23 minutes ago', user: 'Waiter B' },
		{ id: 4, type: 'payment', message: 'Payment received: 2,450,000₫', time: '1 hour ago', user: 'Customer' }
	];

	// Quick actions
	let quickActions = [
		{ id: 1, title: 'View Orders', icon: '📋', href: '/hub/orders', color: 'bg-blue-500' },
		{ id: 2, title: 'Manage Tables', icon: '🪑', href: '/hub/tables', color: 'bg-green-500' },
		{ id: 3, title: 'Generate QR Codes', icon: '📱', href: '/hub/qr-codes', color: 'bg-purple-500' },
		{ id: 4, title: 'Menu Management', icon: '📝', href: '/hub/menu', color: 'bg-orange-500' },
		{ id: 5, title: 'Staff Schedule', icon: '👥', href: '/hub/schedule', color: 'bg-indigo-500' },
		{ id: 6, title: 'Reports', icon: '📊', href: '/hub/reports', color: 'bg-red-500' }
	];

	// Performance metrics
	let performanceMetrics = [
		{ label: 'Avg Order Value', value: '368,000₫', change: '+12%', positive: true },
		{ label: 'Table Turnover', value: '3.2x', change: '+8%', positive: true },
		{ label: 'Customer Satisfaction', value: '4.8/5', change: '+0.2', positive: true },
		{ label: 'Staff Efficiency', value: '89%', change: '-3%', positive: false }
	];

	onMount(() => {
		// Load actual user data and stats from API
		loadUserData();
		loadDashboardStats();
	});

	async function loadUserData() {
		// TODO: Load user data from authentication API
		// currentUser = await getUserFromSession();
	}

	async function loadDashboardStats() {
		// TODO: Load real stats from API
		// stats = await getDashboardStats(currentUser.branch, currentUser.brand);
	}

	function handleLogout() {
		// TODO: Implement actual logout logic
		goto('/');
	}

	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
	}

	function getActivityIcon(type: string) {
		switch (type) {
			case 'order': return '📋';
			case 'staff': return '👤';
			case 'table': return '🪑';
			case 'payment': return '💰';
			default: return '📌';
		}
	}
</script>

<svelte:head>
	<title>Staff Hub - SOL Restaurant</title>
	<meta name="description" content="SOL Restaurant staff management portal" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Top Navigation -->
	<nav class="bg-white shadow-sm border-b">
		<div class="px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between h-16">
				<div class="flex items-center">
					<!-- Logo -->
					<div class="flex items-center">
						<img
							src="/logos/logo_trim.png"
							alt="SOL"
							class="h-8 w-auto mr-3"
						/>
						<div>
							<h1 class="text-xl font-semibold text-gray-900">Staff Hub</h1>
							<p class="text-sm text-gray-600">{currentUser.brand} - {currentUser.branch}</p>
						</div>
					</div>

					<!-- Context Switcher -->
					<div class="hidden md:flex items-center space-x-4 ml-10">
						<div class="flex items-center space-x-2">
							<span class="text-sm text-gray-600">Current:</span>
							<select class="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
								<option>{currentUser.branch}</option>
								<!-- More branches will be loaded based on user permissions -->
							</select>
						</div>
					</div>
				</div>

				<!-- Right side buttons -->
				<div class="flex items-center space-x-4">
					<!-- Notifications -->
					<button class="p-2 text-gray-600 hover:text-gray-900 relative">
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
						</svg>
						<span class="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
					</button>

					<!-- User Menu -->
					<div class="flex items-center space-x-3">
						<div class="text-right hidden md:block">
							<p class="text-sm font-medium text-gray-900">{currentUser.name}</p>
							<p class="text-xs text-gray-600">{currentUser.role}</p>
						</div>
						<div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
							{currentUser.name.split(' ').map(n => n[0]).join('')}
						</div>
						<button
							on:click={handleLogout}
							class="p-2 text-gray-600 hover:text-gray-900"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>
	</nav>

	<!-- Main Content -->
	<div class="flex h-[calc(100vh-4rem)]">
		<!-- Sidebar -->
		<aside class="w-64 bg-white shadow-sm border-r overflow-y-auto">
			<div class="p-4">
				<h2 class="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">Navigation</h2>
				<nav class="space-y-2">
					<a
						href="/hub"
						class="flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg"
					>
						<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
						</svg>
						Dashboard
					</a>
					<a
						href="/hub/orders"
						class="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
					>
						<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
						</svg>
						Orders
					</a>
					<a
						href="/hub/tables"
						class="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
					>
						<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"></path>
						</svg>
						Tables
					</a>
					<a
						href="/hub/qr-codes"
						class="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
					>
						<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
						</svg>
						QR Codes
					</a>
					<a
						href="/hub/menu"
						class="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
					>
						<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
						</svg>
						Menu
					</a>
					<a
						href="/hub/staff"
						class="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
					>
						<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
						</svg>
						Staff
					</a>
					<a
						href="/hub/reports"
						class="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
					>
						<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
						</svg>
						Reports
					</a>
				</nav>

				<div class="mt-8 pt-8 border-t">
					<h3 class="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">Quick Stats</h3>
					<div class="space-y-3">
						<div class="flex justify-between items-center">
							<span class="text-sm text-gray-600">Today's Orders</span>
							<span class="text-sm font-semibold">{stats.todayOrders}</span>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-sm text-gray-600">Revenue</span>
							<span class="text-sm font-semibold">{formatCurrency(stats.todayRevenue)}</span>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-sm text-gray-600">Active Tables</span>
							<span class="text-sm font-semibold">{stats.activeTables}/20</span>
						</div>
					</div>
				</div>
			</div>
		</aside>

		<!-- Main Dashboard Content -->
		<main class="flex-1 overflow-y-auto">
			<div class="p-6">
				<!-- Page Header -->
				<div class="mb-8">
					<h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
					<p class="text-gray-600 mt-2">Welcome back, {currentUser.name}! Here's what's happening today.</p>
				</div>

				<!-- Stats Grid -->
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<div class="bg-white rounded-lg shadow p-6">
						<div class="flex items-center">
							<div class="p-3 bg-blue-100 rounded-lg">
								<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
								</svg>
							</div>
							<div class="ml-4">
								<p class="text-sm font-medium text-gray-600">Today's Orders</p>
								<p class="text-2xl font-semibold text-gray-900">{stats.todayOrders}</p>
							</div>
						</div>
					</div>

					<div class="bg-white rounded-lg shadow p-6">
						<div class="flex items-center">
							<div class="p-3 bg-green-100 rounded-lg">
								<svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
								</svg>
							</div>
							<div class="ml-4">
								<p class="text-sm font-medium text-gray-600">Today's Revenue</p>
								<p class="text-2xl font-semibold text-gray-900">{formatCurrency(stats.todayRevenue)}</p>
							</div>
						</div>
					</div>

					<div class="bg-white rounded-lg shadow p-6">
						<div class="flex items-center">
							<div class="p-3 bg-yellow-100 rounded-lg">
								<svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"></path>
								</svg>
							</div>
							<div class="ml-4">
								<p class="text-sm font-medium text-gray-600">Active Tables</p>
								<p class="text-2xl font-semibold text-gray-900">{stats.activeTables}</p>
							</div>
						</div>
					</div>

					<div class="bg-white rounded-lg shadow p-6">
						<div class="flex items-center">
							<div class="p-3 bg-red-100 rounded-lg">
								<svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
								</svg>
							</div>
							<div class="ml-4">
								<p class="text-sm font-medium text-gray-600">Pending Orders</p>
								<p class="text-2xl font-semibold text-gray-900">{stats.pendingOrders}</p>
							</div>
						</div>
					</div>
				</div>

				<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<!-- Quick Actions -->
					<div class="lg:col-span-2">
						<div class="bg-white rounded-lg shadow p-6">
							<h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
							<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
								{#each quickActions as action}
									<a
										href={action.href}
										class="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
									>
										<div class="{action.color} p-3 rounded-lg mb-3">
											<span class="text-2xl">{action.icon}</span>
										</div>
										<span class="text-sm font-medium text-gray-900 text-center">{action.title}</span>
									</a>
								{/each}
							</div>
						</div>

						<!-- Performance Metrics -->
						<div class="bg-white rounded-lg shadow p-6 mt-6">
							<h2 class="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h2>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
								{#each performanceMetrics as metric}
									<div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
										<div>
											<p class="text-sm font-medium text-gray-600">{metric.label}</p>
											<p class="text-xl font-semibold text-gray-900">{metric.value}</p>
										</div>
										<div class="text-right">
											<span class="text-sm font-medium {metric.positive ? 'text-green-600' : 'text-red-600'}">
												{metric.change}
											</span>
										</div>
									</div>
								{/each}
							</div>
						</div>
					</div>

					<!-- Recent Activity -->
					<div class="bg-white rounded-lg shadow p-6">
						<h2 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
						<div class="space-y-4">
							{#each recentActivities as activity}
								<div class="flex items-start space-x-3">
									<div class="text-2xl">{getActivityIcon(activity.type)}</div>
									<div class="flex-1">
										<p class="text-sm text-gray-900">{activity.message}</p>
										<p class="text-xs text-gray-500">{activity.time} • {activity.user}</p>
									</div>
								</div>
							{/each}
						</div>
						<div class="mt-4 text-center">
							<a href="/hub/activity" class="text-sm text-blue-600 hover:text-blue-800 font-medium">
								View all activity →
							</a>
						</div>
					</div>
				</div>
			</div>
		</main>
	</div>
</div>