<script lang="ts">
	export let data;
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	const { table, branch, brand, session, menuItems, sessionToken, error } = data;

	let categories: Array<any> = [];
	let selectedCategory: string | null = null;
	let cart: Array<any> = [];
	let cartVisible = false;
	let loading = false;

	onMount(() => {
		// Group menu items by category
		const categoryMap = new Map();
		menuItems.forEach(item => {
			if (item.category) {
				const categoryId = item.category.id;
				if (!categoryMap.has(categoryId)) {
					categoryMap.set(categoryId, {
						...item.category,
						items: []
					});
				}
				categoryMap.get(categoryId).items.push(item);
			}
		});

		categories = Array.from(categoryMap.values()).sort((a, b) => a.sort - b.sort);
		if (categories.length > 0) {
			selectedCategory = categories[0].id;
		}

		// Set up session heartbeat
		const heartbeat = setInterval(async () => {
			try {
				await fetch('/api/session/heartbeat', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${sessionToken}`
					},
					body: JSON.stringify({ sessionId: session.id })
				});
			} catch (err) {
				console.error('Session heartbeat failed:', err);
			}
		}, 60000); // Every minute

		return () => clearInterval(heartbeat);
	});

	function addToCart(item: any) {
		const existingItem = cart.find(cartItem => cartItem.id === item.id);
		if (existingItem) {
			existingItem.quantity++;
		} else {
			cart.push({ ...item, quantity: 1 });
		}
	}

	function removeFromCart(item: any) {
		const index = cart.findIndex(cartItem => cartItem.id === item.id);
		if (index > -1) {
			cart[index].quantity--;
			if (cart[index].quantity <= 0) {
				cart.splice(index, 1);
			}
		}
	}

	function getCartTotal() {
		return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
	}

	function getCartCount() {
		return cart.reduce((total, item) => total + item.quantity, 0);
	}

	async function submitOrder() {
		if (cart.length === 0) return;

		loading = true;
		try {
			const orderData = {
				table: table.id,
				session_token: sessionToken,
				items: cart.map(item => ({
					menu_item: item.id,
					quantity: item.quantity,
					price: item.price
				})),
				total_amount: getCartTotal(),
				status: 'pending'
			};

			const response = await fetch('/api/orders', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${sessionToken}`
				},
				body: JSON.stringify(orderData)
			});

			if (response.ok) {
				cart = [];
				cartVisible = false;
				// Show success message
				alert('Order placed successfully!');
			} else {
				throw new Error('Failed to place order');
			}
		} catch (err) {
			console.error('Order submission error:', err);
			alert('Failed to place order. Please try again.');
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Table {table.name} - {brand?.name || 'SOL Restaurant'}</title>
	<meta name="description" content="Order from table {table.name} at {branch?.name}" />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
</svelte:head>

{#if error}
	<div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
		<div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
			<div class="text-red-500 text-6xl mb-4">⚠️</div>
			<h1 class="text-2xl font-bold text-gray-900 mb-2">Table Unavailable</h1>
			<p class="text-gray-600 mb-6">{error}</p>
			<a href="/" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
				<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
				</svg>
				Back to Home
			</a>
		</div>
	</div>
{:else}
	<div class="min-h-screen bg-gray-50">
		<!-- Header -->
		<header class="bg-white shadow-sm border-b sticky top-0 z-40">
			<div class="px-4 py-3">
				<div class="flex items-center justify-between">
					<div class="flex items-center space-x-3">
						{#if brand?.logo}
							<img src="{brand.logo}" alt="{brand.name}" class="h-8 w-auto" />
						{:else}
							<div class="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
								{brand?.name?.charAt(0) || 'S'}
							</div>
						{/if}
						<div>
							<h1 class="font-semibold text-gray-900">{brand?.name || 'SOL Restaurant'}</h1>
							<p class="text-sm text-gray-600">Table {table.name} • {branch?.name}</p>
						</div>
					</div>
					<button
						on:click={() => cartVisible = !cartVisible}
						class="relative p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
						</svg>
						{#if getCartCount() > 0}
							<span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
								{getCartCount()}
							</span>
						{/if}
					</button>
				</div>
			</div>
		</header>

		<div class="flex h-[calc(100vh-64px)]">
			<!-- Categories Sidebar -->
			<aside class="w-64 bg-white border-r overflow-y-auto">
				<div class="p-4">
					<h2 class="font-semibold text-gray-900 mb-4">Categories</h2>
					<nav class="space-y-2">
						{#each categories as category}
							<button
								on:click={() => selectedCategory = category.id}
								class="w-full text-left px-3 py-2 rounded-lg transition-colors {selectedCategory === category.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}"
							>
								{category.name}
							</button>
						{/each}
					</nav>
				</div>
			</aside>

			<!-- Menu Items -->
			<main class="flex-1 overflow-y-auto">
				<div class="p-4">
					{#each categories as category}
						{#if selectedCategory === category.id}
							<div class="space-y-6">
								<div>
									<h2 class="text-2xl font-bold text-gray-900 mb-2">{category.name}</h2>
									{#if category.description}
										<p class="text-gray-600">{category.description}</p>
									{/if}
								</div>

								<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									{#each category.items as item}
										<div class="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
											{#if item.thumbnail}
												<img src="{item.thumbnail}" alt="{item.name}" class="w-full h-48 object-cover rounded-t-lg" />
											{:else}
												<div class="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
													<svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
													</svg>
												</div>
											{/if}
											<div class="p-4">
												<h3 class="font-semibold text-gray-900 mb-1">{item.name}</h3>
												{#if item.description}
													<p class="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
												{/if}
												<div class="flex items-center justify-between">
													<span class="text-lg font-bold text-blue-600">{item.price.toLocaleString()}₫</span>
													<button
														on:click={() => addToCart(item)}
														class="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
													>
														Add to Cart
													</button>
												</div>
											</div>
										</div>
									{/each}
								</div>
							</div>
						{/if}
					{/each}
				</div>
			</main>
		</div>

		<!-- Cart Sidebar -->
		{#if cartVisible}
			<div class="fixed inset-0 bg-black bg-opacity-50 z-50" on:click={() => cartVisible = false}>
				<div class="absolute right-0 top-0 h-full w-96 bg-white shadow-xl" on:click|stopPropagation>
					<div class="flex items-center justify-between p-4 border-b">
						<h2 class="text-xl font-semibold">Your Cart</h2>
						<button
							on:click={() => cartVisible = false}
							class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
							</svg>
						</button>
					</div>

					<div class="flex-1 overflow-y-auto p-4">
						{#if cart.length === 0}
							<div class="text-center py-8">
								<svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
								</svg>
								<p class="text-gray-600">Your cart is empty</p>
							</div>
						{:else}
							<div class="space-y-4">
								{#each cart as item}
									<div class="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
										<div class="flex-1">
											<h4 class="font-medium text-gray-900">{item.name}</h4>
											<p class="text-sm text-gray-600">{item.price.toLocaleString()}₫ each</p>
										</div>
										<div class="flex items-center space-x-2">
											<button
												on:click={() => removeFromCart(item)}
												class="p-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
											>
												<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
												</svg>
											</button>
											<span class="w-8 text-center font-medium">{item.quantity}</span>
											<button
												on:click={() => addToCart(item)}
												class="p-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
											>
												<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
												</svg>
											</button>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>

					{#if cart.length > 0}
						<div class="border-t p-4">
							<div class="flex items-center justify-between mb-4">
								<span class="text-lg font-semibold">Total:</span>
								<span class="text-xl font-bold text-blue-600">{getCartTotal().toLocaleString()}₫</span>
							</div>
							<button
								on:click={submitOrder}
								disabled={loading}
								class="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
							>
								{#if loading}
									Placing Order...
								{:else}
									Place Order
								{/if}
							</button>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
{/if}