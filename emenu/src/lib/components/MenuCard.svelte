<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Card from '$lib/components/flowbite/Card.svelte';
	import Badge from '$lib/components/flowbite/Badge.svelte';
	import Button from '$lib/components/flowbite/Button.svelte';

	export let item: any;
	export let showFavorite = true;
	export let isFavorite = false;
	export let compact = false;

	// Event dispatcher
	const dispatcher = createEventDispatcher();

	function toggleFavorite() {
		dispatcher('toggleFavorite', { itemId: item.id });
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

	function getImageUrl(image: string): string {
		// In a real implementation, this would handle image URLs properly
		// For now, return a placeholder
		return image || '/images/menu-placeholder.jpg';
	}
</script>

<Card hover={true} class="overflow-hidden {compact ? '' : 'h-full'}">
	<div class="relative {compact ? 'flex' : ''}">
		{#if !compact}
			<!-- Item Image -->
			<div class="h-48 bg-gray-200 dark:bg-gray-700 relative">
				<div class="w-full h-full flex items-center justify-center">
					{#if item.image}
						<img
							src={getImageUrl(item.image)}
							alt={item.name}
							class="w-full h-full object-cover"
							onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
						/>
						<div class="w-full h-full flex items-center justify-center" style="display: none;">
							<span class="text-6xl">🍽️</span>
						</div>
					{:else}
						<span class="text-6xl">🍽️</span>
					{/if}
				</div>

				<!-- Favorite Button -->
				{#if showFavorite}
					<button
						onclick={toggleFavorite}
						class="absolute top-3 right-3 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 transition-transform"
					>
						<svg class="w-4 h-4 {isFavorite ? 'text-red-500' : 'text-gray-400'}" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
						</svg>
					</button>
				{/if}

				<!-- Availability Badge -->
				{#if !item.available}
					<div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
						<Badge color="danger" size="sm">Unavailable</Badge>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Item Details -->
		<div class="p-4 {compact ? 'flex-1 flex items-center justify-between' : ''}">
			<div class="{compact ? 'flex-1' : ''}">
				<h3 class="font-semibold text-gray-900 dark:text-white {compact ? 'text-sm' : ''}">{item.name}</h3>
				{#if !compact}
					<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.description}</p>
				{/if}
			</div>

			{#if compact}
				<div class="text-right ml-4">
					<p class="font-bold text-cyan-600 dark:text-cyan-400 text-sm">{formatPrice(item.price)}</p>
					<p class="text-xs text-gray-500 dark:text-gray-400">{item.prepTime}</p>
				</div>
			{:else}
				<div class="flex items-start justify-between mt-3">
					<div class="flex-1">
						<div class="flex items-center space-x-2">
							<p class="font-bold text-cyan-600 dark:text-cyan-400">{formatPrice(item.price)}</p>
							<span class="text-sm text-gray-500 dark:text-gray-400">• {item.prepTime}</span>
						</div>
					</div>
				</div>

				<!-- Tags and Attributes -->
				<div class="flex flex-wrap gap-1 mt-3">
					{#each item.tags as tag}
						<Badge color="secondary" size="xs">{tag}</Badge>
					{/each}
					<Badge color={getSpiceLevelColor(item.spiceLevel)} size="xs">
						{getSpiceLevelText(item.spiceLevel)}
					</Badge>
				</div>
			{/if}
		</div>
	</div>
</Card>

<style>
	/* Ensure aspect ratio for images */
	img {
		aspect-ratio: 16/9;
		object-fit: cover;
	}
</style>