<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import Card from '$lib/components/flowbite/Card.svelte';
	import Badge from '$lib/components/flowbite/Badge.svelte';
	import Button from '$lib/components/flowbite/Button.svelte';
	import type { HourlyData, TopPerformer, DashboardStats } from '$lib/server/dashboard';

	export let hourlyData: HourlyData[] = [];
	export let topPerformers: { staff: TopPerformer[]; tables: TopPerformer[]; items: TopPerformer[] };
	export let stats: DashboardStats;
	export let timeRange: 'today' | 'week' | 'month' = 'today';
	export let onUpdate: ((data: any) => void) | null = null;

	let updateInterval: NodeJS.Timeout | null = null;
	let isUpdating = false;
	let selectedChart: 'revenue' | 'orders' | 'customers' = 'revenue';
	let showDetails: boolean = false;
	let chartData: number[] = [];

	// Event dispatcher for real-time updates
	const dispatcher = createEventDispatcher();

	// Time range options
	const timeRanges = [
		{ value: 'today', label: 'Today', hours: 24 },
		{ value: 'week', label: 'This Week', hours: 168 },
		{ value: 'month', label: 'This Month', hours: 720 }
	];

	// Chart type options
	const chartTypes = [
		{ value: 'revenue', label: 'Revenue', color: 'green', unit: '₫' },
		{ value: 'orders', label: 'Orders', color: 'blue', unit: 'orders' },
		{ value: 'customers', label: 'Customers', color: 'purple', unit: 'customers' }
	];

	onMount(() => {
		updateChartData();
		startRealTimeUpdates();
	});

	onDestroy(() => {
		if (updateInterval) {
			clearInterval(updateInterval);
		}
	});

	function startRealTimeUpdates() {
		// Update analytics every 60 seconds
		updateInterval = setInterval(() => {
			updateAnalytics();
		}, 60000);

		// Listen for custom updates from parent components
		dispatcher.on('updateAnalytics', handleManualUpdate);
	}

	async function updateAnalytics() {
		if (isUpdating) return;

		isUpdating = true;

		try {
			// Simulate real-time analytics updates
			// In a real implementation, this would fetch from WebSocket or API
			updateChartData();
			updateTopPerformers();

			// Notify parent component of updates
			if (onUpdate) {
				onUpdate({
					hourlyData,
					topPerformers,
					stats
				});
			}
		} catch (error) {
			console.error('Failed to update analytics:', error);
		} finally {
			isUpdating = false;
		}
	}

	function handleManualUpdate(event: CustomEvent) {
		const { newHourlyData, newTopPerformers, newStats } = event.detail;
		if (newHourlyData) hourlyData = newHourlyData;
		if (newTopPerformers) topPerformers = newTopPerformers;
		if (newStats) stats = newStats;
		updateChartData();
	}

	function updateChartData() {
		switch (selectedChart) {
			case 'revenue':
				chartData = hourlyData.map(data => data.revenue);
				break;
			case 'orders':
				chartData = hourlyData.map(data => data.orders);
				break;
			case 'customers':
				chartData = hourlyData.map(data => data.customers);
				break;
		}
	}

	function updateTopPerformers() {
		// Simulate small variations in top performers
		topPerformers.staff.forEach(performer => {
			const variation = (Math.random() - 0.5) * 0.1;
			performer.value = Math.max(0, performer.value * (1 + variation));
			performer.change = Math.floor((Math.random() - 0.5) * 20);
		});

		topPerformers.tables.forEach(performer => {
			const variation = (Math.random() - 0.5) * 0.1;
			performer.value = Math.max(0, performer.value * (1 + variation));
			performer.change = Math.floor((Math.random() - 0.5) * 30);
		});

		topPerformers.items.forEach(performer => {
			const variation = (Math.random() - 0.5) * 0.1;
			performer.value = Math.max(0, Math.floor(performer.value * (1 + variation)));
			performer.change = Math.floor((Math.random() - 0.5) * 15);
		});
	}

	$: chartMax = Math.max(...chartData, 1);
	$: chartAverage = chartData.length > 0 ? chartData.reduce((sum, val) => sum + val, 0) / chartData.length : 0;

	function formatChartValue(value: number): string {
		switch (selectedChart) {
			case 'revenue':
				if (value >= 1000000) {
					return `${(value / 1000000).toFixed(1)}M`;
				}
				if (value >= 1000) {
					return `${(value / 1000).toFixed(0)}K`;
				}
				return value.toString();
			case 'orders':
			case 'customers':
				return Math.floor(value).toString();
			default:
				return value.toString();
		}
	}

	function getPerformerIcon(metric: string): string {
		switch (metric.toLowerCase()) {
			case 'orders': return '📋';
			case 'revenue': return '💰';
			case 'sessions': return '🍽️';
			case 'rating': return '⭐';
			case 'turnover': return '🔄';
			default: return '📊';
		}
	}

	function getPerformanceColor(change: number): string {
		if (change > 0) return 'success';
		if (change < 0) return 'danger';
		return 'secondary';
	}

	function getPerformanceIcon(change: number): string {
		if (change > 0) return '↑';
		if (change < 0) return '↓';
		return '→';
	}

	function calculateInsight(): string {
		switch (selectedChart) {
			case 'revenue':
				if (chartAverage > 3000000) return 'Excellent revenue performance - above target';
				if (chartAverage > 2000000) return 'Good revenue performance - on track';
				return 'Revenue needs improvement - consider promotions';
			case 'orders':
				if (chartAverage > 15) return 'High order volume - excellent service';
				if (chartAverage > 10) return 'Good order volume - steady business';
				return 'Lower order volume - consider marketing efforts';
			case 'customers':
				if (chartAverage > 30) return 'High customer traffic - great ambiance';
				if (chartAverage > 20) return 'Good customer flow - steady business';
				return 'Lower customer traffic - consider visibility improvements';
			default:
				return 'Analytics loading...';
		}
	}

	function getRecommendation(): string {
		switch (selectedChart) {
			case 'revenue':
				return 'Focus on upselling high-margin items and promoting special offers during slower periods.';
			case 'orders':
				return 'Optimize table turnover and consider implementing table reservations during peak hours.';
			case 'customers':
				return 'Enhance customer experience and implement loyalty programs to increase repeat visits.';
			default:
				return 'Monitor performance trends and adjust operations accordingly.';
		}
	}
