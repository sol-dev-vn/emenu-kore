<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import Card from '$lib/components/flowbite/Card.svelte';
	import Badge from '$lib/components/flowbite/Badge.svelte';
	import type { RealTimeMetric, DashboardStats } from '$lib/server/dashboard';

	export let metrics: RealTimeMetric[] = [];
	export let initialStats: DashboardStats;
	export let onUpdate: ((metrics: RealTimeMetric[], stats: DashboardStats) => void) | null = null;

	let updateInterval: NodeJS.Timeout | null = null;
	let lastUpdate = new Date();
	let isUpdating = false;

	// Create event dispatcher for real-time updates
	const dispatcher = createEventDispatcher();

	onMount(() => {
		// Start real-time updates
		startRealTimeUpdates();

		// Listen for custom updates from parent components
		dispatcher.on('updateMetrics', handleManualUpdate);
	});

	onDestroy(() => {
		if (updateInterval) {
			clearInterval(updateInterval);
		}
	});

	function startRealTimeUpdates() {
		// Update metrics at intervals based on their configured updateInterval
		updateInterval = setInterval(() => {
			updateMetrics();
		}, 5000); // Check every 5 seconds for metrics that need updating
	}

	async function updateMetrics() {
		if (isUpdating) return;

		isUpdating = true;
		lastUpdate = new Date();

		try {
			// Simulate real-time metric updates
			// In a real implementation, this would fetch from WebSocket or API
			metrics = metrics.map(metric => {
				// Random variation to simulate real-time changes
				const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
				const newValue = metric.value * (1 + variation);

				// Calculate trend
				let newTrend: 'up' | 'down' | 'stable' = 'stable';
				const trendValue = newValue - metric.value;

				if (Math.abs(trendValue) > metric.value * 0.02) {
					newTrend = trendValue > 0 ? 'up' : 'down';
				}

				return {
					...metric,
					value: Math.max(0, newValue), // Ensure no negative values
					trend: newTrend,
					trendValue: Math.abs(trendValue)
				};
			});

			// Also update some basic stats
			if (initialStats) {
				const statsVariation = {
					todayOrders: Math.floor(Math.random() * 5) - 2, // ±2 orders
					todayRevenue: Math.floor(Math.random() * 2000000) - 1000000, // ±1M revenue
					activeTables: Math.floor(Math.random() * 4) - 2, // ±2 tables
					pendingOrders: Math.max(0, Math.floor(Math.random() * 3) - 1) // ±1 pending
				};

				initialStats = {
					...initialStats,
					todayOrders: Math.max(0, initialStats.todayOrders + statsVariation.todayOrders),
					todayRevenue: Math.max(0, initialStats.todayRevenue + statsVariation.todayRevenue),
					activeTables: Math.max(0, initialStats.activeTables + statsVariation.activeTables),
					pendingOrders: Math.max(0, initialStats.pendingOrders + statsVariation.pendingOrders),
					totalCustomers: Math.max(0, initialStats.totalCustomers + Math.floor(Math.random() * 10) - 5),
					averageOrderValue: Math.max(0, initialStats.averageOrderValue + (Math.random() * 50000) - 25000),
					occupancyRate: Math.min(100, Math.max(0, initialStats.occupancyRate + (Math.random() * 10) - 5)),
					staffOnline: Math.max(1, Math.min(12, initialStats.staffOnline + Math.floor(Math.random() * 3) - 1))
				};
			}

			// Notify parent component of updates
			if (onUpdate) {
				onUpdate(metrics, initialStats);
			}

		} catch (error) {
			console.error('Failed to update real-time metrics:', error);
		} finally {
			isUpdating = false;
		}
	}

	function handleManualUpdate(event: CustomEvent) {
		const { newMetrics, newStats } = event.detail;
		if (newMetrics) metrics = newMetrics;
		if (newStats) initialStats = newStats;
	}

	function formatValue(value: number, unit: string): string {
		switch (unit) {
			case '₫':
				return new Intl.NumberFormat('vi-VN').format(Math.floor(value));
			case 'orders/min':
			case 'x/hour':
				return value.toFixed(1);
			case '%':
				return Math.floor(value).toString() + '%';
			case 'customers/hour':
				return Math.floor(value).toString();
			default:
				return value.toString();
		}
	}

	function getTrendColor(trend: 'up' | 'down' | 'stable'): string {
		switch (trend) {
			case 'up': return 'success';
			case 'down': return 'danger';
			default: return 'secondary';
		}
	}

	function getTrendIcon(trend: 'up' | 'down' | 'stable'): string {
		switch (trend) {
			case 'up': return '↑';
			case 'down': return '↓';
			default: '→';
		}
	}

	function getCategoryColor(category: string): string {
		switch (category) {
			case 'orders': return 'blue';
			case 'revenue': return 'green';
			case 'customers': return 'purple';
			case 'tables': return 'orange';
			case 'staff': return 'indigo';
			default: return 'gray';
		}
	}

	function getCategoryIcon(category: string): string {
		switch (category) {
			case 'orders': return '📋';
			case 'revenue': return '💰';
			case 'customers': return '👥';
			case 'tables': return '🪑';
			case 'staff': return '👨‍🍳';
			default: '📊';
		}
	}
</script>

