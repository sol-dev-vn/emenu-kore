<script lang="ts">
  export let data: {
    branch: {
      id?: string | number
      name?: string
      title?: string
      description?: string
      external_id?: string | number
      address?: string
      status?: string
    } | null
    menu_items: Array<{
      id?: string | number
      name?: string
      description?: string
      price?: number
      category_name?: string
      image_url?: string | null
      is_available?: boolean
    }>
    zones: Array<{
      id?: string | number
      name?: string
      code?: string
      description?: string
    }>
    tables: Array<{
      id?: string | number
      name?: string
      zone_id?: string | number | null
      is_active?: boolean
      status?: string
    }>
    error?: string | null
  }

  const branch = data?.branch ?? null
  const items = data?.menu_items ?? []
  const zones = data?.zones ?? []
  const tables = data?.tables ?? []
  const error = data?.error ?? null

  let activeTab: 'menu' | 'tables' = 'menu'

  // Group tables by zone_id
  const tablesByZone: Record<string, Array<any>> = {}
  for (const t of tables) {
    const key = String(t.zone_id ?? 'unassigned')
    if (!tablesByZone[key]) tablesByZone[key] = []
    tablesByZone[key].push(t)
  }

  // Helper to get zone name by id
  function zoneName(zoneId: string) {
    if (zoneId === 'unassigned') return 'Unassigned Zone'
    const z = zones.find((z) => String(z.id) === String(zoneId))
    return z?.name || 'Zone'
  }
</script>

<svelte:head>
  <title>{branch?.name || branch?.title || 'Branch'} Menu</title>
  <meta name="description" content={`Menu items and tables for ${branch?.name || branch?.title || 'branch'}`} />
</svelte:head>

<main class="min-h-screen bg-gray-50 p-8">
  <div class="max-w-5xl mx-auto">
    <nav class="mb-6">
      <a href="/" class="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
        <svg class="mr-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M6.707 16.707a1 1 0 01-1.414 0L.293 11.707a1 1 0 011.414-1.414L5 13.586V3a1 1 0 112 0v10.586l3.293-3.293a1 1 0 111.414 1.414l-5 5z" clip-rule="evenodd" />
        </svg>
        Back to branches
      </a>
    </nav>

    {#if error}
      <div class="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 class="text-red-800 font-semibold mb-2">Error loading branch</h2>
        <p class="text-red-600">{error}</p>
      </div>
    {:else if !branch}
      <div class="text-center py-12">
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">Branch not found</h2>
        <p class="text-gray-600">The requested branch could not be found.</p>
      </div>
    {:else}
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">{branch.name || branch.title || 'Untitled Branch'}</h1>
        {#if branch.description}
          <p class="text-gray-600">{branch.description}</p>
        {/if}
        {#if branch.status}
          <div class="mt-2 inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
            {branch.status}
          </div>
        {/if}
      </header>

      <!-- Tabs -->
      <div class="border-b border-gray-200 mb-6">
        <nav class="-mb-px flex space-x-6" aria-label="Tabs">
          <button class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            class:border-blue-500={activeTab === 'menu'}
            class:text-blue-600={activeTab === 'menu'}
            class:border-transparent={activeTab !== 'menu'}
            class:text-gray-500={activeTab !== 'menu'}
            on:click={() => (activeTab = 'menu')}
          >
            Menu Items
          </button>
          <button class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            class:border-blue-500={activeTab === 'tables'}
            class:text-blue-600={activeTab === 'tables'}
            class:border-transparent={activeTab !== 'tables'}
            class:text-gray-500={activeTab !== 'tables'}
            on:click={() => (activeTab = 'tables')}
          >
            Tables
          </button>
        </nav>
      </div>

      {#if activeTab === 'menu'}
        {#if items.length === 0}
          <div class="text-center py-12">
            <h2 class="text-2xl font-semibold text-gray-700 mb-2">No menu items</h2>
            <p class="text-gray-600">This branch has no menu items yet.</p>
          </div>
        {:else}
          <section>
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Menu Items</h2>
            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {#each items as item}
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  {#if item.image_url}
                    <img src={item.image_url} alt={item.name} class="w-full h-40 object-cover rounded-md mb-4" />
                  {/if}
                  <h3 class="text-lg font-semibold text-gray-900">{item.name || 'Unnamed Item'}</h3>
                  {#if item.category_name}
                    <p class="text-sm text-gray-500">{item.category_name}</p>
                  {/if}
                  {#if typeof item.price === 'number'}
                    <p class="mt-2 text-gray-900 font-medium">${item.price.toFixed(2)}</p>
                  {/if}
                  {#if item.description}
                    <p class="mt-2 text-gray-600 text-sm">{item.description}</p>
                  {/if}
                  {#if item.is_available === false}
                    <p class="mt-2 text-xs text-red-600">Currently unavailable</p>
                  {/if}
                </div>
              {/each}
            </div>
          </section>
        {/if}
      {:else}
        <!-- Tables tab -->
        {#if tables.length === 0}
          <div class="text-center py-12">
            <h2 class="text-2xl font-semibold text-gray-700 mb-2">No tables</h2>
            <p class="text-gray-600">This branch has no tables yet.</p>
          </div>
        {:else}
          <section>
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Tables by Zone</h2>
            <div class="space-y-6">
              {#each Object.keys(tablesByZone) as zoneKey}
                <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div class="px-6 py-4 border-b bg-gray-50">
                    <h3 class="text-lg font-semibold text-gray-900">{zoneName(zoneKey)}</h3>
                  </div>
                  <div class="p-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {#each tablesByZone[zoneKey] as t}
                      <div class="rounded-md border p-4">
                        <div class="flex items-center justify-between">
                          <span class="font-medium text-gray-900">{t.name}</span>
                          {#if t.status}
                            <span class="text-xs px-2 py-1 rounded-full"
                                  class:bg-green-100={t.status === 'available'}
                                  class:text-green-800={t.status === 'available'}
                                  class:bg-yellow-100={t.status === 'reserved'}
                                  class:text-yellow-800={t.status === 'reserved'}
                                  class:bg-red-100={t.status === 'occupied'}
                                  class:text-red-800={t.status === 'occupied'}
                            >{t.status}</span>
                          {/if}
                        </div>
                        {#if t.is_active === false}
                          <p class="mt-2 text-xs text-red-600">Inactive</p>
                        {/if}
                      </div>
                    {/each}
                  </div>
                </div>
              {/each}
            </div>
          </section>
        {/if}
      {/if}
    {/if}
  </div>
</main>