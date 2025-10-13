<script lang="ts">
	import { goto } from '$app/navigation';

	function handleScanMenu() {
		// For demo purposes, navigate to a sample table
		goto('/menu/sample-table-1');
	}

	function handleStaffAccess() {
		goto('/auth/login');
	}
</script>

<svelte:head>
	<title>QR Scanner - SOL Restaurant</title>
	<meta name="description" content="Scan QR code or access digital menu" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-100 dark:from-gray-900 dark:to-gray-800">
	<!-- Header -->
	<header class="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
				<!-- SOL Logo -->
				<div class="flex items-center">
					<img
						src="/logos/logo_trim.png"
						alt="SOL Restaurant"
						class="h-10 w-auto"
					/>
					<div class="ml-4">
						<h1 class="text-2xl font-bold text-gray-900 dark:text-white">SOL Restaurant</h1>
						<p class="text-sm text-gray-600 dark:text-gray-400">QR Scanner</p>
					</div>
				</div>

				<!-- Staff Access -->
				<button
					onclick={handleStaffAccess}
					class="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
						<path strokecap="round" strokejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
					</svg>
					<span class="text-sm font-medium">Staff Login</span>
				</button>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<div class="text-center">
			<!-- QR Code Icon -->
			<div class="mb-8">
				<div class="inline-flex items-center justify-center w-32 h-32 bg-cyan-100 dark:bg-cyan-900/20 rounded-full">
					<svg class="w-16 h-16 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokecap="round" strokejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
					</svg>
				</div>
			</div>

			<h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
				Scan QR Code to View Menu
			</h2>
			<p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
				Scan the QR code on your table to access our digital menu
			</p>

			<!-- Demo Button -->
			<button
				onclick={handleScanMenu}
				class="inline-flex items-center space-x-3 px-6 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg shadow-lg transition-colors text-lg"
			>
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokecap="round" strokejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
				</svg>
				<span>View Sample Menu</span>
			</button>

			<!-- Instructions -->
			<div class="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
				<h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">How to Scan</h3>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div class="text-center">
						<div class="bg-cyan-100 dark:bg-cyan-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
							<span class="text-xl font-bold text-cyan-600 dark:text-cyan-400">1</span>
						</div>
						<h4 class="font-semibold text-gray-900 dark:text-white mb-2">Open Camera</h4>
						<p class="text-gray-600 dark:text-gray-400">Open your phone's camera app</p>
					</div>
					<div class="text-center">
						<div class="bg-cyan-100 dark:bg-cyan-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
							<span class="text-xl font-bold text-cyan-600 dark:text-cyan-400">2</span>
						</div>
						<h4 class="font-semibold text-gray-900 dark:text-white mb-2">Scan QR Code</h4>
						<p class="text-gray-600 dark:text-gray-400">Point camera at the table QR code</p>
					</div>
					<div class="text-center">
						<div class="bg-cyan-100 dark:bg-cyan-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
							<span class="text-xl font-bold text-cyan-600 dark:text-cyan-400">3</span>
						</div>
						<h4 class="font-semibold text-gray-900 dark:text-white mb-2">View Menu</h4>
						<p class="text-gray-600 dark:text-gray-400">Tap the link to view our digital menu</p>
					</div>
				</div>
			</div>
		</div>
	</main>
</div>