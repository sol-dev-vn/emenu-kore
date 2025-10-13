<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import LoadingWrapper from '$lib/components/ui/LoadingWrapper.svelte';
	import PageTransition from '$lib/components/ui/PageTransition.svelte';
	import Button from '$lib/components/flowbite/Button.svelte';
	import Card from '$lib/components/flowbite/Card.svelte';
	import Badge from '$lib/components/flowbite/Badge.svelte';
	import MenuCard from '$lib/components/MenuCard.svelte';

	export let params: { tableId: string };
	let tableId = params.tableId;
	let isLoading = true;
	let error: string | null = null;
	let showContent = false;

	// Menu data
	let menuData = {
		categories: [],
		items: [],
		tableInfo: null
	};

	// UI state
	let selectedCategory = $state(null);
	let searchQuery = $state('');
	let filteredItems = $state([]);
	let favorites = $state(new Set());
	let cart = $state([]);
	let showCart = $state(false);
	let showFavoritesOnly = $state(false);
	let sortBy = $state('category'); // 'category', 'price', 'name', 'popular'
	let sortOrder = $state('asc'); // 'asc', 'desc'
	let cartTotal = $state(0);
	let cartItemCount = $state(0);

	onMount(async () => {
		try {
			// Load menu data
			await loadMenuData();

			// Set initial category
			if (menuData.categories.length > 0) {
				selectedCategory = menuData.categories[0].id;
			}

			// Trigger content animation
			showContent = true;
		} catch (err) {
			console.error('Failed to load menu:', err);
			error = err instanceof Error ? err.message : 'Failed to load menu';
		} finally {
			isLoading = false;
		}
	});

	async function loadMenuData() {
		// Simulate API call to load menu data
		// In a real implementation, this would fetch from Directus
		await new Promise(resolve => setTimeout(resolve, 1000));

		const categories = [
			{ id: 'appetizers', name: 'Appetizers', icon: '🥟', color: 'cyan' },
			{ id: 'mains', name: 'Main Course', icon: '🍱', color: 'orange' },
			{ id: 'sushi', name: 'Sushi & Sashimi', icon: '🍣', color: 'green' },
			{ id: 'ramen', name: 'Ramen', icon: '🍜', color: 'red' },
			{ id: 'beverages', name: 'Beverages', icon: '🥤', color: 'blue' },
			{ id: 'desserts', name: 'Desserts', icon: '🍰', color: 'purple' }
		];

		const items = generateMockMenuItems();

		menuData = {
			categories,
			items,
			tableInfo: {
				id: tableId,
				name: `Table ${tableId}`,
				zone: 'Main Dining',
				capacity: 4
			}
		};

		updateFilteredItems();
	}

	function generateMockMenuItems() {
		const menuItems = [];

		// Appetizers
		menuItems.push(
			{
				id: 'edamame',
				categoryId: 'appetizers',
				name: 'Edamame',
				description: 'Steamed soybeans with sea salt',
				price: 45000,
				image: '/images/menu/edamame.jpg',
				tags: ['vegetarian', 'popular'],
				spiceLevel: 0,
				available: true,
				prepTime: '5 min'
			},
			{
				id: 'gyoza',
				categoryId: 'appetizers',
				name: 'Pork Gyoza',
				description: 'Pan-fried dumplings with pork and vegetables',
				price: 65000,
				image: '/images/menu/gyoza.jpg',
				tags: ['popular', 'pork'],
				spiceLevel: 1,
				available: true,
				prepTime: '10 min'
			}
		);

		// Main Course
		menuItems.push(
			{
				id: 'teriyaki-chicken',
				categoryId: 'mains',
				name: 'Teriyaki Chicken',
				description: 'Grilled chicken with teriyaki sauce, served with rice',
				price: 125000,
				image: '/images/menu/teriyaki-chicken.jpg',
				tags: ['chicken', 'grilled'],
				spiceLevel: 1,
				available: true,
				prepTime: '15 min'
			},
			{
				id: 'salmon-teriyaki',
				categoryId: 'mains',
				name: 'Salmon Teriyaki',
				description: 'Fresh Atlantic salmon with teriyaki glaze',
				price: 185000,
				image: '/images/menu/salmon-teriyaki.jpg',
				tags: ['fish', 'grilled', 'signature'],
				spiceLevel: 0,
				available: true,
				prepTime: '20 min'
			}
		);

		// Sushi & Sashimi
		menuItems.push(
			{
				id: 'california-roll',
				categoryId: 'sushi',
				name: 'California Roll',
				description: 'Crab, avocado, and cucumber',
				price: 95000,
				image: '/images/menu/california-roll.jpg',
				tags: ['popular', 'crab', 'vegetarian'],
				spiceLevel: 0,
				available: true,
				prepTime: '10 min'
			},
			{
				id: 'salmon-sashimi',
				categoryId: 'sushi',
				name: 'Salmon Sashimi',
				description: 'Fresh salmon sashimi, 6 pieces',
				price: 145000,
				image: '/images/menu/salmon-sashimi.jpg',
				tags: ['fish', 'fresh'],
				spiceLevel: 0,
				available: true,
				prepTime: '5 min'
			}
		);

		// Ramen
		menuItems.push(
			{
				id: 'tonkotsu-ramen',
				categoryId: 'ramen',
				name: 'Tonkotsu Ramen',
				description: 'Pork bone broth with chashu, egg, and noodles',
				price: 110000,
				image: '/images/menu/tonkotsu-ramen.jpg',
				tags: ['pork', 'soup', 'signature'],
				spiceLevel: 2,
				available: true,
				prepTime: '12 min'
			}
		);

		// Beverages
		menuItems.push(
			{
				id: 'green-tea',
				categoryId: 'beverages',
				name: 'Japanese Green Tea',
				description: 'Traditional Japanese green tea',
				price: 25000,
				image: '/images/menu/green-tea.jpg',
				tags: ['tea', 'hot', 'traditional'],
				spiceLevel: 0,
				available: true,
				prepTime: '3 min'
			},
			{
				id: 'sake',
				categoryId: 'beverages',
				name: 'Premium Sake',
				description: 'House selected premium Japanese sake',
				price: 85000,
				image: '/images/menu/sake.jpg',
				tags: ['alcohol', 'traditional'],
				spiceLevel: 0,
				available: true,
				prepTime: '2 min'
			}
		);

		// Desserts
		menuItems.push(
			{
				id: 'mochi-ice-cream',
				categoryId: 'desserts',
				name: 'Mochi Ice Cream',
				description: 'Traditional Japanese rice cake with ice cream',
				price: 55000,
				image: '/images/menu/mochi-ice-cream.jpg',
				tags: ['sweet', 'cold'],
				spiceLevel: 0,
				available: true,
				prepTime: '5 min'
			}
		);

		return menuItems;
	}

	function updateFilteredItems() {
		let items = menuData.items;

		// Filter by category
		if (selectedCategory) {
			items = items.filter(item => item.categoryId === selectedCategory);
		}

		// Filter by search query
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			items = items.filter(item =>
				item.name.toLowerCase().includes(query) ||
				item.description.toLowerCase().includes(query) ||
				item.tags.some(tag => tag.toLowerCase().includes(query))
			);
		}

		// Filter by favorites
		if (showFavoritesOnly) {
			items = items.filter(item => favorites.has(item.id));
		}

		// Sort items
		items = sortItems(items);

		filteredItems = items;

		// Update cart totals
		cartTotal = getCartTotal();
		cartItemCount = getCartItemCount();
	}

	function sortItems(items) {
		const sorted = [...items];

		switch (sortBy) {
			case 'price':
				sorted.sort((a, b) => sortOrder === 'asc' ? a.price - b.price : b.price - a.price);
				break;
			case 'name':
				sorted.sort((a, b) => sortOrder === 'asc'
					? a.name.localeCompare(b.name)
					: b.name.localeCompare(a.name));
				break;
			case 'popular':
				// Mock popularity based on tags
				sorted.sort((a, b) => sortOrder === 'asc'
					? (a.tags.includes('popular') ? 0 : 1) - (b.tags.includes('popular') ? 0 : 1)
					: (b.tags.includes('popular') ? 0 : 1) - (a.tags.includes('popular') ? 0 : 1));
				break;
			default:
				// Keep original order (category-based)
				break;
		}

		return sorted;
	}

	function selectCategory(categoryId) {
		selectedCategory = categoryId;
		updateFilteredItems();
	}

	function toggleFavorite(itemId) {
		const newFavorites = new Set(favorites);
		if (newFavorites.has(itemId)) {
			newFavorites.delete(itemId);
		} else {
			newFavorites.add(itemId);
		}
		favorites = newFavorites; // Trigger reactivity
		updateFilteredItems();
	}

	function formatPrice(price) {
		return new Intl.NumberFormat('vi-VN').format(price) + '₫';
	}

	function getSpiceLevelColor(level) {
		switch (level) {
			case 0: return 'secondary';
			case 1: return 'success';
			case 2: return 'warning';
			case 3: return 'danger';
			default: return 'secondary';
		}
	}

	function getSpiceLevelText(level) {
		switch (level) {
			case 0: return 'Mild';
			case 1: return 'Medium';
			case 2: return 'Spicy';
			case 3: return 'Very Spicy';
			default: return 'Mild';
		}
	}

	function addToCart(item, quantity = 1) {
		const existingItem = cart.find(cartItem => cartItem.id === item.id);
		if (existingItem) {
			existingItem.quantity += quantity;
			cart = [...cart]; // Trigger reactivity
		} else {
			cart = [...cart, { ...item, quantity }];
		}
		// Update cart totals
		cartTotal = getCartTotal();
		cartItemCount = getCartItemCount();
	}

	function removeFromCart(itemId) {
		cart = cart.filter(item => item.id !== itemId);
		// Update cart totals
		cartTotal = getCartTotal();
		cartItemCount = getCartItemCount();
	}

	function updateCartQuantity(itemId, quantity) {
		if (quantity <= 0) {
			removeFromCart(itemId);
		} else {
			const item = cart.find(cartItem => cartItem.id === itemId);
			if (item) {
				item.quantity = quantity;
				cart = [...cart]; // Trigger reactivity
			}
		}
		// Update cart totals
		cartTotal = getCartTotal();
		cartItemCount = getCartItemCount();
	}

	function getCartTotal() {
		return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
	}

	function getCartItemCount() {
		return cart.reduce((total, item) => total + item.quantity, 0);
	}

	function clearCart() {
		cart = [];
		// Update cart totals
		cartTotal = getCartTotal();
		cartItemCount = getCartItemCount();
	}

	function toggleSortOrder() {
		sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		updateFilteredItems();
	}

	function toggleFavoritesOnly() {
		showFavoritesOnly = !showFavoritesOnly;
		updateFilteredItems();
	}

	function goBack() {
		window.location.href = `/qr/${tableId}`;
	}

	function callStaff() {
		// In a real implementation, this would send a notification to staff
		alert('Staff notification would be sent here');
	}

	function viewCart() {
		showCart = true;
	}

	// Reactive statements - handled by $state updates in functions
