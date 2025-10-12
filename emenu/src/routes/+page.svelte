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
	<title>Directus Branches</title>
	<meta name="description" content="List of branches from Directus" />
</svelte:head>

<main class="min-h-screen bg-gray-50 p-8">
	<div class="max-w-4xl mx-auto">
		<header class="mb-8">
			<h1 class="text-4xl font-bold text-gray-900 mb-2">SOL Restaurant Branches</h1>
			<p class="text-gray-600">Browse our restaurant locations and explore their menus</p>
		</header>

		{#if loading}
			<div class="text-center py-12">
				<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				<p class="mt-4 text-gray-600">Loading branches...</p>
			</div>
		{:else if error}
			<div class="bg-red-50 border border-red-200 rounded-lg p-6">
				<h2 class="text-red-800 font-semibold mb-2">Error loading branches</h2>
				<p class="text-red-600">{error}</p>
			</div>
		{:else if branches.length === 0}
			<div class="text-center py-12">
				<h2 class="text-2xl font-semibold text-gray-700 mb-2">No branches found</h2>
				<p class="text-gray-600">Check back later for updates.</p>
			</div>
		{:else}
			<div class="space-y-8">
				{#each sortedBrands as [brandId, brandBranches]}
					<section class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
						<!-- Brand Header -->
						<div class="px-6 py-4 border-b border-gray-200" style="background-color: {brandId === 'unbranded' ? '#f9fafb' : brandInfo[brandId as keyof typeof brandInfo]?.color + '15'}">
							<div class="flex items-center justify-between">
								<div class="flex items-center space-x-3">
									{#if brandId !== 'unbranded'}
										<div class="w-4 h-4 rounded-full" style="background-color: {brandInfo[brandId as keyof typeof brandInfo]?.color}"></div>
									{/if}
									<div>
										<h2 class="text-xl font-semibold text-gray-900">
											{brandId === 'unbranded' ? 'Other Branches' : brandInfo[brandId as keyof typeof brandInfo]?.name || brandId}
										</h2>
										{#if brandId !== 'unbranded'}
											<p class="text-sm text-gray-600">{brandInfo[brandId as keyof typeof brandInfo]?.description}</p>
										{/if}
									</div>
								</div>
								<div class="text-sm text-gray-500">
									{brandBranches.length} {brandBranches.length === 1 ? 'location' : 'locations'}
								</div>
							</div>
						</div>

						<!-- Branches Grid -->
						<div class="p-6">
							<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
								{#each brandBranches as branch}
									<a href="/branches/{branch.id}" class="block">
										<article class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all hover:border-blue-300 cursor-pointer bg-white">
											<div class="flex justify-between items-start mb-2">
												<h3 class="font-semibold text-gray-900 text-sm">
													{branch.name || branch.title || 'Untitled Branch'}
												</h3>
												{#if branch.code}
													<span class="text-xs text-gray-500 font-mono bg-gray-100 px-1.5 py-0.5 rounded">
														{branch.code}
													</span>
												{/if}
											</div>

											{#if branch.address}
												<div class="flex items-start mb-3">
													<svg class="w-3 h-3 text-gray-400 mr-1.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
													</svg>
													<p class="text-gray-600 text-xs line-clamp-1">{branch.address}</p>
												</div>
											{/if}

											<!-- Compact Stats -->
											<div class="flex items-center justify-between text-xs text-gray-500 mb-3">
												<div class="flex items-center space-x-3">
													<span class="flex items-center">
														<svg class="w-3 h-3 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
														</svg>
														{branch.menu_items_count > 0 ? branch.menu_items_count : '-'}
													</span>
													<span class="flex items-center">
														<svg class="w-3 h-3 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
														</svg>
														{branch.categories_count || 0}
													</span>
													<span class="flex items-center">
														<svg class="w-3 h-3 mr-1 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
														</svg>
														{branch.tables_count || 0}
													</span>
												</div>
											</div>

											<div class="flex items-center text-xs text-blue-600 hover:text-blue-800 font-medium">
												<span>View Menu</span>
												<svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
</main>