<div class="space-y-6">
	<!-- Real-time Metrics Header -->
	<div class="flex items-center justify-between mb-4">
		<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Real-time Metrics</h3>
		<div class="flex items-center space-x-2">
			<div class={`w-2 h-2 rounded-full ${isUpdating ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
			<span class="text-sm text-gray-600 dark:text-gray-400">
				{isUpdating ? 'Updating...' : 'Live'}
			</span>
			<span class="text-xs text-gray-500 dark:text-gray-500 ml-2">
				Last update: {lastUpdate.toLocaleTimeString()}
			</span>
		</div>
	</div>

	<!-- Metrics Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
		{#each metrics as metric (metric.id)}
			<Card hover={true} class="relative overflow-hidden">
				<div class="p-4">
					<!-- Metric Header -->
					<div class="flex items-start justify-between mb-2">
						<div class="flex items-center space-x-2">
							<span class="text-lg" title={metric.name}>
								{getCategoryIcon(metric.category)}
							</span>
							<div>
								<p class="text-xs text-gray-600 dark:text-gray-400 leading-tight">{metric.name}</p>
								<p class="text-xs text-gray-500 dark:text-gray-500">
									Updates every {metric.updateInterval}s
								</p>
							</div>
						</div>
						<Badge color={getCategoryColor(metric.category)} size="sm" class="text-xs">
							{metric.category}
						</Badge>
					</div>

					<!-- Metric Value -->
					<div class="flex items-baseline space-x-2 mb-2">
						<span class="text-2xl font-bold text-gray-900 dark:text-white">
							{formatValue(metric.value, metric.unit)}
						</span>
						<span class="text-sm text-gray-600 dark:text-gray-400">
							{metric.unit}
						</span>
					</div>

					<!-- Trend Indicator -->
					<div class="flex items-center justify-between">
						<div class="flex items-center space-x-2">
							<span class={`text-sm font-medium ${getTrendColor(metric.trend) === 'success' ? 'text-green-600' : getTrendColor(metric.trend) === 'danger' ? 'text-red-600' : 'text-gray-600'}`}>
								{getTrendIcon(metric.trend)} {metric.trendValue > 0 ? '+' : ''}{formatValue(metric.trendValue, metric.unit)}
							</span>
						</div>

						{#if metric.target}
							<div class="flex items-center">
								<div class="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
									<div
										class="bg-cyan-600 h-2 rounded-full transition-all duration-300"
										style="width: {Math.min(100, (metric.value / metric.target) * 100)}%"
									></div>
								</div>
								<span class="text-xs text-gray-600 dark:text-gray-400 ml-2">
									{Math.round((metric.value / metric.target) * 100)}%
								</span>
							</div>
						{/if}
					</div>

					<!-- Update Indicator -->
					<div class="absolute top-2 right-2">
						<div class={`w-2 h-2 rounded-full ${isUpdating ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
					</div>
				</div>
			</Card>
		{/each}
	</div>

	<!-- Performance Summary -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
		<!-- Orders Performance -->
		<Card>
			<div class="p-4">
				<div class="flex items-center justify-between mb-2">
					<h4 class="text-sm font-medium text-gray-900 dark:text-white">Orders Performance</h4>
					<Badge color={initialStats.todayOrders > 100 ? 'success' : 'warning'} size="sm">
						{initialStats.todayOrders > 100 ? 'Good' : 'Low'}
					</Badge>
				</div>
				<div class="space-y-2">
					<div class="flex justify-between">
						<span class="text-sm text-gray-600 dark:text-gray-400">Today:</span>
						<span class="font-medium">{initialStats.todayOrders}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-sm text-gray-600 dark:text-gray-400">Average/hr:</span>
						<span class="font-medium">{Math.floor(initialStats.todayOrders / 8)}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-sm text-gray-600 dark:text-gray-400">Peak hr:</span>
						<span class="font-medium">19:00</span>
					</div>
				</div>
			</div>
		</Card>

		<!-- Revenue Performance -->
		<Card>
			<div class="p-4">
				<div class="flex items-center justify-between mb-2">
					<h4 class="texttext-sm font-medium text-gray-900 dark:text-white">Revenue Performance</h4>
					<Badge color={initialStats.todayRevenue > 40000000 ? 'success' : 'warning'} size="sm">
						{initialStats.todayRevenue > 40000000 ? 'Good' : 'Low'}
					</Badge>
				</div>
				<div class="space-y-2">
					<div class="flex justify-between">
						<span class="text-sm text-gray-600 dark:text-gray-400">Today:</span>
						<span class="font-medium">₫{new Intl.NumberFormat('vi-VN').format(initialStats.todayRevenue)}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-sm text-gray-600 dark:text-gray-400">Avg/order:</span>
						<span class="font-medium">₫{new Intl.NumberFormat('vi-VN').format(initialStats.averageOrderValue)}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-sm text-gray-600 dark:text-gray-400">Target:</span>
						<span class="font-medium">₫50,000,000</span>
					</div>
				</div>
			</div>
		</Card>

		<!-- Operations Performance -->
		<Card>
			<div class="p-4">
				<div class="flex items-center justify-between mb-2">
					<h4 class="text-sm font-medium text-gray-900 dark:text-white">Operations</h4>
					<Badge color={initialStats.occupancyRate > 70 ? 'success' : 'warning'} size="sm">
						{initialStats.occupancyRate > 70 ? 'Optimal' : 'Low'}
					</Badge>
				</div>
				<div class="space-y-2">
					<div class="flex justify-between">
						<span class="text-sm text-gray-600 dark:text-gray-400">Tables:</span>
						<span class="font-medium">{initialStats.activeTables}/{initialStats.totalTables}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-sm text-gray-600 dark:text-gray-400">Occupancy:</span>
						<span class="font-medium">{initialStats.occupancyRate}%</span>
					</div>
					<div class="flex justify-between">
						<span class="text-sm text-gray-600 dark:text-gray-400">Staff:</span>
						<span class="font-medium">{initialStats.staffOnline} online</span>
					</div>
				</div>
			</div>
		</Card>
	</div>
</div>

<style>
	@keyframes pulse {
		0%, 100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	.animate-pulse {
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}
</style>