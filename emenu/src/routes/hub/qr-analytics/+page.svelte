<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { DirectusUser } from '$lib/server/auth';
	import Card from '$lib/components/flowbite/Card.svelte';
	import Button from '$lib/components/flowbite/Button.svelte';
	import Badge from '$lib/components/flowbite/Badge.svelte';
	import QRAnalytics from '$lib/components/QRAnalytics.svelte';
	import LoadingWrapper from '$lib/components/ui/LoadingWrapper.svelte';
	import PageTransition from '$lib/components/ui/PageTransition.svelte';

	export let data;

	let currentUser: DirectusUser | null = data.user;
	let isLoading = false;
	let error = data.error || null;
	let showContent = false;

	// Analytics state
	let timeRange: 'today' | 'week' | 'month' | 'year' = 'week';
	let autoRefresh = true;
	let lastAnalyticsUpdate: Date | null = null;

	onMount(async () => {
		try {
			// Trigger content animation
			showContent = true;
		} catch (err) {
			console.error('Failed to load QR analytics page:', err);
			error = err instanceof Error ? err.message : 'Failed to load page';
		}
	});

	// Analytics event handlers
	function handleAnalyticsUpdate(event: any) {
		console.log('Analytics data updated:', event.detail);
		lastAnalyticsUpdate = new Date();
	}

	function handleTimeRangeChange(newRange: string) {
		timeRange = newRange as 'today' | 'week' | 'month' | 'year';
	}

	function handleExportData() {
		// In a real implementation, this would export analytics data
		console.log('Exporting analytics data...');
		alert('Analytics export would be downloaded here');
	}

	function getUserDisplayName(user: DirectusUser | null): string {
		if (!user) return 'Guest';
		if (user.first_name && user.last_name) {
			return `${user.first_name} ${user.last_name}`;
		}
		return user.email;
	}
</script>

<svelte:head>
	<title>QR Analytics - Staff Hub</title>
	<meta name="description" content="QR code analytics and performance tracking" />
</svelte:head>

