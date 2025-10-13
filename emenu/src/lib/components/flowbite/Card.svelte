<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	// Enhanced card props with SOL theming
	export let href: string | undefined = undefined;
	export let img: string | undefined = undefined;
	export let imgAlt: string = '';
	export let horizontal = false;
	export let noPadding = false;
	export let interactive = false;
	export let cssClass: string = '';

	const dispatcher = createEventDispatcher();

	$: cardClass = `
		bg-white dark:bg-gray-800
		border border-gray-200 dark:border-gray-700
		shadow-sm hover:shadow-md
		transition-all duration-200
		${interactive ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''}
		${noPadding ? '' : 'p-6'}
		rounded-lg
		${cssClass}
	`;

	function handleClick() {
		if (interactive) {
			dispatcher('click');
		}
	}
</script>

{#if href && !interactive}
	<a href={href} class={cardClass} {...$$restProps}>
		{#if img}
			<img
				src={img}
				alt={imgAlt}
				class="{horizontal ? 'h-full w-48 object-cover rounded-l-lg' : 'w-full h-48 object-cover rounded-t-lg'}"
			/>
		{/if}
		<div class={horizontal && img ? 'flex-1' : ''}>
			<slot />
		</div>
	</a>
{:else if interactive}
	<button type="button" class={cardClass} onclick={handleClick} {...$$restProps}>
		{#if img}
			<img
				src={img}
				alt={imgAlt}
				class="{horizontal ? 'h-full w-48 object-cover rounded-l-lg' : 'w-full h-48 object-cover rounded-t-lg'}"
			/>
		{/if}
		<div class={horizontal && img ? 'flex-1' : ''}>
			<slot />
		</div>
	</button>
{:else}
	<div class={cardClass} {...$$restProps}>
		{#if img}
			<img
				src={img}
				alt={imgAlt}
				class="{horizontal ? 'h-full w-48 object-cover rounded-l-lg' : 'w-full h-48 object-cover rounded-t-lg'}"
			/>
		{/if}
		<div class={horizontal && img ? 'flex-1' : ''}>
			<slot />
		</div>
	</div>
{/if}