</script>

<svelte:head>
	<title>Menu - Table {menuData.tableInfo?.name || 'Loading...'}</title>
	<meta name="description" content="SOL Restaurant - Digital Menu" />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
</svelte:head>

{#if error}
	<div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
		<div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
			<div class="text-red-500 text-6xl mb-4">⚠️</div>
			<h1 class="text-2xl font-bold text-gray-900 mb-2">Menu Unavailable</h1>
			<p class="text-gray-600 mb-6">{error}</p>
			<Button color="cyan" onclick={goBack}>
				<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
				</svg>
				Back to Table
			</Button>
		</div>
	</div>
{:else if isLoading}
	<!-- Loading State -->
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
		<div class="p-4">
			<LoadingWrapper>
				<div class="space-y-6">
					<div class="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48"></div>
					<div class="space-y-4">
						<div class="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							{#each Array(6) as _}
								<div class="h-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
							{/each}
						</div>
					</div>
				</div>
			</LoadingWrapper>
		</div>
	</div>
{:else}
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
		<!-- Header -->
		<header class="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 sticky top-0 z-10">
			<div class="px-4 py-3">
				<div class="flex items-center justify-between">
					<div class="flex items-center space-x-3">
						<Button color="secondary" size="sm" onclick={goBack} outline={true}>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
							</svg>
						</Button>
						<div>
							<h1 class="font-semibold text-gray-900 dark:text-white">Digital Menu</h1>
							<p class="text-sm text-gray-600 dark:text-gray-400">{menuData.tableInfo?.name}</p>
						</div>
					</div>
					<div class="flex items-center space-x-2">
						<!-- Favorites Badge -->
						{#if favorites.size > 0}
							<Badge color="warning" size="sm">{favorites.size} favorites</Badge>
						{/if}

						<!-- Cart Button -->
						<Button color="cyan" size="sm" onclick={viewCart}>
							<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
							</svg>
							{#if cartItemCount > 0}
								<span class="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 ml-1">
									{cartItemCount}
								</span>
							{/if}
						</Button>
					</div>
				</div>
			</div>
		</header>

		<!-- Main Content -->
		<main class="flex-1">
			<PageTransition show={showContent} duration={500} blur={true}>
				<div class="p-4">
					<!-- Search and Filter Bar -->
					<div class="mb-6 space-y-4">
						<!-- Search Bar -->
						<div class="relative">
							<input
								type="text"
								placeholder="Search menu items..."
								bind:value={searchQuery}
								class="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
							/>
							<svg class="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
							</svg>
							{#if searchQuery}
								<button
									onclick={() => searchQuery = ''}
									class="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
								>
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
									</svg>
								</button>
							{/if}
						</div>

						<!-- Filter Options -->
						<div class="flex flex-wrap gap-2">
							<!-- Sort Options -->
							<select
								bind:value={sortBy}
								class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
							>
								<option value="category">Sort by Category</option>
								<option value="price">Sort by Price</option>
								<option value="name">Sort by Name</option>
								<option value="popular">Sort by Popular</option>
							</select>

							<!-- Sort Order -->
							<Button
								color="secondary"
								size="sm"
								outline={true}
								onclick={toggleSortOrder}
							>
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4 4"></path>
								</svg>
								{sortOrder === 'asc' ? 'Ascending' : 'Descending'}
							</Button>

							<!-- Favorites Filter -->
							<Button
								color={showFavoritesOnly ? "warning" : "secondary"}
								size="sm"
								outline={!showFavoritesOnly}
								onclick={toggleFavoritesOnly}
							>
								<svg class="w-4 h-4" fill={showFavoritesOnly ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
								</svg>
								Favorites {favorites.size > 0 && `(${favorites.size})`}
							</Button>

							<!-- Clear Filters -->
							{#if searchQuery || showFavoritesOnly}
								<Button
									color="secondary"
									size="sm"
									outline={true}
									onclick={() => {
										searchQuery = '';
										showFavoritesOnly = false;
									}}
								>
									Clear Filters
								</Button>
							{/if}
						</div>
					</div>

					<!-- Category Tabs -->
					<div class="mb-6">
						<div class="flex overflow-x-auto space-x-2 pb-2">
							{#each menuData.categories as category}
								<button
									onclick={() => selectCategory(category.id)}
									class="flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors"
									class:selected={selectedCategory === category.id ? 'bg-cyan-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'}
								>
									<span class="text-lg">{category.icon}</span>
									<span class="text-sm font-medium">{category.name}</span>
								</button>
							{/each}
						</div>
					</div>

					<!-- Menu Items -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						{#each filteredItems as item}
							<MenuCard
								item={item}
								isFavorite={favorites.has(item.id)}
								onToggleFavorite={() => toggleFavorite(item.id)}
								onAddToCart={addToCart}
							/>
						{/each}
					</div>

					{#if filteredItems.length === 0}
						<div class="text-center py-12">
							<div class="text-6xl mb-4">🔍</div>
							<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No items found</h3>
							<p class="text-gray-600 dark:text-gray-400">
								{searchQuery ? 'Try adjusting your search terms' : 'No items available in this category'}
							</p>
						</div>
					{/if}
				</div>
			</PageTransition>
		</main>

		<!-- Footer Actions -->
		<footer class="bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-4">
			<div class="flex items-center justify-between">
				<div class="text-sm text-gray-600 dark:text-gray-400">
					{filteredItems.length} items available
				</div>
				<div class="flex items-center space-x-2">
					<Button color="secondary" size="sm" outline={true}>
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
						</svg>
						Call Staff
					</Button>
					<Button color="cyan" size="sm">
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
						</svg>
						View Cart
					</Button>
				</div>
			</div>
		</footer>

		<!-- Cart Sidebar -->
	{#if showCart}
			<div class="fixed inset-0 z-50 overflow-hidden">
				<!-- Backdrop -->
				<div class="absolute inset-0 bg-black bg-opacity-50" onclick={() => showCart = false}></div>

				<!-- Cart Panel -->
				<div class="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl">
					<div class="flex flex-col h-full">
						<!-- Cart Header -->
						<div class="flex items-center justify-between p-4 border-b dark:border-gray-700">
							<h2 class="text-xl font-semibold text-gray-900 dark:text-white">Your Order</h2>
							<Button color="secondary" size="sm" onclick={() => showCart = false}>
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
								</svg>
							</Button>
						</div>

						<!-- Cart Items -->
						<div class="flex-1 overflow-y-auto p-4">
							{#if cart.length === 0}
								<div class="text-center py-8">
									<div class="text-6xl mb-4">🛒</div>
									<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Your cart is empty</h3>
									<p class="text-gray-600 dark:text-gray-400">Add some delicious items to get started!</p>
								</div>
							{:else}
								<div class="space-y-4">
									{#each cart as cartItem}
										<div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
											<div class="flex items-start justify-between">
												<div class="flex-1">
													<h4 class="font-medium text-gray-900 dark:text-white">{cartItem.name}</h4>
													<p class="text-sm text-gray-600 dark:text-gray-400">{formatPrice(cartItem.price)} each</p>
												<div class="flex items-center space-x-2 mt-2">
													<Button
														color="secondary"
														size="sm"
														outline={true}
														onclick={() => updateCartQuantity(cartItem.id, cartItem.quantity - 1)}
														disabled={cartItem.quantity <= 1}
													>
														<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
														</svg>
													</Button>
													<span class="text-lg font-medium text-gray-900 dark:text-white w-8 text-center">{cartItem.quantity}</span>
													<Button
														color="secondary"
														size="sm"
														outline={true}
														onclick={() => updateCartQuantity(cartItem.id, cartItem.quantity + 1)}
													>
														<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
														</svg>
													</Button>
												</div>
											</div>
											<div class="text-right mt-2">
												<p class="font-bold text-cyan-600 dark:text-cyan-400">{formatPrice(cartItem.price * cartItem.quantity)}</p>
											</div>
											<Button
												color="danger"
												size="sm"
												outline={true}
												onclick={() => removeFromCart(cartItem.id)}
												class="mt-2"
											>
												<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m0 0V5a2 2 0 012-2h10a2 2 0 012 2v6a2 2 0 01-2 2h-2.28a1 1 0 01-.948-.684l-1.498-4.493a1 1 0 01.502-.1l9.749 4.735z"></path>
												</svg>
												Remove
											</Button>
										</div>
									{/each}
								</div>
							{/if}
						</div>

						<!-- Cart Footer -->
						<div class="border-t dark:border-gray-700 p-4 space-y-4">
							{#if cart.length > 0}
								<div class="flex items-center justify-between">
									<span class="text-lg font-medium text-gray-900 dark:text-white">Total:</span>
									<span class="text-xl font-bold text-cyan-600 dark:text-cyan-400">{formatPrice(cartTotal)}</span>
								</div>

								<div class="flex space-x-2">
									<Button color="secondary" class="flex-1" outline={true} onclick={clearCart}>
										Clear Cart
									</Button>
									<Button color="cyan" class="flex-1">
										Proceed to Checkout
									</Button>
								</div>
							{/if}

							<div class="text-center text-sm text-gray-500 dark:text-gray-400">
								<p>Table {menuData.tableInfo?.name}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
{/if}

<style>
	/* Custom styles */
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}

	/* Cart animation */
	.cart-enter {
		animation: slideIn 0.3s ease-out;
	}

	@keyframes slideIn {
		from {
			transform: translateX(100%);
		}
		to {
			transform: translateX(0);
		}
	}
</style>