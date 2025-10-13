<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import LoadingWrapper from '$lib/components/ui/LoadingWrapper.svelte';
	import CardSkeleton from '$lib/components/ui/CardSkeleton.svelte';
	import Skeleton from '$lib/components/ui/Skeleton.svelte';
	import PageTransition from '$lib/components/ui/PageTransition.svelte';
	import Button from '$lib/components/flowbite/Button.svelte';
	import Card from '$lib/components/flowbite/Card.svelte';
	import Badge from '$lib/components/flowbite/Badge.svelte';
	import QRScanner from '$lib/components/QRScanner.svelte';

	export let params: { tableId: string };
	let tableId = params.tableId;
	let isLoading = true;
	let tableData: any = null;
	let error: string | null = null;
	let showContent = false;
	let showScanner = false;
	let scanResult: string | null = null;

	onMount(async () => {
		// TODO: Load actual table data from API
		// Simulate loading for now
		await new Promise(resolve => setTimeout(resolve, 1500));

		// Mock table data for foundation
		tableData = {
			id: tableId,
			name: `Table ${tableId}`,
			status: 'available',
			capacity: 4,
			zone: 'Main Dining',
			qrCode: `https://sol-restaurant.com/menu/table-${tableId}`,
			lastSession: null
		};

		// Trigger content animation
		showContent = true;
		isLoading = false;
	});

	// QR Scanner event handlers
	function handleQRScan(result: string) {
		scanResult = result;
		console.log('QR Code scanned:', result);

		// Extract table information from scan result
		const tableMatch = result.match(/(?:table-)?(\d+)/i);
		if (tableMatch) {
			const scannedTableId = tableMatch[1];
			if (scannedTableId === tableId) {
				// Same table, show menu
				navigateToMenu();
			} else {
				// Different table, redirect
				window.location.href = `/qr/${scannedTableId}`;
			}
		}
	}

	function handleQRError(error: string) {
		console.error('QR Scanner error:', error);
	}

	function navigateToMenu() {
		// Navigate to the menu page
		window.location.href = `/menu/${tableId}`;
	}

	function toggleScanner() {
		showScanner = !showScanner;
	}

	function openMenuDirectly() {
		navigateToMenu();
	}
</script>

<svelte:head>
	<title>Table {tableData?.name || 'Loading...'} - SOL Restaurant</title>
	<meta name="description" content="Welcome to SOL Restaurant - Scan QR code to view our menu" />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
</svelte:head>