{#if error}
	<div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
		<div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
			<div class="text-red-500 text-6xl mb-4">⚠️</div>
			<h1 class="text-2xl font-bold text-gray-900 mb-2">Analytics Error</h1>
			<p class="text-gray-600 mb-6">{error}</p>
			<a href="/hub" class="inline-flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
				<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
				</svg>
				Back to Dashboard
			</a>
		</div>
	</div>
{:else if isLoading}
	<!-- Loading State -->
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
		<div class="p-6">
			<LoadingWrapper>
				<div class="space-y-6">
					<div class="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-64"></div>
					<div class="space-y-4">
						<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
							{#each Array(4) as _}
								<div class="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
							{/each}
						</div>
						<div class="h-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
					</div>
				</div>
			</LoadingWrapper>
		</div>
	</div>
{:else}
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
		<!-- Header -->
		<header class="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
			<div class="px-6 py-4">
				<div class="flex items-center justify-between">
					<div>
						<div class="flex items-center space-x-3">
							<a href="/hub" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
								</svg>
							</a>
							<h1 class="text-2xl font-bold text-gray-900 dark:text-white">QR Code Analytics</h1>
						</div>
						<p class="text-gray-600 dark:text-gray-400 mt-1">Track QR code performance and user engagement</p>
					</div>
					<div class="flex items-center space-x-4">
						{#if lastAnalyticsUpdate}
							<Badge color="success" size="sm">
								Updated {lastAnalyticsUpdate.toLocaleTimeString()}
							</Badge>
						{/if}
						<Button color="secondary" size="sm" onclick={handleExportData}>
							<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.707.293H19a2 2 0 012 2v8a2 2 0 01-2 2h-5.586a1 1 0 01-.707-.293l-5.414-5.414a1 1 0 01-.707-.293z"></path>
							</svg>
							Export Data
						</Button>
					</div>
				</div>
			</div>
		</header>

		<!-- Main Content -->
		<main class="flex-1">
			<PageTransition show={showContent} duration={500} blur={true}>
				<div class="p-6">
					<!-- Quick Navigation -->
					<div class="mb-8">
						<Card class="p-4">
							<div class="flex items-center justify-between">
								<div class="flex items-center space-x-4">
									<a href="/hub" class="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium">
										← Dashboard
									</a>
									<span class="text-gray-400">|</span>
									<a href="/hub/qr-codes" class="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium">
										QR Codes
									</a>
									<span class="text-gray-400">|</span>
									<span class="text-gray-900 dark:text-white font-medium">Analytics</span>
								</div>
								<div class="flex items-center space-x-2">
									<Badge color="cyan" size="sm">Real-time</Badge>
									<Badge color="success" size="sm">Live Data</Badge>
								</div>
							</div>
						</Card>
					</div>

					<!-- QR Analytics Component -->
					<QRAnalytics
						{timeRange}
						{autoRefresh}
						onDataUpdated={handleAnalyticsUpdate}
					/>

					<!-- Insights and Recommendations -->
					<Card class="mt-8">
						<div class="p-6">
							<div class="flex items-center justify-between mb-6">
								<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Insights & Recommendations</h3>
								<Badge color="warning" size="sm">AI Powered</Badge>
							</div>

							<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								<!-- Performance Insight -->
								<div class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
									<div class="flex items-start space-x-3">
										<div class="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
											<svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
											</svg>
										</div>
										<div>
											<h4 class="font-medium text-green-900 dark:text-green-100 mb-2">Strong Performance</h4>
											<p class="text-sm text-green-700 dark:text-green-300">
												QR code scans have increased by 15% this week. Consider promoting the QR feature more prominently.
											</p>
										</div>
									</div>
								</div>

								<!-- Engagement Insight -->
								<div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
									<div class="flex items-start space-x-3">
										<div class="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
											<svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
											</svg>
										</div>
										<div>
											<h4 class="font-medium text-blue-900 dark:text-blue-100 mb-2">High Engagement</h4>
											<p class="text-sm text-blue-700 dark:text-blue-300">
												Average session duration of 3+ minutes indicates customers are actively browsing the menu.
											</p>
										</div>
									</div>
								</div>

								<!-- Optimization Insight -->
								<div class="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
									<div class="flex items-start space-x-3">
										<div class="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
											<svg class="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
											</svg>
										</div>
										<div>
											<h4 class="font-medium text-orange-900 dark:text-orange-100 mb-2">Mobile First</h4>
											<p class="text-sm text-orange-700 dark:text-orange-300">
												85% of scans come from mobile devices. Ensure the mobile experience is optimized.
											</p>
										</div>
									</div>
								</div>

								<!-- Zone Performance -->
								<div class="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
									<div class="flex items-start space-x-3">
										<div class="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
											<svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
											</svg>
										</div>
										<div>
											<h4 class="font-medium text-purple-900 dark:text-purple-100 mb-2">Terrace Popular</h4>
											<p class="text-sm text-purple-700 dark:text-purple-300">
												The terrace zone shows 40% higher engagement. Consider similar QR placement in other zones.
											</p>
										</div>
									</div>
								</div>

								<!-- Time Pattern -->
								<div class="p-4 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg">
									<div class="flex items-start space-x-3">
										<div class="p-2 bg-cyan-100 dark:bg-cyan-900/50 rounded-lg">
											<svg class="w-5 h-5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
											</svg>
										</div>
										<div>
											<h4 class="font-medium text-cyan-900 dark:text-cyan-100 mb-2">Peak Hours</h4>
											<p class="text-sm text-cyan-700 dark:text-cyan-300">
												Most scans occur between 7-9 PM. Ensure staff availability during peak scanning times.
											</p>
										</div>
									</div>
								</div>

								<!-- Conversion Insight -->
								<div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
									<div class="flex items-start space-x-3">
										<div class="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
											<svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
											</svg>
										</div>
										<div>
											<h4 class="font-medium text-red-900 dark:text-red-100 mb-2">Order Conversion</h4>
											<p class="text-sm text-red-700 dark:text-red-300">
												30% of scans lead to orders. Consider adding promotional items to increase conversion.
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Card>

					<!-- Quick Actions -->
					<Card class="mt-8">
						<div class="p-6">
							<div class="flex items-center justify-between mb-6">
								<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
								<Badge color="secondary" size="sm">Management</Badge>
							</div>

							<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
								<a href="/hub/qr-codes">
									<Button color="cyan" class="w-full">
										<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
										</svg>
										Generate QR Codes
									</Button>
								</a>

								<Button color="secondary" class="w-full" onclick={handleExportData}>
									<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.707.293H19a2 2 0 012 2v8a2 2 0 01-2 2h-5.586a1 1 0 01-.707-.293l-5.414-5.414a1 1 0 01-.707-.293z"></path>
									</svg>
									Download Report
								</Button>

								<Button color="success" class="w-full">
									<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
									</svg>
										Share Insights
								</Button>
							</div>
						</div>
					</Card>
				</div>
			</PageTransition>
		</main>
	</div>
{/if}

<style>
	/* Custom animations */
	@keyframes slideIn {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.animate-slide-in {
		animation: slideIn 0.5s ease-out;
	}
</style>