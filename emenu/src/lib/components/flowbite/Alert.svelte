<script lang="ts">
	import { Alert as AlertType } from 'flowbite-svelte';
	import { Alert } from 'flowbite-svelte';

	// Enhanced alert props with SOL theming
	export let color: 'cyan' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' = 'cyan';
	export let dismissible = false;
	export let class: string = '';
	let showing = true;

	function handleDismiss() {
		showing = false;
	}

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

{#if showing}
	<Alert
		color={flowbiteColor}
		dismissible={dismissible}
		on:dismiss={handleDismiss}
		class="transition-all duration-300 {class}"
		{...$$restProps}
	>
		<slot />
	</Alert>
{/if}