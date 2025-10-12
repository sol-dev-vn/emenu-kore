<script lang="ts">
  export let data: {
    branches: Array<{ id?: string | number; name?: string; title?: string; description?: string; status?: string }>;
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
			<h1 class="text-4xl font-bold text-gray-900 mb-2">Directus Branches</h1>
			<p class="text-gray-600">Browse our collection of branches</p>
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
					<article class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
						<h3 class="text-xl font-semibold text-gray-900 mb-2">
							{branch.name || branch.title || 'Untitled Branch'}
						</h3>
						{#if branch.description}
							<p class="text-gray-600 mb-4">{branch.description}</p>
						{/if}
						{#if branch.status}
							<div class="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
								{branch.status}
							</div>
						{/if}
					</article>
				{/each}
			</div>
		{/if}
	</div>
</main>