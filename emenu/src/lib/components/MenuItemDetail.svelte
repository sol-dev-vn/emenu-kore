<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Card from '$lib/components/flowbite/Card.svelte';
	import Badge from '$lib/components/flowbite/Badge.svelte';
	import Button from '$lib/components/flowbite/Button.svelte';

	export let item: any;
	export let onAddToCart: ((item: any, quantity: number) => void) | null = null;
	export let onToggleFavorite: ((item: any) => void) | null = null;
	export let isFavorite = false;
	export let showAddToCart = true;

	// Event dispatcher
	const dispatcher = createEventDispatcher();

	let quantity = 1;
	let selectedOptions = {};
	let specialInstructions = '';

	// Reactive statements
	$: totalPrice = item.price * quantity;

	function incrementQuantity() {
		if (quantity < 99) quantity++;
	}

	function decrementQuantity() {
		if (quantity > 1) quantity--;
	}

	function handleAddToCart() {
		if (onAddToCart) {
			onAddToCart(item, quantity);
		}
		dispatcher('addToCart', { item, quantity, options: selectedOptions, instructions: specialInstructions });
	}

	function handleToggleFavorite() {
		if (onToggleFavorite) {
			onToggleFavorite(item);
		}
		dispatcher('toggleFavorite', { item });
	}

	function formatPrice(price: number): string {
		return new Intl.NumberFormat('vi-VN').format(price) + '₫';
	}

	function getSpiceLevelColor(level: number): string {
		switch (level) {
			case 0: return 'secondary';
			case 1: return 'success';
			case 2: return 'warning';
			case 3: return 'danger';
			default: return 'secondary';
		}
	}

	function getSpiceLevelText(level: number): string {
		switch (level) {
			case 0: return 'Mild';
			case 1: return 'Medium';
			case 2: return 'Spicy';
			case 3: return 'Very Spicy';
			default: return 'Mild';
		}
	}

	function getNutritionalInfo(info: any): string[] {
		const infos = [];
		if (info.calories) infos.push(`${info.calories} cal`);
		if (info.protein) infos.push(`${info.protein}g protein`);
		if (info.carbs) infos.push(`${info.carbs}g carbs`);
		if (info.fat) infos.push(`${info.fat}g fat`);
		return infos;
	}

	function getDietaryInfo(info: any): string[] {
		const infos = [];
		if (info.vegetarian) infos.push('Vegetarian');
		if (info.vegan) infos.push('Vegan');
		if (info.glutenFree) infos.push('Gluten-Free');
		if (info.dairyFree) infos.push('Dairy-Free');
		if (info.nutFree) infos.push('Nut-Free');
		return infos;
	}

	function getImageUrl(image: string): string {
		return image || '/images/menu-placeholder.jpg';
	}
</script>

