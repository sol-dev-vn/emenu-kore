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
    }>;
    error?: string | null;
  };

  const branches = data?.branches ?? [];
  const error = data?.error ?? null;
  const loading = false;
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
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each branches as branch}
					<a href="/branches/{branch.id}" class="block">
						<article class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
							<div class="flex justify-between items-start mb-3">
								<h3 class="text-xl font-semibold text-gray-900">
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
									<p class="text-gray-600 text-sm">{branch.address}</p>
								</div>
							{/if}

							{#if branch.description}
								<p class="text-gray-500 text-sm mb-4">{branch.description}</p>
							{/if}

							<!-- Stats Section -->
							<div class="grid grid-cols-3 gap-4 mb-4">
								<div class="text-center">
									<div class="text-2xl font-bold text-blue-600">
										{branch.menu_items_count || 0}
									</div>
									<div class="text-xs text-gray-500">Menu Items</div>
									<div class="text-xs text-gray-500 font-medium">Global Menu</div>
								</div>
								<div class="text-center">
									<div class="text-2xl font-bold text-green-600">
										{branch.categories_count || 0}
									</div>
									<div class="text-xs text-gray-500">Categories</div>
								</div>
								<div class="text-center">
									<div class="text-2xl font-bold text-purple-600">
										{branch.tables_count || 0}
									</div>
									<div class="text-xs text-gray-500">Tables</div>
								</div>
							</div>

							{#if branch.status}
								<div class="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
									{branch.status}
								</div>
							{/if}

							<div class="mt-4 flex items-center text-sm text-blue-600 hover:text-blue-800">
								<span>View {branch.menu_items_count || 0} Menu Items</span>
								<svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
								</svg>
							</div>
						</article>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</main>