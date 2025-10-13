<script lang="ts">
  export let data: {
    branches: Array<{
      id?: string | number;
      name?: string;
      title?: string;
      description?: string;
      status?: string;
      address?: string;
      code?: string;
      menu_items_count?: number;
      categories_count?: number;
      tables_count?: number;
      brand_id?: string;
    }>;
    error?: string | null;
  };

  const branches = data?.branches ?? [];
  const error = data?.error ?? null;
  const loading = false;

  // Compact brand information
  const brandInfo = {
    miwaku_premium: { name: 'Miwaku', color: '#FF6B6B', icon: '🍽️' },
    s79_teppanyaki: { name: 'S79', color: '#4ECDC4', icon: '🥢' },
    kohaku_sashimi_yakiniku: { name: 'Kohaku', color: '#45B7D1', icon: '🍱' },
    kohaku_sushi: { name: 'Kohaku', color: '#96CEB4', icon: '🍣' },
    kohaku_udon_ramen: { name: 'Kohaku', color: '#FFEAA7', icon: '🍜' },
    date_nariya: { name: 'Date', color: '#DDA0DD', icon: '🥩' },
    machida_shoten: { name: 'Machida', color: '#FFA500', icon: '🍶' }
  };

  // Count branches per brand
  $: brandCounts = Object.entries(brandInfo).map(([brandId, brand]) => ({
    ...brand,
    id: brandId,
    count: branches.filter(b => b.brand_id === brandId).length
  }));

  let scannerStream: MediaStream | null = null;
  let scanning = false;

  async function startScanner() {
    try {
      scanning = true;
      scannerStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      const video = document.getElementById('qr-video') as HTMLVideoElement;
      if (video) {
        video.srcObject = scannerStream;
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      scanning = false;
    }
  }

  function stopScanner() {
    if (scannerStream) {
      scannerStream.getTracks().forEach(track => track.stop());
      scannerStream = null;
    }
    scanning = false;
  }
</script>

<svelte:head>
	<title>SOL Restaurant - Digital Menu</title>
	<meta name="description" content="Quick access to SOL restaurant digital menus" />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
</svelte:head>

<main class="h-screen flex flex-col bg-gradient-to-br from-blue-600 to-indigo-700">
	<!-- Header with Logo -->
	<header class="flex items-center justify-between px-4 py-3 md:px-6 border-b border-white border-opacity-20">
		<img
			src="/logos/logo_trim.png"
			alt="SOL"
			class="h-8 md:h-10 w-auto object-contain filter brightness-0 invert"
		/>
		<div class="flex items-center space-x-2 md:space-x-4">
			<span class="text-white text-sm md:text-base opacity-90">
				{branches.length} Locations
			</span>
			<span class="text-white text-sm md:text-base opacity-90">
				7 Brands
			</span>
		</div>
	</header>

	<!-- Main Content Grid -->
	<div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 md:p-6 overflow-hidden">
		<!-- Quick Actions -->
		<div class="flex flex-col space-y-4">
			<!-- Restaurants Button -->
			<a
				href="/restaurants"
				class="flex-1 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 md:p-6 hover:bg-opacity-30 transition-all flex flex-col items-center justify-center text-white group"
			>
				<svg class="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
				</svg>
				<span class="text-lg md:text-xl font-semibold">All Restaurants</span>
				<span class="text-xs md:text-sm opacity-75 mt-1">Browse locations</span>
			</a>

			<!-- QR Scanner Button -->
			<button
				on:click={startScanner}
				class="flex-1 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 md:p-6 hover:bg-opacity-30 transition-all flex flex-col items-center justify-center text-white group"
			>
				<svg class="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
				</svg>
				<span class="text-lg md:text-xl font-semibold">Scan QR Code</span>
				<span class="text-xs md:text-sm opacity-75 mt-1">Table menu access</span>
			</button>
		</div>

		<!-- Brand Grid -->
		<div class="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
			{#each brandCounts as brand}
				<a
					href="/restaurants/{brand.id}"
					class="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3 md:p-4 hover:bg-opacity-30 transition-all flex flex-col items-center justify-center text-white group"
					style="background-color: {brand.color}30"
				>
					<div class="text-2xl md:text-3xl mb-1">{brand.icon}</div>
					<span class="text-xs md:text-sm font-semibold text-center">{brand.name}</span>
					<span class="text-xs opacity-75 mt-1">{brand.count} locations</span>
				</a>
			{/each}
		</div>

		<!-- QR Scanner Modal (when active) -->
		{#if scanning}
			<div class="md:hidden bg-white bg-opacity-95 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center">
				<div class="relative w-full max-w-xs">
					<video
						id="qr-video"
						class="w-full rounded-lg"
						autoplay
						playsinline
					></video>
					<div class="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none"></div>
					<div class="absolute inset-0 flex items-center justify-center">
						<div class="w-32 h-32 border-2 border-white rounded-lg"></div>
					</div>
				</div>
				<button
					on:click={stopScanner}
					class="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium"
				>
					Cancel
				</button>
			</div>
		{:else}
			<!-- Info Section (when not scanning) -->
			<div class="hidden md:flex flex-col space-y-4">
				<div class="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 md:p-6 flex-1 flex flex-col items-center justify-center text-white">
					<div class="text-3xl md:text-4xl mb-2">🍱</div>
					<span class="text-lg font-semibold">SOL Restaurant</span>
					<span class="text-sm opacity-75 text-center mt-1">Premium Japanese Dining</span>
				</div>
			</div>
		{/if}
	</div>

	<!-- Desktop QR Scanner Modal -->
	{#if scanning}
		<div class="hidden md:flex fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50" on:click={stopScanner}>
			<div class="bg-white rounded-2xl p-6 max-w-md mx-4" on:click|stopPropagation>
				<div class="relative mb-4">
					<video
						id="qr-video"
						class="w-full rounded-lg"
						autoplay
						playsinline
					></video>
					<div class="absolute inset-0 border-4 border-blue-500 rounded-lg pointer-events-none"></div>
					<div class="absolute inset-0 flex items-center justify-center">
						<div class="w-48 h-48 border-4 border-white rounded-lg"></div>
					</div>
				</div>
				<div class="text-center">
					<p class="text-gray-600 mb-4">Position QR code within the frame</p>
					<button
						on:click={stopScanner}
						class="px-6 py-3 bg-red-500 text-white rounded-lg font-medium"
					>
						Cancel Scanning
					</button>
				</div>
			</div>
		</div>
	{/if}
</main>