{#if error}
	<div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
		<div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
			<div class="text-red-500 text-6xl mb-4">⚠️</div>
			<h1 class="text-2xl font-bold text-gray-900 mb-2">Table Unavailable</h1>
			<p class="text-gray-600 mb-6">{error}</p>
			<a href="/" class="inline-flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
				<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
				</svg>
				Back to Home
			</a>
		</div>
	</div>
{:else if isLoading}
	<!-- Enhanced Loading Skeleton -->
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
		<!-- Header Skeleton -->
		<header class="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
			<div class="px-4 py-3">
				<div class="flex items-center justify-between">
					<div class="flex items-center space-x-3">
						<div class="h-8 w-8 bg-cyan-600 rounded-lg animate-pulse"></div>
						<div>
							<Skeleton width="w-32" height="h-6" class="mb-1" />
							<Skeleton width="w-24" height="h-4" />
						</div>
					</div>
				</div>
			</div>
		</header>

		<!-- Main Content Skeleton -->
		<main class="flex-1 overflow-y-auto">
			<div class="p-4">
				<div class="text-center mb-8">
					<Skeleton width="w-48" height="h-8" class="mx-auto mb-4" />
					<Skeleton width="w-64" height="h-4" class="mx-auto" />
				</div>

				<!-- Three Column Layout Skeleton -->
				<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div class="lg:col-span-2">
						<CardSkeleton lines={4} />
					</div>
					<div class="lg:col-span-1">
						<CardSkeleton lines={3} showHeader={true} />
					</div>
				</div>
			</div>
		</main>
	</div>
{:else}
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
		<!-- Header with SOL Branding -->
		<header class="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
			<div class="px-4 py-3">
				<div class="flex items-center justify-between">
					<div class="flex items-center space-x-3">
						<img
							src="/logos/logo_trim.png"
							alt="SOL Restaurant"
							class="h-8 w-auto"
						/>
						<div>
							<h1 class="font-semibold text-gray-900 dark:text-white">SOL Restaurant</h1>
							<p class="text-sm text-gray-600 dark:text-gray-400">{tableData?.name} • Premium Japanese Dining</p>
						</div>
					</div>
				</div>
			</div>
		</header>

		<!-- Main Content with Page Transition -->
		<main class="flex-1 overflow-y-auto">
			<PageTransition show={showContent} duration={500} blur={true}>
				<div class="p-4">
				<!-- Welcome Message with Enhanced QR Features -->
				<div class="text-center mb-8">
					<h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Welcome to Your Table</h2>
					<p class="text-xl text-gray-600 dark:text-gray-300 mb-6">Scan the QR code or tap below to view our digital menu</p>

					<!-- QR Code Display -->
					<div class="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg p-6 max-w-md mx-auto mb-6">
						<div class="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
							<div class="w-48 h-48 mx-auto bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
								<svg class="w-24 h-24 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
								</svg>
							</div>
							<div class="text-center">
								<p class="text-sm font-medium text-gray-900 dark:text-white mb-1">Table {tableData?.name}</p>
								<p class="text-xs text-gray-600 dark:text-gray-400">Scan to access menu</p>
							</div>
						</div>
						<p class="text-sm text-gray-700 dark:text-gray-300 mb-4">Position your camera over the QR code</p>
						<p class="text-xs text-gray-600 dark:text-gray-400">Or use our scanner below for better results</p>
					</div>

					<!-- Action Buttons -->
					<div class="flex flex-col sm:flex-row gap-4 justify-center">
						<Button color="cyan" size="lg" onclick={openMenuDirectly}>
							<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
							</svg>
							View Menu
						</Button>
						<Button color="secondary" size="lg" onclick={toggleScanner} outline={true}>
							<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
							</svg>
							{showScanner ? 'Hide Scanner' : 'Use Scanner'}
						</Button>
					</div>
				</div>

				<!-- QR Scanner Component -->
				{#if showScanner}
					<div class="mb-8">
						<QRScanner
							onScan={handleQRScan}
							onError={handleQRError}
							showInstructions={true}
							allowFileUpload={true}
							continuousScan={false}
						/>
					</div>
				{/if}

				<!-- Three Column Layout Foundation -->
				<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<!-- Main Content Area -->
					<div class="lg:col-span-2">
						<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
							<h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Menu Categories</h3>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
								<Card interactive={true} class="p-4">
									<div class="flex items-center space-x-3">
										<div class="bg-cyan-100 dark:bg-cyan-900/50 rounded-lg p-3">
											<svg class="w-6 h-6 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
											</svg>
										</div>
										<div>
											<h4 class="font-medium text-gray-900 dark:text-white">Appetizers</h4>
											<p class="text-sm text-gray-600 dark:text-gray-400">Start your meal</p>
										</div>
									</div>
								</Card>

								<Card interactive={true} class="p-4">
									<div class="flex items-center space-x-3">
										<div class="bg-orange-100 dark:bg-orange-900/50 rounded-lg p-3">
											<svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
											</svg>
										</div>
										<div>
											<h4 class="font-medium text-gray-900 dark:text-white">Main Course</h4>
											<p class="text-sm text-gray-600 dark:text-gray-400">Signature dishes</p>
										</div>
									</div>
								</Card>

								<Card interactive={true} class="p-4">
									<div class="flex items-center space-x-3">
										<div class="bg-green-100 dark:bg-green-900/50 rounded-lg p-3">
											<svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
											</svg>
										</div>
										<div>
											<h4 class="font-medium text-gray-900 dark:text-white">Beverages</h4>
											<p class="text-sm text-gray-600 dark:text-gray-400">Drinks & refreshments</p>
										</div>
									</div>
								</Card>

								<Card interactive={true} class="p-4">
									<div class="flex items-center space-x-3">
										<div class="bg-purple-100 dark:bg-purple-900/50 rounded-lg p-3">
											<svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
											</svg>
										</div>
										<div>
											<h4 class="font-medium text-gray-900 dark:text-white">Desserts</h4>
											<p class="text-sm text-gray-600 dark:text-gray-400">Sweet endings</p>
										</div>
									</div>
								</Card>
							</div>
						</div>
					</div>

					<!-- Sidebar Content -->
					<div class="lg:col-span-1">
						<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
							<h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Table Information</h3>
							<div class="space-y-4">
								<div class="flex items-center justify-between">
									<span class="text-gray-600 dark:text-gray-400">Table Number:</span>
									<span class="font-medium text-gray-900 dark:text-white">{tableData?.name}</span>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-gray-600 dark:text-gray-400">Status:</span>
									<Badge color="success" size="xs">{tableData?.status || 'Available'}</Badge>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-gray-600 dark:text-gray-400">Zone:</span>
									<span class="font-medium text-gray-900 dark:text-white">{tableData?.zone || 'Main Dining'}</span>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-gray-600 dark:text-gray-400">Capacity:</span>
									<span class="font-medium text-gray-900 dark:text-white">{tableData?.capacity || 4} guests</span>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-gray-600 dark:text-gray-400">QR Code:</span>
									<code class="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-700 dark:text-gray-300">
										{tableData?.qrCode?.split('/').pop() || 'N/A'}
									</code>
								</div>
							</div>

							<!-- Service Options -->
							<div class="mt-6 p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
								<h4 class="font-medium text-gray-900 dark:text-white mb-3">Service Options</h4>
								<div class="space-y-2">
									<Button color="cyan" class="w-full" size="sm">
										<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
										</svg>
										Call for Service
									</Button>
									<Button color="secondary" class="w-full" size="sm" outline={true}>
										<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
										</svg>
										Leave Feedback
									</Button>
								</div>
							</div>

							<!-- Restaurant Info -->
							<div class="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
								<h4 class="font-medium text-gray-900 dark:text-white mb-3">Restaurant Info</h4>
								<div class="space-y-2 text-sm">
									<div class="flex items-start space-x-2">
										<svg class="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
										</svg>
										<span class="text-gray-600 dark:text-gray-400">123 Main Street, District 1</span>
									</div>
									<div class="flex items-start space-x-2">
										<svg class="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
										</svg>
										<span class="text-gray-600 dark:text-gray-400">Open: 11:00 - 22:00</span>
									</div>
									<div class="flex items-start space-x-2">
										<svg class="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502.1l-9.749-4.735A1 1 0 014.002 3H7a2 2 0 00-2 2v19a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2.28a1 1 0 01-.948-.684l-1.498-4.493a1 1 0 01.502-.1l9.749 4.735z"></path>
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5V2a2 2 0 012-2h4a2 2 0 012 2v3"></path>
										</svg>
										<span class="text-gray-600 dark:text-gray-400">+84 123 4567</span>
									</div>
								</div>
							</div>

							<!-- Features -->
							<div class="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
								<h4 class="font-medium text-gray-900 dark:text-white mb-3">Features</h4>
								<div class="space-y-2">
									<div class="flex items-center space-x-2">
										<svg class="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
										</svg>
										<span class="text-sm text-gray-700 dark:text-gray-300">Digital menu with photos</span>
									</div>
									<div class="flex items-center space-x-2">
										<svg class="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
										</svg>
										<span class="text-sm text-gray-700 dark:text-gray-300">Order directly from table</span>
									</div>
									<div class="flex items-center space-x-2">
										<svg class="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
										</svg>
										<span class="text-sm text-gray-700 dark:text-gray-300">Split bills available</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				</div>
			</PageTransition>
		</main>

		<!-- Footer with SOL Branding -->
		<footer class="bg-white dark:bg-gray-800 border-t dark:border-gray-700 mt-8">
			<div class="max-w-7xl mx-auto px-4 py-6">
				<div class="text-center">
					<div class="flex items-center justify-center space-x-3 mb-3">
						<img
							src="/logos/logo_trim.png"
							alt="SOL Restaurant"
							class="h-6 w-auto"
						/>
						<span class="font-semibold text-gray-900 dark:text-white">SOL Restaurant</span>
					</div>
					<p class="text-sm text-gray-600 dark:text-gray-400">Premium Japanese Dining Experience</p>
					<p class="text-xs text-gray-500 dark:text-gray-400 mt-2">© 2025 SOL Restaurant. All rights reserved.</p>
				</div>
			</div>
		</footer>
	</div>
{/if}