<!-- Menu Item Detail Modal/Card -->
<div class="max-w-4xl mx-auto">
	<!-- Header Section -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
		<!-- Image Section -->
		<div class="space-y-4">
			<div class="relative bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
				<div class="aspect-w-16 aspect-h-12">
					{#if item.image}
						<img
							src={getImageUrl(item.image)}
							alt={item.name}
							class="w-full h-full object-cover"
							onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
						/>
						<div class="w-full h-full flex items-center justify-center" style="display: none;">
							<span class="text-8xl">🍽️</span>
						</div>
					{:else}
						<div class="w-full h-full flex items-center justify-center">
							<span class="text-8xl">🍽️</span>
						</div>
					{/if}
				</div>

				<!-- Availability Badge -->
				{#if !item.available}
					<div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
						<Badge color="danger" size="lg">Currently Unavailable</Badge>
					</div>
				{/if}
			</div>

			<!-- Action Buttons -->
			<div class="flex space-x-2">
				{#if onToggleFavorite}
					<Button
						color="secondary"
						class="flex-1"
						outline={true}
						onclick={handleToggleFavorite}
					>
						<svg class="w-4 h-4 mr-2" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
						</svg>
						{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
					</Button>
				{/if}

				<Button color="secondary" class="flex-1" outline={true}>
					<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 2.943-9.543 7a9.97 9.97 0 011.827 3.342M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
					</svg>
					Share
				</Button>
			</div>
		</div>

		<!-- Details Section -->
		<div class="space-y-6">
			<!-- Title and Price -->
			<div>
				<div class="flex items-start justify-between mb-4">
					<div>
						<h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{item.name}</h1>
						<p class="text-lg text-gray-600 dark:text-gray-400">{item.description}</p>
					</div>
					<div class="text-right">
						<p class="text-3xl font-bold text-cyan-600 dark:text-cyan-400">{formatPrice(item.price)}</p>
						<p class="text-sm text-gray-500 dark:text-gray-400">{item.prepTime}</p>
					</div>
				</div>

				<!-- Tags and Attributes -->
				<div class="flex flex-wrap gap-2 mb-4">
					{#each item.tags as tag}
						<Badge color="secondary">{tag}</Badge>
					{/each}
					<Badge color={getSpiceLevelColor(item.spiceLevel)}>
						{getSpiceLevelText(item.spiceLevel)}
					</Badge>
				</div>

				<!-- Dietary Information -->
				{#if item.dietary}
					<div class="flex flex-wrap gap-2">
						{#each getDietaryInfo(item.dietary) as info}
							<Badge color="success" size="sm">{info}</Badge>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Quantity and Add to Cart -->
			{#if showAddToCart && item.available}
				<Card class="p-6">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order This Item</h3>

					<!-- Quantity Selector -->
					<div class="mb-4">
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quantity</label>
						<div class="flex items-center space-x-3">
							<Button
								color="secondary"
								size="sm"
								outline={true}
								onclick={decrementQuantity}
								disabled={quantity <= 1}
							>
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
								</svg>
							</Button>
							<span class="text-xl font-semibold text-gray-900 dark:text-white w-12 text-center">{quantity}</span>
							<Button
								color="secondary"
								size="sm"
								outline={true}
								onclick={incrementQuantity}
								disabled={quantity >= 99}
							>
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
								</svg>
							</Button>
						</div>
					</div>

					<!-- Special Instructions -->
					<div class="mb-4">
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Special Instructions</label>
						<textarea
							bind:value={specialInstructions}
							placeholder="Any special requests or dietary restrictions..."
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
							rows="3"
						></textarea>
					</div>

					<!-- Total Price -->
					<div class="flex items-center justify-between mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
						<span class="text-lg font-medium text-gray-900 dark:text-white">Total:</span>
						<span class="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{formatPrice(totalPrice)}</span>
					</div>

					<!-- Add to Cart Button -->
					<Button color="cyan" class="w-full" size="lg" onclick={handleAddToCart}>
						<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
						</svg>
						Add to Cart
					</Button>
				</Card>
			{/if}

			<!-- Nutritional Information -->
			{#if item.nutritional}
				<Card class="p-6">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Nutritional Information</h3>
					<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
						{#each getNutritionalInfo(item.nutritional) as info}
							<div class="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
								<p class="text-lg font-semibold text-gray-900 dark:text-white">{info}</p>
							</div>
						{/each}
					</div>
					{#if item.nutritional.allergens}
						<div class="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
							<p class="text-sm text-yellow-800 dark:text-yellow-200">
								<strong>Allergens:</strong> {item.nutritional.allergens.join(', ')}
							</p>
						</div>
					{/if}
				</Card>
			{/if}

			<!-- Ingredients -->
			{#if item.ingredients}
				<Card class="p-6">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ingredients</h3>
					<div class="flex flex-wrap gap-2">
						{#each item.ingredients as ingredient}
							<Badge color="secondary" size="sm">{ingredient}</Badge>
						{/each}
					</div>
				</Card>
			{/if}
		</div>
	</div>

	<!-- Additional Information -->
	{#if item.chefsNote || item.pairing}
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			{#if item.chefsNote}
				<Card class="p-6">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Chef's Note</h3>
					<p class="text-gray-600 dark:text-gray-400 italic">{item.chefsNote}</p>
				</Card>
			{/if}

			{#if item.pairing}
				<Card class="p-6">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Recommended Pairing</h3>
					<p class="text-gray-600 dark:text-gray-400">{item.pairing}</p>
				</Card>
			{/if}
		</div>
	{/if}
</div>

<style>
	/* Custom aspect ratio */
	.aspect-w-16 {
		position: relative;
		padding-bottom: calc(9 / 16 * 100%);
	}

	.aspect-h-12 {
		position: absolute;
		height: 100%;
		width: 100%;
		top: 0;
		left: 0;
	}
</style>