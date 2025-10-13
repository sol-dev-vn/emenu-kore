<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import directusAuth, { type DirectusUser } from '$lib/server/auth';
	import Card from '$lib/components/flowbite/Card.svelte';
	import Button from '$lib/components/flowbite/Button.svelte';
	import Badge from '$lib/components/flowbite/Badge.svelte';
	import QRCodeGenerator from '$lib/components/QRCodeGenerator.svelte';
	import LoadingWrapper from '$lib/components/ui/LoadingWrapper.svelte';
	import PageTransition from '$lib/components/ui/PageTransition.svelte';

	export let data;

	let currentUser: DirectusUser | null = data.user;
	let isLoading = false;
	let error = data.error || null;
	let showContent = false;

	// QR code generation data
	let tables = [];
	let generatedCodes = [];
	let showBulkMode = false;

	onMount(async () => {
		try {
			// Load table data for QR generation
			await loadTableData();

			// Trigger content animation
			showContent = true;
		} catch (err) {
			console.error('Failed to load QR codes page:', err);
			error = err instanceof Error ? err.message : 'Failed to load page';
		}
	});

	async function loadTableData() {
		try {
			isLoading = true;

			// Simulate API call to get tables
			// In a real implementation, this would fetch from Directus
			const mockTables = generateMockTables();
			tables = mockTables;

		} catch (err) {
			console.error('Failed to load table data:', err);
			error = err instanceof Error ? err.message : 'Failed to load table data';
		} finally {
			isLoading = false;
		}
	}

	function generateMockTables() {
		const mockTables = [];
		const zones = ['Main Dining', 'Terrace', 'Private Room A', 'Private Room B', 'Bar'];

		for (let i = 1; i <= 20; i++) {
			mockTables.push({
				id: `table-${i}`,
				name: `Table ${i}`,
				number: i,
				zone: zones[Math.floor(Math.random() * zones.length)],
				capacity: Math.random() > 0.5 ? 4 : 6,
				status: Math.random() > 0.7 ? 'available' : Math.random() > 0.3 ? 'occupied' : 'reserved',
				qrCode: Math.random() > 0.5 ? `https://sol-restaurant.com/menu/table-${i}` : null,
				lastGenerated: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : null
			});
		}
		return mockTables;
	}

	// QR code generation handlers
	function handleQRGenerate(data: { tableId: string; qrCode: string; tableData: any }) {
		console.log('QR Code generated:', data);
		// In a real implementation, this would save to Directus
		generatedCodes = [data, ...generatedCodes];
	}

	function handleBulkGenerate(data: { results: any[] }) {
		console.log('Bulk QR codes generated:', data);
		// In a real implementation, this would save to Directus
		generatedCodes = [...data.results, ...generatedCodes];
	}

	function formatFileSize(size: number): string {
		if (size < 1024) return `${size} bytes`;
		if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
		return `${(size / (1024 * 1024)).toFixed(1)} MB`;
	}

	function formatDate(date: Date): string {
		return date.toLocaleString();
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
	<title>QR Codes - Staff Hub</title>
	<meta name="description" content="Generate and manage QR codes for restaurant tables" />
</svelte:head>

{#if error}
	<div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
		<div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
			<div class="text-red-500 text-6xl mb-4">⚠️</div>
			<h1 class="text-2xl font-bold text-gray-900 mb-2">QR Code Management Error</h1>
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
					<div class="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48"></div>
					<div class="h-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
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
							<h1 class="text-2xl font-bold text-gray-900 dark:text-white">QR Code Management</h1>
						</div>
						<p class="text-gray-600 dark:text-gray-400 mt-1">Generate QR codes for restaurant tables</p>
					</div>
					<div class="flex items-center space-x-4">
						<Badge color="purple" size="sm">
							{tables.length} Tables
						</Badge>
						<Badge color="success" size="sm">
							{tables.filter(t => t.qrCode).length} with QR
						</Badge>
					</div>
				</div>
			</div>
		</header>

		<!-- Main Content -->
		<main class="flex-1">
			<PageTransition show={showContent} duration={500} blur={true}>
				<div class="p-6">
					<!-- QR Code Generator Component -->
					<QRCodeGenerator
						tables={tables}
						onGenerate={handleQRGenerate}
						onBulkGenerate={handleBulkGenerate}
						showBulkMode={showBulkMode}
						allowDownload={true}
					/>

					<!-- Recent Generated Codes -->
					{#if generatedCodes.length > 0}
						<Card class="mt-8">
							<div class="p-6">
								<div class="flex items-center justify-between mb-6">
									<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recently Generated Codes</h3>
									<Badge color="success" size="sm">{generatedCodes.length} codes</Badge>
								</div>

								<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									{#each generatedCodes.slice(0, 6) as qrCode}
										<div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
											<div class="flex items-start justify-between">
												<div>
													<p class="font-medium text-gray-900 dark:text-white">{qrCode.tableData.name}</p>
													<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
														{qrCode.tableData.zone} • {qrCode.tableData.capacity} seats
													</p>
													<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
														Generated: {formatDate(qrCode.tableData.generatedAt)}
													</p>
													<p class="text-xs text-purple-600 dark:text-purple-400 mt-1 font-mono">
														{qrCode.qrCode}
													</p>
												</div>
												<Badge color="success" size="xs">New</Badge>
											</div>
										</div>
									{/each}
								</div>
							</div>
						</Card>
					{/if}

					<!-- Quick Actions -->
					<Card class="mt-8">
						<div class="p-6">
							<div class="flex items-center justify-between mb-6">
								<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
								<Badge color="secondary" size="sm">Management</Badge>
							</div>

							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
								<a href="/hub/qr-analytics">
									<Button color="purple" class="w-full">
										<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
										</svg>
										View Analytics
									</Button>
								</a>

								<Button color="secondary" class="w-full" onclick={() => showBulkMode = !showBulkMode}>
									<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
									</svg>
									{showBulkMode ? 'Single Mode' : 'Bulk Mode'}
								</Button>
							</div>
						</div>
					</Card>

					<!-- Instructions -->
					<Card class="mt-8">
						<div class="p-6">
							<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">QR Code Instructions</h3>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<h4 class="font-medium text-gray-900 dark:text-white mb-3">For Restaurant Staff</h4>
									<ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
										<li class="flex items-start space-x-2">
											<svg class="w-4 h-4 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
											</svg>
											<span>Generate QR codes for all tables in your restaurant</span>
										</li>
										<li class="flex items-start space-x-2">
											<svg class="w-4 h-4 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
											</svg>
											<span>Download and print QR codes for table placement</span>
										</li>
										<li class="flex items-start space-x-2">
											<svg class="w-4 h-4 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
											</svg>
											<span>Replace QR codes when tables are moved or renovated</span>
										</li>
										<li class="flex items-start space-x-2">
											<svg class="w-4 h-4 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
											</svg>
											<span>Track QR code usage and scan analytics</span>
										</li>
									</ul>
								</div>
								<div>
									<h4 class="font-medium text-gray-900 dark:text-white mb-3">For Customers</h4>
									<ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
										<li class="flex items-start space-x-2">
											<svg class="w-4 h-4 text-cyan-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
											</svg>
											<span>Scan QR code with smartphone camera</span>
										</li>
										<li class="flex items-start space-x-2">
											<svg class="w-4 h-4 text-cyan-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
											</svg>
											<span>Access digital menu instantly</span>
										</li>
										<li class="flex items-start space-x-2">
											<svg class="w-4 h-4 text-cyan-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
											</svg>
											<span>Browse menu items and prices</span>
										</li>
										<li class="flex items-start space-x-2">
											<svg class="w-4 h-4 text-cyan-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
											</svg>
											<span>Contact staff for service requests</span>
										</li>
									</ul>
								</div>
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
	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(10px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.animate-fade-in {
		animation: fadeIn 0.5s ease-out;
	}
</style>