<script lang="ts">
  export let data: {
    brandBranches: Array<{
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
    brandInfo?: any;
    error?: string | null;
  };

  const branches = data?.brandBranches ?? [];
  const brandInfo = data?.brandInfo;
  const error = data?.error ?? null;
  const loading = false;

  // Calculate statistics
  $: totalMenuItems = branches.reduce((sum, branch) => sum + (branch.menu_items_count || 0), 0);
  $: totalTables = branches.reduce((sum, branch) => sum + (branch.tables_count || 0), 0);
  $: cities = [...new Set(branches.map(branch => branch.address?.split(',').pop()?.trim()))].filter(Boolean);
</script>

<svelte:head>
	<title>{brandInfo?.name || 'Brand'} Restaurants - SOL Restaurant</title>
	<meta name="description" content="Explore all {brandInfo?.name || 'brand'} locations and their digital menus" />
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
	{#if brandInfo}
		<!-- Brand Hero Section -->
		<section class="relative overflow-hidden" style="background: linear-gradient(135deg, {brandInfo.color} 0%, {brandInfo.color}dd 100%)">
			<div class="absolute inset-0 bg-black opacity-30"></div>
			<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
				<div class="text-center text-white">
					<div class="mb-6 flex justify-center">
						<div class="w-24 h-24 rounded-full flex items-center justify-center bg-white bg-opacity-20 backdrop-blur-sm">
							<div class="w-16 h-16 rounded-full flex items-center justify-center" style="background-color: {brandInfo.color}">
								<span class="text-white font-bold text-2xl">
									{brandInfo.name.split(' ').map(word => word[0]).join('').slice(0, 2)}
								</span>
							</div>
						</div>
					</div>
					<h1 class="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
						{brandInfo.name}
					</h1>
					<p class="text-xl md:text-2xl mb-8 text-white text-opacity-90 max-w-3xl mx-auto">
						{brandInfo.description}
					</p>
					<div class="flex flex-col sm:flex-row gap-4 justify-center">
						<a
							href="/restaurants"
							class="px-8 py-4 bg-white text-gray-800 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg"
						>
							← All Brands
						</a>
						<a
							href="/"
							class="px-8 py-4 bg-white bg-opacity-20 text-white rounded-lg font-semibold hover:bg-opacity-30 transition-colors shadow-lg backdrop-blur-sm"
						>
							Home
						</a>
					</div>
				</div>
			</div>
		</section>
	{/if}

	<!-- Brand Stats -->
	{#if brandInfo && branches.length > 0}
		<section class="py-12 bg-white">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
					<div class="p-6">
						<div class="text-3xl md:text-4xl font-bold" style="color: {brandInfo.color}">
							{branches.length}
						</div>
						<div class="text-gray-600 font-medium">Locations</div>
					</div>
					<div class="p-6">
						<div class="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{totalMenuItems}</div>
						<div class="text-gray-600 font-medium">Menu Items</div>
					</div>
					<div class="p-6">
						<div class="text-3xl md:text-4xl font-bold text-green-600 mb-2">{totalTables}</div>
						<div class="text-gray-600 font-medium">Total Tables</div>
					</div>
					<div class="p-6">
						<div class="text-3xl md:text-4xl font-bold text-purple-600 mb-2">{cities.length}</div>
						<div class="text-gray-600 font-medium">Cities</div>
					</div>
				</div>
			</div>
		</section>
	{/if}

	<!-- Locations Section -->
	<section class="py-16">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center mb-12">
				<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
					{brandInfo?.name || 'Brand'} Locations
				</h2>
				<p class="text-xl text-gray-600 max-w-2xl mx-auto">
					Discover our {brandInfo?.name?.toLowerCase() || 'brand'} restaurants near you
				</p>
			</div>

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
					<h2 class="text-2xl font-semibold text-gray-700 mb-2">No locations found</h2>
					<p class="text-gray-600">This brand doesn't have any active locations yet.</p>
				</div>
			{:else}
				<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					{#each branches as branch}
						<a href="/branches/{branch.id}" class="block">
							<article class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
								<div class="p-8">
									{#if brandInfo}
										<div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style="background-color: {brandInfo.color}20">
											<div class="w-10 h-10 rounded-full flex items-center justify-center" style="background-color: {brandInfo.color}">
												<span class="text-white font-bold">
													{brandInfo.name.split(' ').map(word => word[0]).join('').slice(0, 2)}
												</span>
											</div>
										</div>
									{/if}

									<div class="text-center mb-4">
										<h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
											{branch.name || branch.title || 'Untitled Branch'}
										</h3>
										{#if branch.code}
											<span class="inline-block text-sm text-gray-500 font-mono bg-gray-100 px-3 py-1 rounded-full mb-3">
												{branch.code}
											</span>
										{/if}
									</div>

									{#if branch.address}
										<div class="flex items-start justify-center mb-4">
											<svg class="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
											</svg>
											<p class="text-gray-600 text-sm text-center">{branch.address}</p>
										</div>
									{/if}

									{#if branch.description}
										<p class="text-gray-500 text-sm mb-4 text-center line-clamp-2">{branch.description}</p>
									{/if}

									<!-- Stats -->
									<div class="grid grid-cols-3 gap-2 mb-6">
										<div class="text-center p-2 bg-blue-50 rounded-lg">
											<div class="text-lg font-bold text-blue-600">
												{branch.menu_items_count || 0}
											</div>
											<div class="text-xs text-gray-600">Items</div>
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
										<div class="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full mb-4 w-full text-center">
											{branch.status}
										</div>
									{/if}

									<div class="flex items-center justify-center text-sm text-blue-600 hover:text-blue-800 font-medium">
										<span>View Digital Menu</span>
										<svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
										</svg>
									</div>
								</div>
							</article>
						</a>
					{/each}
				</div>
			{/if}
		</div>
	</section>

	<!-- Features Section -->
	{#if brandInfo}
		<section class="py-16 bg-white">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="text-center mb-12">
					<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
						Why Choose {brandInfo.name}
					</h2>
					<p class="text-xl text-gray-600 max-w-2xl mx-auto">
						Experience the best of Japanese cuisine with our exceptional service
					</p>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div class="text-center">
						<div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style="background-color: {brandInfo.color}20">
							<svg class="w-8 h-8" style="color: {brandInfo.color}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path>
							</svg>
						</div>
						<h3 class="text-xl font-semibold text-gray-900 mb-2">Authentic Cuisine</h3>
						<p class="text-gray-600">Traditional recipes with the finest ingredients prepared by expert chefs</p>
					</div>

					<div class="text-center">
						<div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style="background-color: {brandInfo.color}20">
							<svg class="w-8 h-8" style="color: {brandInfo.color}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
							</svg>
						</div>
						<h3 class="text-xl font-semibold text-gray-900 mb-2">Expert Service</h3>
						<p class="text-gray-600">Professional staff dedicated to providing an exceptional dining experience</p>
					</div>

					<div class="text-center">
						<div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style="background-color: {brandInfo.color}20">
							<svg class="w-8 h-8" style="color: {brandInfo.color}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
							</svg>
						</div>
						<h3 class="text-xl font-semibold text-gray-900 mb-2">Modern Ambiance</h3>
						<p class="text-gray-600">Elegant and comfortable settings perfect for any occasion</p>
					</div>
				</div>
			</div>
		</section>
	{/if}
</main>