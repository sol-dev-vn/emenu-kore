<script lang="ts">
	import { Badge as BadgeType } from 'flowbite-svelte';
	import { Badge } from 'flowbite-svelte';

	// Enhanced badge props with SOL theming
	export let color: 'cyan' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' = 'cyan';
	export let size: 'xs' | 'sm' = 'sm';
	export let class: string = '';

	$: colorMapping = {
		cyan: 'cyan',
		primary: 'blue',
		secondary: 'gray',
		success: 'green',
		danger: 'red',
		warning: 'yellow',
		info: 'info',
		light: 'light',
		dark: 'dark'
	};

	$: flowbiteColor = colorMapping[color] || color;
</script>

<Badge
	color={flowbiteColor}
	{size}
	class="transition-all duration-200 {class}"
	{...$$restProps}
>
	<slot />
</Badge>