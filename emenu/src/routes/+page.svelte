<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  // QR Scanner functionality removed - using manual entry only

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

  let scanning = false;
  let manualTableId = '';
  let scanError: string | null = null;
  let qrKey = 0; // Force re-render when needed

  async function handleQRScan(result: any) {
    if (result && result[0]?.rawValue) {
      const qrData = result[0].rawValue;
      await processQRCode(qrData);
    }
  }

  async function processQRCode(qrData: string) {
    try {
      scanError = null;

      // Extract table ID from QR URL or direct value
      let tableId: string | null = null;

      if (qrData.includes('/qr/')) {
        // URL format: http://sol-menu.alphabits.team/qr/[table-id]
        const parts = qrData.split('/qr/');
        if (parts.length > 1) {
          tableId = parts[1].split('?')[0]; // Remove query parameters if any
        }
      } else {
        // Direct table ID
        tableId = qrData;
      }

      if (tableId) {
        // Validate table ID format (numeric)
        if (/^\d+$/.test(tableId)) {
          stopScanning();
          await goto(`/qr/${tableId}`);
        } else {
          scanError = 'Invalid QR code format. Please scan a valid table QR code.';
        }
      } else {
        scanError = 'Could not read QR code. Please try again.';
      }
    } catch (error) {
      console.error('QR scan processing error:', error);
      scanError = 'Failed to process QR code. Please try again.';
    }
  }

  function startScanning() {
    scanning = true;
    scanError = null;
    // QR Scanner temporarily disabled - showing manual entry only
  }

  function stopScanning() {
    scanning = false;
  }

  async function handleManualSubmit() {
    if (!manualTableId.trim()) {
      scanError = 'Please enter a table number.';
      return;
    }

    if (/^\d+$/.test(manualTableId.trim())) {
      scanError = null;
      await goto(`/qr/${manualTableId.trim()}`);
    } else {
      scanError = 'Invalid table number. Please enter a valid numeric table ID.';
    }
  }

  function handleError(error: any) {
    console.error('QR scanner error:', error);
    scanError = 'Camera access denied or unavailable. Please use manual entry.';
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

		<!-- Manual Table Entry Modal (when active) -->
		{#if scanning}
			<div class="md:hidden bg-white bg-opacity-95 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center">
				<div class="relative w-full max-w-xs">
					<div class="text-center mb-4">
						<p class="text-gray-600 mb-2">Enter table number manually:</p>
						<form on:submit|preventDefault={handleManualSubmit} class="space-y-3">
							<input
								type="text"
								bind:value={manualTableId}
								placeholder="Table #"
								class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<button
								type="submit"
								class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
							>
								Go to Table
							</button>
						</form>
					</div>
					{#if scanError}
						<div class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
							{scanError}
						</div>
					{/if}
					<div class="mt-4">
						<button
							on:click={stopScanner}
							class="w-full px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium"
						>
							Cancel
						</button>
					</div>
				</div>
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

	<!-- Desktop Manual Table Entry Modal -->
	{#if scanning}
		<div class="hidden md:flex fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="modal-title" on:click={stopScanner} on:keydown={(e) => { if (e.key === 'Escape') stopScanner(); }}>
			<div class="bg-white rounded-2xl p-6 max-w-lg mx-4 w-full" on:click|stopPropagation>
				<div class="text-center mb-6">
					<h2 id="modal-title" class="text-xl font-semibold text-gray-900 mb-2">Table Access</h2>
					<p class="text-gray-600 mb-4">Enter your table number to access the menu</p>
					<form on:submit|preventDefault={handleManualSubmit} class="space-y-4">
						<input
							type="text"
							bind:value={manualTableId}
							placeholder="Table #"
							class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							autofocus
						/>
						<button
							type="submit"
							class="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
						>
							Go to Table
						</button>
					</form>
				</div>
				{#if scanError}
					<div class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
						{scanError}
					</div>
				{/if}
				<div class="text-center">
					<button
						on:click={stopScanner}
						class="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	{/if}
</main>