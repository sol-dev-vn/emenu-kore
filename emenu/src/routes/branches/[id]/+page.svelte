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
      code?: string
    } | null
    categories: Array<{
      id?: string | number
      name?: string
      description?: string
      menu_items: Array<{
        id?: string | number
        name?: string
        description?: string
        price?: number
        category_name?: string
        image_url?: string | null
        is_available?: boolean
      }>
    }>
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
  const categories = data?.categories ?? []
  const items = data?.menu_items ?? []
  const zones = data?.zones ?? []
  const tables = data?.tables ?? []
  const error = data?.error ?? null

  let activeTab: 'menu' | 'tables' = 'menu'
  let expandedCategories: Set<string> = new Set()

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

  // Toggle category expansion
  function toggleCategory(categoryId: string) {
    if (expandedCategories.has(categoryId)) {
      expandedCategories.delete(categoryId)
    } else {
      expandedCategories.add(categoryId)
    }
    expandedCategories = expandedCategories
  }

  // Format price
  function formatPrice(price?: number) {
    if (typeof price !== 'number') return ''
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  // Calculate total menu items
  $: totalMenuItems = categories.reduce((sum, cat) => sum + cat.menu_items.length, 0)
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
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
              {branch.name || branch.title || 'Untitled Branch'}
            </h1>
            {#if branch.code}
              <span class="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded inline-block mb-2">
                {branch.code}
              </span>
            {/if}
          </div>
          <div class="text-right">
            <div class="text-sm text-gray-500 mb-1">
              <span class="font-medium text-blue-600">{totalMenuItems}</span> menu items
            </div>
            <div class="text-sm text-gray-500">
              <span class="font-medium text-green-600">{categories.length}</span> categories
            </div>
          </div>
        </div>

        {#if branch.address}
          <div class="flex items-center mt-3 mb-4">
            <svg class="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <p class="text-gray-600">{branch.address}</p>
          </div>
        {/if}

        {#if branch.description}
          <p class="text-gray-600 mb-4">{branch.description}</p>
        {/if}

        {#if branch.status}
          <div class="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
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
        {#if categories.length === 0}
          <div class="text-center py-12">
            <h2 class="text-2xl font-semibold text-gray-700 mb-2">No menu items</h2>
            <p class="text-gray-600">This branch has no menu items yet.</p>
          </div>
        {:else}
          <section>
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-semibold text-gray-900">Menu Categories</h2>
              <button
                on:click={() => {
                  categories.forEach(cat => expandedCategories.add(String(cat.id)))
                  expandedCategories = expandedCategories
                }}
                class="text-sm text-blue-600 hover:text-blue-800"
              >
                Expand All
              </button>
            </div>

            <div class="space-y-6">
              {#each categories as category}
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <button
                    class="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                    on:click={() => toggleCategory(String(category.id))}
                  >
                    <div class="flex items-center">
                      <svg
                        class="w-5 h-5 text-gray-400 mr-3 transition-transform"
                        class:rotate-90={expandedCategories.has(String(category.id))}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                      <div class="text-left">
                        <h3 class="text-lg font-semibold text-gray-900">{category.name || 'Unnamed Category'}</h3>
                        {#if category.description}
                          <p class="text-sm text-gray-500">{category.description}</p>
                        {/if}
                      </div>
                    </div>
                    <div class="text-sm text-gray-500">
                      <span class="font-medium text-blue-600">{category.menu_items?.length || 0}</span> items
                    </div>
                  </button>

                  {#if expandedCategories.has(String(category.id)) && category.menu_items?.length > 0}
                    <div class="border-t border-gray-200">
                      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-6">
                        {#each category.menu_items as item}
                          <div class="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div class="flex justify-between items-start mb-2">
                              <h4 class="font-medium text-gray-900">{item.name || 'Unnamed Item'}</h4>
                              {#if typeof item.price === 'number'}
                                <span class="text-lg font-semibold text-green-600">
                                  {formatPrice(item.price)}
                                </span>
                              {/if}
                            </div>

                            {#if item.description}
                              <p class="text-sm text-gray-600 mb-3">{item.description}</p>
                            {/if}

                            {#if item.image_url}
                              <img
                                src={item.image_url}
                                alt={item.name}
                                class="w-full h-32 object-cover rounded-md mb-3"
                              />
                            {/if}

                            {#if item.is_available === false}
                              <div class="flex items-center text-xs text-red-600">
                                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                                </svg>
                                Currently unavailable
                              </div>
                            {/if}
                          </div>
                        {/each}
                      </div>
                    </div>
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