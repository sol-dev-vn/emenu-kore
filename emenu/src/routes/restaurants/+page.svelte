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

  // Brand information
  const brandInfo = {
    miwaku_premium: { name: 'Miwaku Premium', color: '#FF6B6B', description: 'Iconic Anniversary Restaurant at Landmark 81' },
    s79_teppanyaki: { name: 'S79 Japanese Teppanyaki', color: '#4ECDC4', description: 'Premium teppanyaki experience' },
    kohaku_sashimi_yakiniku: { name: 'Kohaku Sashimi & Yakiniku', color: '#45B7D1', description: 'Traditional Japanese cuisine' },
    kohaku_sushi: { name: 'Kohaku Sushi', color: '#96CEB4', description: 'Authentic sushi and sashimi' },
    kohaku_udon_ramen: { name: 'Kohaku Udon & Ramen', color: '#FFEAA7', description: 'Japanese noodle specialties' },
    date_nariya: { name: 'Date Nariya', color: '#DDA0DD', description: 'Japanese Gyutan Steak' },
    machida_shoten: { name: 'Machida Shoten', color: '#FFA500', description: 'Traditional Japanese izakaya' }
  };

  // Group branches by brand
  $: groupedBranches = branches.reduce((acc, branch) => {
    const brand = branch.brand_id || 'unbranded';
    if (!acc[brand]) {
      acc[brand] = [];
    }
    acc[brand].push(branch);
    return acc;
  }, {} as Record<string, typeof branches>);

  // Sort brands by name
  $: sortedBrands = Object.entries(groupedBranches).sort(([a], [b]) => {
    if (a === 'unbranded') return 1;
    if (b === 'unbranded') return -1;
    return (brandInfo[a as keyof typeof brandInfo]?.name || a).localeCompare(brandInfo[b as keyof typeof brandInfo]?.name || b);
  });
</script>