</script>

<!-- Performance Analytics Header -->
<div class="space-y-6">
	<!-- Header with Controls -->
	<div class="flex items-center justify-between">
		<div class="flex items-center space-x-3">
			<h2 class="text-xl font-bold text-gray-900 dark:text-white">Performance Analytics</h2>
			<div class="flex items-center space-x-2">
				<div class={`w-2 h-2 rounded-full ${isUpdating ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
				<span class="text-sm text-gray-600 dark:text-gray-400">
					{isUpdating ? 'Updating...' : 'Live'}
				</span>
			</div>
		</div>
		<div class="flex items-center space-x-2">
			<!-- Time Range Selector -->
			<div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
				{#each timeRanges as range}
					<button
						class={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
							timeRange === range.value
								? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
								: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
						}`}
						onclick={() => timeRange = range.value}
					>
						{range.label}
					</button>
				{/each}
			</div>
			<Button color="secondary" size="sm" onclick={updateAnalytics} disabled={isUpdating}>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
				</svg>
			</Button>
		</div>
	</div>

	<!-- Main Analytics Grid -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Chart Section (2 columns) -->
		<div class="lg:col-span-2 space-y-6">
			<!-- Chart Type Selector -->
			<Card>
				<div class="p-6">
					<div class="flex items-center justify-between mb-6">
						<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Performance Trends</h3>
						<div class="flex space-x-2">
							{#each chartTypes as type}
								<button
									class={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
										selectedChart === type.value
											? 'bg-cyan-600 text-white'
											: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
									}`}
									onclick={() => { selectedChart = type.value; updateChartData(); }}
								>
									{type.label}
								</button>
							{/each}
						</div>
					</div>

					<!-- Chart Visualization -->
					<div class="h-64 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 relative">
						<div class="absolute top-2 left-2 text-xs text-gray-500 dark:text-gray-400">
							{chartTypes.find(t => t.value === selectedChart)?.unit}
						</div>
						<div class="absolute top-2 right-2 text-xs text-gray-500 dark:text-gray-400">
							Avg: {formatChartValue(chartAverage)}
						</div>

						<!-- Simple Bar Chart -->
						<div class="h-full flex items-end justify-around">
							{#each chartData as value, index}
								<div class="flex-1 mx-1 flex flex-col items-center justify-end">
									<div
										class="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t transition-all duration-300 hover:from-cyan-700 hover:to-cyan-500"
										style="height: ${(value / chartMax) * 100}%; min-height: 4px;"
										title="{formatChartValue(value)} at {index}:00"
									></div>
									<span class="text-xs text-gray-500 dark:text-gray-400 mt-1">
										{index % 6 === 0 ? `${index}:00` : ''}
									</span>
								</div>
							{/each}
						</div>
					</div>

					<!-- Chart Insights -->
					<div class="mt-4 p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800">
						<div class="flex items-start space-x-3">
							<div class="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
								<svg class="w-4 h-4 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
								</svg>
							</div>
							<div class="flex-1">
								<p class="text-sm font-medium text-cyan-900 dark:text-cyan-100 mb-1">
									{calculateInsight()}
								</p>
								<p class="text-xs text-cyan-700 dark:text-cyan-300">
									{getRecommendation()}
								</p>
							</div>
						</div>
					</div>
				</div>
			</Card>

			<!-- Top Performers -->
			<Card>
				<div class="p-6">
					<div class="flex items-center justify-between mb-6">
						<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Top Performers</h3>
						<Button color="secondary" size="sm" onclick={() => showDetails = !showDetails}>
							{showDetails ? 'Show Less' : 'Show Details'}
						</Button>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
						<!-- Top Staff -->
						<div>
							<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Staff</h4>
							<div class="space-y-2">
								{#each topPerformers.staff.slice(0, showDetails ? 5 : 3) as performer}
									<div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
										<div class="flex items-center space-x-2">
											<span class="text-sm">{getPerformerIcon(performer.metric)}</span>
											<span class="text-xs font-medium text-gray-900 dark:text-white truncate max-w-[100px]">
												{performer.name}
											</span>
										</div>
										<div class="flex items-center space-x-1">
											<span class="text-xs font-medium text-gray-900 dark:text-white">
												{performer.value > 1000 ? `${(performer.value / 1000000).toFixed(1)}M` :
												 performer.value > 100 ? `${(performer.value / 1000).toFixed(0)}K` :
												 Math.floor(performer.value).toString()}
											</span>
											<div class="flex items-center space-x-1">
												<svg class="w-3 h-3 {getPerformanceColor(performer.change) === 'success' ? 'text-green-500' : getPerformanceColor(performer.change) === 'danger' ? 'text-red-500' : 'text-gray-500'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
												</svg>
												<span class="text-xs {getPerformanceColor(performer.change) === 'success' ? 'text-green-600' : getPerformanceColor(performer.change) === 'danger' ? 'text-red-600' : 'text-gray-600'}">
													{getPerformanceIcon(performer.change)}{Math.abs(performer.change)}%
												</span>
											</div>
										</div>
									</div>
								{/each}
							</div>
						</div>

						<!-- Top Tables -->
						<div>
							<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Tables</h4>
							<div class="space-y-2">
								{#each topPerformers.tables.slice(0, showDetails ? 5 : 3) as performer}
									<div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
										<div class="flex items-center space-x-2">
											<span class="text-sm">{getPerformerIcon(performer.metric)}</span>
											<span class="text-xs font-medium text-gray-900 dark:text-white">
												{performer.name}
											</span>
										</div>
										<div class="flex items-center space-x-1">
											<span class="text-xs font-medium text-gray-900 dark:text-white">
												{performer.value > 1000 ? `${(performer.value / 1000000).toFixed(1)}M` :
												 performer.value > 100 ? `${(performer.value / 1000).toFixed(0)}K` :
												 Math.floor(performer.value).toString()}
											</span>
											<div class="flex items-center space-x-1">
												<svg class="w-3 h-3 {getPerformanceColor(performer.change) === 'success' ? 'text-green-500' : getPerformanceColor(performer.change) === 'danger' ? 'text-red-500' : 'text-gray-500'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
												</svg>
												<span class="text-xs {getPerformanceColor(performer.change) === 'success' ? 'text-green-600' : getPerformanceColor(performer.change) === 'danger' ? 'text-red-600' : 'text-gray-600'}">
													{getPerformanceIcon(performer.change)}{Math.abs(performer.change)}%
												</span>
											</div>
										</div>
									</div>
								{/each}
							</div>
						</div>

						<!-- Top Items -->
						<div>
							<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Menu Items</h4>
							<div class="space-y-2">
								{#each topPerformers.items.slice(0, showDetails ? 5 : 3) as performer}
									<div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
										<div class="flex items-center space-x-2">
											<span class="text-sm">🍽️</span>
											<span class="text-xs font-medium text-gray-900 dark:text-white truncate max-w-[100px]">
												{performer.name}
											</span>
										</div>
										<div class="flex items-center space-x-1">
											<span class="text-xs font-medium text-gray-900 dark:text-white">
												{performer.value > 1000 ? `${(performer.value / 1000000).toFixed(1)}M` :
												 performer.value > 100 ? `${(performer.value / 1000).toFixed(0)}K` :
												 Math.floor(performer.value).toString()}
											</span>
											<div class="flex items-center space-x-1">
												<svg class="w-3 h-3 {getPerformanceColor(performer.change) === 'success' ? 'text-green-500' : getPerformanceColor(performer.change) === 'danger' ? 'text-red-500' : 'text-gray-500'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
												</svg>
												<span class="text-xs {getPerformanceColor(performer.change) === 'success' ? 'text-green-600' : getPerformanceColor(performer.change) === 'danger' ? 'text-red-600' : 'text-gray-600'}">
													{getPerformanceIcon(performer.change)}{Math.abs(performer.change)}%
												</span>
											</div>
										</div>
									</div>
								{/each}
							</div>
						</div>
					</div>
				</div>
			</Card>
		</div>

		<!-- Key Metrics Sidebar -->
		<div class="space-y-6">
			<!-- Performance Summary -->
			<Card>
				<div class="p-6">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Summary</h3>
					<div class="space-y-4">
						<div class="flex items-center justify-between">
							<span class="text-sm text-gray-600 dark:text-gray-400">Occupancy Rate</span>
							<span class="font-medium text-gray-900 dark:text-white">{stats.occupancyRate}%</span>
						</div>
						<div class="flex items-center justify-between">
							<span class="text-sm text-gray-600 dark:text-gray-400">Avg Order Value</span>
							<span class="font-medium text-gray-900 dark:text-white">₫{(stats.averageOrderValue / 1000).toFixed(0)}K</span>
						</div>
						<div class="flex items-center justify-between">
							<span class="text-sm text-gray-600 dark:text-gray-400">Table Turnover</span>
							<span class="font-medium text-gray-900 dark:text-white">{(stats.todayOrders / stats.activeTables).toFixed(1)}x</span>
						</div>
						<div class="flex items-center justify-between">
							<span class="text-sm text-gray-600 dark:text-gray-400">Customer Count</span>
							<span class="font-medium text-gray-900 dark:text-white">{stats.totalCustomers}</span>
						</div>
					</div>
				</div>
			</Card>

			<!-- Quick Insights -->
			<Card>
				<div class="p-6">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Insights</h3>
					<div class="space-y-3">
						<div class="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
							<div class="flex items-start space-x-2">
								<svg class="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
								</svg>
								<div>
									<p class="text-sm font-medium text-green-900 dark:text-green-100">Peak Hours</p>
									<p class="text-xs text-green-700 dark:text-green-300">19:00-21:00 show highest activity</p>
								</div>
							</div>
						</div>

						<div class="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
							<div class="flex items-start space-x-2">
								<svg class="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"></path>
								</svg>
								<div>
									<p class="text-sm font-medium text-yellow-900 dark:text-yellow-100">Staff Optimization</p>
									<p class="text-xs text-yellow-700 dark:text-yellow-300">Consider adding 1 more staff during peak</p>
								</div>
							</div>
						</div>

						<div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
							<div class="flex items-start space-x-2">
								<svg class="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
								</svg>
								<div>
									<p class="text-sm font-medium text-blue-900 dark:text-blue-100">Revenue Growth</p>
									<p class="text-xs text-blue-700 dark:text-blue-300">Up 12% from same time yesterday</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Card>

			<!-- Export Options -->
			<Card>
				<div class="p-6">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Export Data</h3>
					<div class="space-y-2">
						<Button color="cyan" class="w-full" size="sm">
							<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
							</svg>
							Export PDF Report
						</Button>
						<Button color="secondary" class="w-full" size="sm" outline={true}>
							<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
							</svg>
							Export CSV Data
						</Button>
						<Button color="secondary" class="w-full" size="sm" outline={true}>
							<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
							</svg>
							Share Report
						</Button>
					</div>
				</div>
			</Card>
		</div>
	</div>
</div>