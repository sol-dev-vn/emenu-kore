<script lang="ts">
	import type { Button as ButtonType } from 'flowbite-svelte';
	import { Button } from 'flowbite-svelte';

	// Enhanced button props with SOL theming
	export let color: 'cyan' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' = 'cyan';
	export let size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
	export let outline = false;
	export let disabled = false;
	export let loading = false;
	export let pill = false;
	export let class: string = '';

	$: colorMapping = {
		cyan: outline ? 'cyan' : 'cyan',
		primary: outline ? 'blue' : 'blue',
		secondary: outline ? 'gray' : 'gray',
		success: outline ? 'green' : 'green',
		danger: outline ? 'red' : 'red',
		warning: outline ? 'yellow' : 'yellow',
		info: outline ? 'info' : 'info',
		light: outline ? 'light' : 'light',
		dark: outline ? 'dark' : 'dark'
	};

	$: flowbiteColor = colorMapping[color] || color;
</script>

<Button
	{color}
	color={flowbiteColor}
	{size}
	{outline}
	{disabled}
	{pill}
	class="transition-all duration-200 hover:scale-105 active:scale-95 {class}"
	{...$$restProps}
>
	{#if loading}
		<svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
			<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
		</svg>
	{/if}
	<slot />
</Button>