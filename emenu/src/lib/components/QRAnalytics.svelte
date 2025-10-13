<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import Card from '$lib/components/flowbite/Card.svelte';
	import Button from '$lib/components/flowbite/Button.svelte';
	import Badge from '$lib/components/flowbite/Badge.svelte';

	export let timeRange: 'today' | 'week' | 'month' | 'year' = 'week';
	export let autoRefresh: boolean = true;
	export let refreshInterval: number = 30000; // 30 seconds

	// Event dispatcher
	const dispatcher = createEventDispatcher();

	// Analytics data
	let analyticsData = {
		totalScans: 0,
		uniqueScans: 0,
		averageScansPerTable: 0,
		topTables: [],
		scanTrends: [],
		deviceBreakdown: { mobile: 0, desktop: 0, tablet: 0 },
		timeDistribution: [],
		engagementMetrics: {
			menuViews: 0,
			ordersPlaced: 0,
			sessionDuration: 0,
			bounceRate: 0
		},
		zones: []
	};

	let isLoading = false;
	let error: string | null = null;
	let lastUpdated: Date | null = null;
	let refreshTimer: NodeJS.Timeout | null = null;

	// Chart data
	let chartData = {
		labels: [] as string[],
		datasets: [
			{
				label: 'Scans',
				data: [] as number[],
				borderColor: 'rgb(6, 182, 212)',
				backgroundColor: 'rgba(6, 182, 212, 0.1)',
				tension: 0.4
			},
			{
				label: 'Unique Scans',
				data: [] as number[],
				borderColor: 'rgb(139, 92, 246)',
				backgroundColor: 'rgba(139, 92, 246, 0.1)',
				tension: 0.4
			}
		]
	};

	onMount(async () => {
		await loadAnalyticsData();
		if (autoRefresh) {
			startAutoRefresh();
		}
	});

	onDestroy(() => {
		if (refreshTimer) {
			clearInterval(refreshTimer);
		}
	});

	async function loadAnalyticsData() {
		try {
			isLoading = true;
			error = null;

			// Simulate API call to fetch analytics data
			// In a real implementation, this would fetch from Directus analytics API
			const mockData = generateMockAnalyticsData();
			analyticsData = mockData;
			updateChartData(mockData);
			lastUpdated = new Date();

		} catch (err) {
			console.error('Failed to load analytics data:', err);
			error = err instanceof Error ? err.message : 'Failed to load analytics';
		} finally {
			isLoading = false;
		}
	}

	function generateMockAnalyticsData() {
		const totalScans = Math.floor(Math.random() * 500) + 100;
		const uniqueScans = Math.floor(totalScans * 0.7);
		const zones = ['Main Dining', 'Terrace', 'Private Room A', 'Private Room B', 'Bar'];

		// Generate scan trends
		const scanTrends = [];
		const now = new Date();
		for (let i = 6; i >= 0; i--) {
			const date = new Date(now);
			date.setDate(date.getDate() - i);
			scanTrends.push({
				date: date,
				scans: Math.floor(Math.random() * 50) + 10,
				uniqueScans: Math.floor(Math.random() * 35) + 5
			});
		}

		// Generate top tables
		const topTables = [];
		for (let i = 1; i <= 5; i++) {
			topTables.push({
				tableId: `table-${i}`,
				tableName: `Table ${i}`,
				zone: zones[Math.floor(Math.random() * zones.length)],
				scans: Math.floor(Math.random() * 30) + 5,
				uniqueScans: Math.floor(Math.random() * 20) + 3,
				engagement: Math.random() * 100
			});
		}

		// Generate time distribution
		const timeDistribution = [];
		for (let hour = 0; hour < 24; hour++) {
			let scans = 0;
			if (hour >= 11 && hour <= 14) scans = Math.floor(Math.random() * 20) + 10; // Lunch
			else if (hour >= 17 && hour <= 21) scans = Math.floor(Math.random() * 30) + 15; // Dinner
			else if (hour >= 22 && hour <= 23) scans = Math.floor(Math.random() * 10) + 5; // Late night
			else scans = Math.floor(Math.random() * 5); // Other times

			timeDistribution.push({
				hour,
				scans
			});
		}

		// Generate zone analytics
		const zonesAnalytics = zones.map(zone => ({
			name: zone,
			scans: Math.floor(Math.random() * 100) + 20,
			tables: Math.floor(Math.random() * 5) + 2,
			engagement: Math.random() * 100
		}));

		return {
			totalScans,
			uniqueScans,
			averageScansPerTable: Math.floor(totalScans / 20),
			topTables,
			scanTrends,
			deviceBreakdown: {
				mobile: Math.floor(totalScans * 0.85),
				desktop: Math.floor(totalScans * 0.10),
				tablet: Math.floor(totalScans * 0.05)
			},
			timeDistribution,
			engagementMetrics: {
				menuViews: Math.floor(totalScans * 0.9),
				ordersPlaced: Math.floor(totalScans * 0.3),
				sessionDuration: Math.floor(Math.random() * 300) + 120, // seconds
				bounceRate: Math.random() * 30 + 10 // percentage
			},
			zones: zonesAnalytics
		};
	}

	function updateChartData(data: any) {
		chartData.labels = data.scanTrends.map((trend: any) =>
			trend.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
		);
		chartData.datasets[0].data = data.scanTrends.map((trend: any) => trend.scans);
		chartData.datasets[1].data = data.scanTrends.map((trend: any) => trend.uniqueScans);
	}

	function startAutoRefresh() {
		if (refreshTimer) {
			clearInterval(refreshTimer);
		}
		refreshTimer = setInterval(async () => {
			await loadAnalyticsData();
		}, refreshInterval);
	}

	function stopAutoRefresh() {
		if (refreshTimer) {
			clearInterval(refreshTimer);
			refreshTimer = null;
		}
	}

	async function refreshData() {
		await loadAnalyticsData();
		dispatcher('dataUpdated', { analyticsData, lastUpdated });
	}

	function formatNumber(num: number): string {
		return num.toLocaleString();
	}

	function formatPercentage(num: number): string {
		return `${num.toFixed(1)}%`;
	}

	function formatDuration(seconds: number): string {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}m ${remainingSeconds}s`;
	}

	function getEngagementColor(engagement: number): string {
		if (engagement >= 80) return 'success';
		if (engagement >= 60) return 'warning';
		return 'danger';
	}

	function getTimeRangeLabel(): string {
		switch (timeRange) {
			case 'today': return 'Today';
			case 'week': return 'This Week';
			case 'month': return 'This Month';
			case 'year': return 'This Year';
			default: return 'This Week';
		}
	}

	// Reactive statements
	$: totalScansGrowth = analyticsData.scanTrends.length > 1
		? ((analyticsData.scanTrends[analyticsData.scanTrends.length - 1].scans -
		   analyticsData.scanTrends[0].scans) / analyticsData.scanTrends[0].scans * 100)
		: 0;

	$: uniqueScansGrowth = analyticsData.scanTrends.length > 1
		? ((analyticsData.scanTrends[analyticsData.scanTrends.length - 1].uniqueScans -
		   analyticsData.scanTrends[0].uniqueScans) / analyticsData.scanTrends[0].uniqueScans * 100)
		: 0;

	$: mobilePercentage = analyticsData.totalScans > 0
		? (analyticsData.deviceBreakdown.mobile / analyticsData.totalScans * 100)
		: 0;
</script>

<!-- QR Analytics Component -->
<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div class="flex items-center space-x-3">
			<h2 class="text-xl font-bold text-gray-900 dark:text-white">QR Code Analytics</h2>
			{#if lastUpdated}
				<Badge color="secondary" size="sm">
					Updated {lastUpdated.toLocaleTimeString()}
				</Badge>
			{/if}
			{#if autoRefresh}
				<div class="flex items-center space-x-2">
					<div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
					<span class="text-sm text-gray-600 dark:text-gray-400">Live</span>
				</div>
			{/if}
		</div>
		<div class="flex items-center space-x-3">
			<!-- Time Range Selector -->
			<select bind:value={timeRange} class="text-sm border border-gray-300 dark:border-gray-600 rounded px-3 py-1">
				<option value="today">Today</option>
				<option value="week">This Week</option>
				<option value="month">This Month</option>
				<option value="year">This Year</option>
			</select>

			<!-- Auto Refresh Toggle -->
			<Button
				color={autoRefresh ? "cyan" : "secondary"}
				size="sm"
				outline={!autoRefresh}
				onclick={() => autoRefresh ? stopAutoRefresh() : startAutoRefresh()}
			>
				<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
				</svg>
				{autoRefresh ? 'Auto' : 'Manual'}
			</Button>

			<!-- Refresh Button -->
			<Button color="secondary" size="sm" onclick={refreshData} disabled={isLoading}>
				<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
				</svg>
				Refresh
			</Button>
		</div>
	</div>

	{#if error}
		<!-- Error Display -->
		<Card class="border-red-200 bg-red-50 dark:bg-red-900/20">
			<div class="p-4">
				<div class="flex items-center">
					<svg class="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
					<div>
						<h3 class="text-sm font-medium text-red-800 dark:text-red-200">Analytics Loading Error</h3>
						<p class="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
					</div>
					<Button color="red" size="sm" onclick={refreshData} class="ml-auto">
						Retry
					</Button>
				</div>
			</div>
		</Card>
	{:else if isLoading}
		<!-- Loading State -->
		<div class="space-y-6">
			<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
				{#each Array(4) as _}
					<div class="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
				{/each}
			</div>
			<div class="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
		</div>
	{:else}
		<!-- Analytics Content -->
		<!-- Key Metrics -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			<Card hover={true} class="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/30 border-cyan-200 dark:border-cyan-800">
				<div class="p-6">
					<div class="flex items-center justify-between mb-4">
						<div class="p-3 bg-cyan-500 dark:bg-cyan-600 rounded-lg shadow-lg">
							<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
							</svg>
						</div>
						<Badge color={totalScansGrowth >= 0 ? "success" : "danger"} size="sm">
							{totalScansGrowth >= 0 ? '+' : ''}{formatPercentage(totalScansGrowth)}
						</Badge>
					</div>
					<div>
						<p class="text-sm font-medium text-cyan-700 dark:text-cyan-300 mb-1">Total Scans</p>
						<p class="text-3xl font-bold text-cyan-900 dark:text-cyan-100">{formatNumber(analyticsData.totalScans)}</p>
						<p class="text-xs text-cyan-600 dark:text-cyan-400 mt-2">{getTimeRangeLabel()}</p>
					</div>
				</div>
			</Card>

			<Card hover={true} class="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30 border-purple-200 dark:border-purple-800">
				<div class="p-6">
					<div class="flex items-center justify-between mb-4">
						<div class="p-3 bg-purple-500 dark:bg-purple-600 rounded-lg shadow-lg">
							<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z"></path>
							</svg>
						</div>
						<Badge color={uniqueScansGrowth >= 0 ? "success" : "danger"} size="sm">
							{uniqueScansGrowth >= 0 ? '+' : ''}{formatPercentage(uniqueScansGrowth)}
						</Badge>
					</div>
					<div>
						<p class="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">Unique Scans</p>
						<p class="text-3xl font-bold text-purple-900 dark:text-purple-100">{formatNumber(analyticsData.uniqueScans)}</p>
						<p class="text-xs text-purple-600 dark:text-purple-400 mt-2">
							{formatPercentage((analyticsData.uniqueScans / analyticsData.totalScans) * 100)} of total
						</p>
					</div>
				</div>
			</Card>

			<Card hover={true} class="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 border-green-200 dark:border-green-800">
				<div class="p-6">
					<div class="flex items-center justify-between mb-4">
						<div class="p-3 bg-green-500 dark:bg-green-600 rounded-lg shadow-lg">
							<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
							</svg>
						</div>
						<Badge color="success" size="sm">+{formatPercentage(mobilePercentage)}</Badge>
					</div>
					<div>
						<p class="text-sm font-medium text-green-700 dark:text-green-300 mb-1">Session Duration</p>
						<p class="text-3xl font-bold text-green-900 dark:text-green-100">{formatDuration(analyticsData.engagementMetrics.sessionDuration)}</p>
						<p class="text-xs text-green-600 dark:text-green-400 mt-2">Average time</p>
					</div>
				</div>
			</Card>

			<Card hover={true} class="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/30 border-orange-200 dark:border-orange-800">
				<div class="p-6">
					<div class="flex items-center justify-between mb-4">
						<div class="p-3 bg-orange-500 dark:bg-orange-600 rounded-lg shadow-lg">
							<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
							</svg>
						</div>
						<Badge color="warning" size="sm">{formatPercentage(analyticsData.engagementMetrics.bounceRate)}</Badge>
					</div>
					<div>
						<p class="text-sm font-medium text-orange-700 dark:text-orange-300 mb-1">Bounce Rate</p>
						<p class="text-3xl font-bold text-orange-900 dark:text-orange-100">{formatPercentage(analyticsData.engagementMetrics.bounceRate)}</p>
						<p class="text-xs text-orange-600 dark:text-orange-400 mt-2">Lower is better</p>
					</div>
				</div>
			</Card>
		</div>

		<!-- Charts and Detailed Analytics -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<!-- Scan Trends Chart -->
			<Card>
				<div class="p-6">
					<div class="flex items-center justify-between mb-6">
						<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Scan Trends</h3>
						<Badge color="cyan" size="sm">{getTimeRangeLabel()}</Badge>
					</div>

					<!-- Mock Chart Visualization -->
					<div class="h-64 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
						<div class="h-full flex items-end justify-between space-x-2">
							{#each chartData.labels as label, i}
								<div class="flex-1 flex flex-col items-center">
									<div class="w-full flex items-end justify-center space-x-1 h-48">
										<div
											class="bg-cyan-500 dark:bg-cyan-400 rounded-t"
											style="height: ${(chartData.datasets[0].data[i] / Math.max(...chartData.datasets[0].data)) * 100}%"
											title="Scans: {chartData.datasets[0].data[i]}"
										></div>
										<div
											class="bg-purple-500 dark:bg-purple-400 rounded-t"
											style="height: ${(chartData.datasets[1].data[i] / Math.max(...chartData.datasets[1].data)) * 100}%"
											title="Unique Scans: {chartData.datasets[1].data[i]}"
										></div>
									</div>
									<p class="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">{label}</p>
								</div>
							{/each}
						</div>
					</div>

					<!-- Chart Legend -->
					<div class="flex items-center justify-center space-x-6 mt-4">
						<div class="flex items-center space-x-2">
							<div class="w-3 h-3 bg-cyan-500 rounded"></div>
							<span class="text-sm text-gray-600 dark:text-gray-400">Total Scans</span>
						</div>
						<div class="flex items-center space-x-2">
							<div class="w-3 h-3 bg-purple-500 rounded"></div>
							<span class="text-sm text-gray-600 dark:text-gray-400">Unique Scans</span>
						</div>
					</div>
				</div>
			</Card>

			<!-- Device Breakdown -->
			<Card>
				<div class="p-6">
					<div class="flex items-center justify-between mb-6">
						<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Device Breakdown</h3>
						<Badge color="secondary" size="sm">{formatNumber(analyticsData.totalScans)} total</Badge>
					</div>

					<div class="space-y-4">
						<div>
							<div class="flex items-center justify-between mb-2">
								<div class="flex items-center space-x-2">
									<svg class="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
									</svg>
									<span class="text-sm font-medium text-gray-900 dark:text-white">Mobile</span>
								</div>
								<span class="text-sm text-gray-600 dark:text-gray-400">{formatPercentage((analyticsData.deviceBreakdown.mobile / analyticsData.totalScans) * 100)}</span>
							</div>
							<div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
								<div class="bg-cyan-600 h-2 rounded-full" style="width: {(analyticsData.deviceBreakdown.mobile / analyticsData.totalScans) * 100}%"></div>
							</div>
							<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatNumber(analyticsData.deviceBreakdown.mobile)} scans</p>
						</div>

						<div>
							<div class="flex items-center justify-between mb-2">
								<div class="flex items-center space-x-2">
									<svg class="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
									</svg>
									<span class="text-sm font-medium text-gray-900 dark:text-white">Desktop</span>
								</div>
								<span class="text-sm text-gray-600 dark:text-gray-400">{formatPercentage((analyticsData.deviceBreakdown.desktop / analyticsData.totalScans) * 100)}</span>
							</div>
							<div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
								<div class="bg-purple-600 h-2 rounded-full" style="width: {(analyticsData.deviceBreakdown.desktop / analyticsData.totalScans) * 100}%"></div>
							</div>
							<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatNumber(analyticsData.deviceBreakdown.desktop)} scans</p>
						</div>

						<div>
							<div class="flex items-center justify-between mb-2">
								<div class="flex items-center space-x-2">
									<svg class="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M7 16h10M7 8h10M3 12h18m-9-4v8"></path>
									</svg>
									<span class="text-sm font-medium text-gray-900 dark:text-white">Tablet</span>
								</div>
								<span class="text-sm text-gray-600 dark:text-gray-400">{formatPercentage((analyticsData.deviceBreakdown.tablet / analyticsData.totalScans) * 100)}</span>
							</div>
							<div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
								<div class="bg-green-600 h-2 rounded-full" style="width: {(analyticsData.deviceBreakdown.tablet / analyticsData.totalScans) * 100}%"></div>
							</div>
							<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatNumber(analyticsData.deviceBreakdown.tablet)} scans</p>
						</div>
					</div>
				</div>
			</Card>
		</div>

		<!-- Top Tables and Zones -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<!-- Top Performing Tables -->
			<Card>
				<div class="p-6">
					<div class="flex items-center justify-between mb-6">
						<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Top Performing Tables</h3>
						<Badge color="success" size="sm">{analyticsData.topTables.length} tables</Badge>
					</div>

					<div class="space-y-3">
						{#each analyticsData.topTables as table, i}
							<div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
								<div class="flex items-center space-x-3">
									<div class="flex items-center justify-center w-8 h-8 bg-cyan-100 dark:bg-cyan-900/30 rounded-full">
										<span class="text-sm font-bold text-cyan-600 dark:text-cyan-400">{i + 1}</span>
									</div>
									<div>
										<p class="font-medium text-gray-900 dark:text-white">{table.tableName}</p>
										<p class="text-xs text-gray-500 dark:text-gray-400">{table.zone}</p>
									</div>
								</div>
								<div class="text-right">
									<p class="font-medium text-gray-900 dark:text-white">{formatNumber(table.scans)}</p>
									<p class="text-xs text-gray-500 dark:text-gray-400">
										{formatNumber(table.uniqueScans)} unique
									</p>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</Card>

			<!-- Zone Performance -->
			<Card>
				<div class="p-6">
					<div class="flex items-center justify-between mb-6">
						<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Zone Performance</h3>
						<Badge color="secondary" size="sm">{analyticsData.zones.length} zones</Badge>
					</div>

					<div class="space-y-3">
						{#each analyticsData.zones as zone}
							<div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
								<div class="flex items-center space-x-3">
									<div class="flex items-center justify-center w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full">
										<svg class="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
										</svg>
									</div>
									<div>
										<p class="font-medium text-gray-900 dark:text-white">{zone.name}</p>
										<p class="text-xs text-gray-500 dark:text-gray-400">{zone.tables} tables</p>
									</div>
								</div>
								<div class="text-right">
									<p class="font-medium text-gray-900 dark:text-white">{formatNumber(zone.scans)}</p>
									<p class="text-xs text-gray-500 dark:text-gray-400">
										{formatPercentage(zone.engagement)} engagement
									</p>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</Card>
		</div>

		<!-- Engagement Metrics -->
		<Card>
			<div class="p-6">
				<div class="flex items-center justify-between mb-6">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Engagement Metrics</h3>
					<Badge color="warning" size="sm">User behavior</Badge>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div class="text-center p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
						<div class="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">
							{formatPercentage((analyticsData.engagementMetrics.menuViews / analyticsData.totalScans) * 100)}
						</div>
						<p class="text-sm text-gray-600 dark:text-gray-400">Menu Views</p>
						<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
							{formatNumber(analyticsData.engagementMetrics.menuViews)} total
						</p>
					</div>

					<div class="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
						<div class="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
							{formatPercentage((analyticsData.engagementMetrics.ordersPlaced / analyticsData.totalScans) * 100)}
						</div>
						<p class="text-sm text-gray-600 dark:text-gray-400">Orders Placed</p>
						<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
							{formatNumber(analyticsData.engagementMetrics.ordersPlaced)} total
						</p>
					</div>

					<div class="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
						<div class="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
							{formatDuration(analyticsData.engagementMetrics.sessionDuration)}
						</div>
						<p class="text-sm text-gray-600 dark:text-gray-400">Avg Session</p>
						<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
							Per user
						</p>
					</div>

					<div class="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
						<div class="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-2">
							{formatPercentage(100 - analyticsData.engagementMetrics.bounceRate)}
						</div>
						<p class="text-sm text-gray-600 dark:text-gray-400">Retention Rate</p>
						<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
							Stay engaged
						</p>
					</div>
				</div>
			</div>
		</Card>
	{/if}
</div>