<svelte:head>
	<title>All Restaurants - SOL Restaurant</title>
	<meta name="description" content="Browse all SOL restaurant locations and explore their digital menus" />
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
	<!-- Header Section -->
	<section class="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
		<div class="absolute inset-0 bg-black opacity-20"></div>
		<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
			<div class="text-center">
				<h1 class="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
					All Restaurants
				</h1>
				<p class="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
					Explore our complete collection of restaurant locations<br/>
					<span class="text-lg text-blue-200">{branches.length} Locations Across All Brands</span>
				</p>
				<div class="flex flex-col sm:flex-row gap-4 justify-center">
					<a
						href="/"
						class="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
					>
						← Back to Home
					</a>
					<a
						href="/#qr-scanner"
						class="px-8 py-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-400 transition-colors shadow-lg"
					>
						Scan QR Code
					</a>
				</div>
			</div>
		</div>
	</section>

	<!-- Filter Section -->
	<section class="py-8 bg-white border-b">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex flex-wrap gap-4 justify-center">
				<a
					href="/restaurants"
					class="px-6 py-3 bg-blue-100 text-blue-700 rounded-full font-medium hover:bg-blue-200 transition-colors"
				>
					All Brands
				</a>
				{#each Object.entries(brandInfo) as [brandId, brand]}
					<a
						href="/restaurants/{brandId}"
						class="px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors"
					>
						{brand.name}
					</a>
				{/each}
			</div>
		</div>
	</section>

	<!-- Branches Listing -->
	<section class="py-16">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			{#if loading}
				<div class="text-center py-12">
					<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
					<p class="mt-4 text-gray-600">Loading restaurants...</p>
				</div>
			{:else if error}
				<div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
					<h2 class="text-red-800 font-semibold mb-2">Error loading restaurants</h2>
					<p class="text-red-600">{error}</p>
				</div>
			{:else if branches.length === 0}
				<div class="text-center py-12">
					<h2 class="text-2xl font-semibold text-gray-700 mb-2">No restaurants found</h2>
					<p class="text-gray-600">Check back later for updates.</p>
				</div>
			{:else}
				<div class="space-y-12">
					{#each sortedBrands as [brandId, brandBranches]}
						<section class="bg-white rounded-2xl shadow-lg overflow-hidden">
							<!-- Brand Header -->
							<div class="px-8 py-6 border-b border-gray-200" style="background-color: {brandId === 'unbranded' ? '#f9fafb' : brandInfo[brandId as keyof typeof brandInfo]?.color + '15'}">
								<div class="flex items-center justify-between">
									<div class="flex items-center space-x-4">
										{#if brandId !== 'unbranded'}
											<div class="w-8 h-8 rounded-full flex items-center justify-center" style="background-color: {brandInfo[brandId as keyof typeof brandInfo]?.color}">
												<span class="text-white font-bold text-sm">
													{brandInfo[brandId as keyof typeof brandInfo]?.name.split(' ').map(word => word[0]).join('').slice(0, 2)}
												</span>
											</div>
										{:else}
											<div class="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center">
												<span class="text-white font-bold text-sm">?</span>
											</div>
										{/if}
										<div>
											<h2 class="text-2xl font-bold text-gray-900">
												{brandId === 'unbranded' ? 'Other Branches' : brandInfo[brandId as keyof typeof brandInfo]?.name || brandId}
											</h2>
											{#if brandId !== 'unbranded'}
												<p class="text-gray-600">{brandInfo[brandId as keyof typeof brandInfo]?.description}</p>
											{/if}
										</div>
									</div>
									<div class="text-lg text-gray-600 font-medium">
										{brandBranches.length} {brandBranches.length === 1 ? 'location' : 'locations'}
									</div>
								</div>
							</div>

							<!-- Branches Grid -->
							<div class="p-8">
								<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
									{#each brandBranches as branch}
										<a href="/branches/{branch.id}" class="block">
											<article class="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all hover:border-blue-300 cursor-pointer bg-white group">
												<div class="flex justify-between items-start mb-3">
													<h3 class="font-bold text-gray-900 text-base group-hover:text-blue-600 transition-colors">
														{branch.name || branch.title || 'Untitled Branch'}
													</h3>
													{#if branch.code}
														<span class="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
															{branch.code}
														</span>
													{/if}
												</div>

												{#if branch.address}
													<div class="flex items-start mb-4">
														<svg class="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
														</svg>
														<p class="text-gray-600 text-sm line-clamp-2">{branch.address}</p>
													</div>
												{/if}

												{#if branch.description}
													<p class="text-gray-500 text-sm mb-4 line-clamp-2">{branch.description}</p>
												{/if}

												<!-- Stats Section -->
												<div class="grid grid-cols-3 gap-3 mb-4">
													<div class="text-center p-2 bg-blue-50 rounded-lg">
														<div class="text-lg font-bold text-blue-600">
															{branch.menu_items_count || 0}
														</div>
														<div class="text-xs text-gray-600">Menu Items</div>
													</div>
													<div class="text-center p-2 bg-green-50 rounded-lg">
														<div class="text-lg font-bold text-green-600">
															{branch.categories_count || 0}
														</div>
														<div class="text-xs text-gray-600">Categories</div>
													</div>
													<div class="text-center p-2 bg-purple-50 rounded-lg">
														<div class="text-lg font-bold text-purple-600">
															{branch.tables_count || 0}
														</div>
														<div class="text-xs text-gray-600">Tables</div>
													</div>
												</div>

												{#if branch.status}
													<div class="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full mb-3">
														{branch.status}
													</div>
												{/if}

												<div class="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium group-hover:text-blue-700">
													<span>View Menu</span>
													<svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
													</svg>
												</div>
											</article>
										</a>
									{/each}
								</div>
							</div>
						</section>
					{/each}
				</div>
			{/if}
		</div>
	</section>

	<!-- Quick Stats Section -->
	<section class="py-16 bg-white">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center mb-12">
				<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
					SOL Restaurant Network
				</h2>
				<p class="text-xl text-gray-600 max-w-2xl mx-auto">
					Your gateway to exceptional Japanese dining across Vietnam
				</p>
			</div>
			<div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
				<div class="p-6">
					<div class="text-3xl md:text-4xl font-bold text-blue-600 mb-2">7</div>
					<div class="text-gray-600 font-medium">Premium Brands</div>
				</div>
				<div class="p-6">
					<div class="text-3xl md:text-4xl font-bold text-green-600 mb-2">{branches.length}</div>
					<div class="text-gray-600 font-medium">Restaurant Locations</div>
				</div>
				<div class="p-6">
					<div class="text-3xl md:text-4xl font-bold text-purple-600 mb-2">1000+</div>
					<div class="text-gray-600 font-medium">Menu Items</div>
				</div>
				<div class="p-6">
					<div class="text-3xl md:text-4xl font-bold text-orange-600 mb-2">24/7</div>
					<div class="text-gray-600 font-medium">Digital Access</div>
				</div>
			</div>
		</div>
	</section>
</main>