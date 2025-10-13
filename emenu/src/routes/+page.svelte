<script lang="ts">
  import { goto } from '$app/navigation';
  import ThemeToggle from '$lib/components/theme/ThemeToggle.svelte';
  import Button from '$lib/components/flowbite/Button.svelte';
  import Card from '$lib/components/flowbite/Card.svelte';

  // State for transition effect
  let isTransitioning = false;

  async function handleQRScannerClick() {
    if (isTransitioning) return;

    isTransitioning = true;

    // Black blurry fade out transition
    document.body.style.transition = 'all 0.5s ease-out';
    document.body.style.filter = 'blur(8px)';
    document.body.style.backgroundColor = 'black';

    // Navigate to QR route after transition
    setTimeout(() => {
      goto('/qr');
    }, 500);
  }
</script>

<svelte:head>
	<title>SOL Restaurant - Premium Japanese Dining</title>
	<meta name="description" content="Experience authentic Japanese cuisine at SOL Restaurant" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
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
						<p class="text-sm text-gray-600 dark:text-gray-400">Premium Japanese Dining Experience</p>
					</div>
				</div>

				<!-- Right side buttons -->
				<div class="flex items-center space-x-4">
					<!-- Theme Toggle -->
					<ThemeToggle />

					<!-- Hub Access Link (muted) -->
					<a
						href="/hub"
						class="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors group"
						title="Staff Portal - Access for authorized personnel only"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
						</svg>
						<span class="text-sm font-medium group-hover:text-gray-900 dark:group-hover:text-white">Hub</span>
					</a>
				</div>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<div class="text-center mb-12">
			<h2 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
				Welcome to SOL Restaurant
			</h2>
			<p class="text-xl text-gray-600 dark:text-gray-300 mb-8">
				Experience authentic Japanese cuisine with our premium dining options
			</p>

			<!-- Prominent QR Scanner Button -->
			<Button
				on:click={handleQRScannerClick}
				disabled={isTransitioning}
				loading={isTransitioning}
				color="cyan"
				size="xl"
				class="inline-flex items-center space-x-4 px-8 py-6 text-lg font-semibold shadow-xl"
			>
				<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
				</svg>
				<span>Scan QR Code to View Menu</span>
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
				</svg>
			</Button>
		</div>

		<!-- Contact Information Section -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
			<Card class="text-center">
				<svg class="w-12 h-12 text-cyan-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 2.493A1 1 0 0110.639 9H11a1 1 0 011 1v1a1 1 0 01-1 1H9a1 1 0 01-1-1v-1a1 1 0 00-.492-.957L5.976 3.655A1 1 0 005.28 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z"></path>
				</svg>
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Contact Us</h3>
				<p class="text-gray-600 dark:text-gray-400">+84 28 1234 5678</p>
				<p class="text-gray-600 dark:text-gray-400">info@solrestaurant.vn</p>
			</Card>

			<Card class="text-center">
				<svg class="w-12 h-12 text-cyan-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
				</svg>
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Opening Hours</h3>
				<p class="text-gray-600 dark:text-gray-400">Monday - Sunday</p>
				<p class="text-gray-600 dark:text-gray-400">11:00 AM - 10:00 PM</p>
			</Card>

			<Card class="text-center">
				<svg class="w-12 h-12 text-cyan-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
				</svg>
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Location</h3>
				<p class="text-gray-600 dark:text-gray-400">123 Nguyen Hue Street</p>
				<p class="text-gray-600 dark:text-gray-400">District 1, Ho Chi Minh City</p>
			</Card>
		</div>

		<!-- Quick Instructions -->
		<div class="bg-white rounded-lg shadow-lg p-8 text-center">
			<h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Order</h3>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
				<div>
					<div class="bg-cyan-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
						<span class="text-2xl font-bold text-cyan-600">1</span>
					</div>
					<h4 class="font-semibold text-gray-900 dark:text-white mb-2">Scan QR Code</h4>
					<p class="text-gray-600 dark:text-gray-400">Scan the QR code on your table to access our digital menu</p>
				</div>
				<div>
					<div class="bg-cyan-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
						<span class="text-2xl font-bold text-cyan-600">2</span>
					</div>
					<h4 class="font-semibold text-gray-900 dark:text-white mb-2">Browse Menu</h4>
					<p class="text-gray-600 dark:text-gray-400">Explore our authentic Japanese dishes and beverages</p>
				</div>
				<div>
					<div class="bg-cyan-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
						<span class="text-2xl font-bold text-cyan-600">3</span>
					</div>
					<h4 class="font-semibold text-gray-900 dark:text-white mb-2">Place Order</h4>
					<p class="text-gray-600 dark:text-gray-400">Order directly from your device and enjoy your meal</p>
				</div>
			</div>
		</div>
	</main>

	<!-- Footer -->
	<footer class="bg-white dark:bg-gray-800 border-t dark:border-gray-700 mt-16">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div class="text-center">
				<div class="flex items-center justify-center space-x-4 mb-4">
					<img
						src="/logos/logo_trim.png"
						alt="SOL Restaurant"
						class="h-8 w-auto"
					/>
					<span class="text-lg font-semibold text-gray-900 dark:text-white">SOL Restaurant</span>
				</div>
				<p class="text-gray-600 dark:text-gray-400 mb-4">Premium Japanese Dining Experience Since 2020</p>
				<div class="flex justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
					<span>&copy; 2024 SOL Restaurant. All rights reserved.</span>
					<span>•</span>
					<a href="#" class="hover:text-gray-700 dark:hover:text-gray-300">Privacy Policy</a>
					<span>•</span>
					<a href="#" class="hover:text-gray-700 dark:hover:text-gray-300">Terms of Service</a>
				</div>
			</div>
		</div>
	</footer>
</div>