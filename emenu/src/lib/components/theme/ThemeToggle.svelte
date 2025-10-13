<script lang="ts">
	import { onMount } from 'svelte';
	import { setContext, onCleanup } from 'svelte';
	import { writable, type Writable } from 'svelte/store';

	// Create a theme store
	export const theme: Writable<'light' | 'dark' | 'system'> = writable('system');

	// Create theme context
	setContext('theme', theme);

	let mounted = false;
	let systemTheme: 'light' | 'dark' = 'light';

	$: isDark = ($theme === 'dark' || ($theme === 'system' && systemTheme === 'dark'));

	onMount(() => {
		mounted = true;

		// Check system preference
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		systemTheme = mediaQuery.matches ? 'dark' : 'light';

		// Listen for system theme changes
		const handleChange = (e: MediaQueryListEvent) => {
			systemTheme = e.matches ? 'dark' : 'light';
		};

		mediaQuery.addEventListener('change', handleChange);

		// Load saved theme from localStorage
		const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
		if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
			theme.set(savedTheme);
		}

		onCleanup(() => {
			mediaQuery.removeEventListener('change', handleChange);
		});
	});

	// Apply theme to document
	$: if (mounted) {
		if (isDark) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}

	function toggleTheme() {
		theme.update(current => {
			if (current === 'light') return 'dark';
			if (current === 'dark') return 'system';
			return 'light';
		});
	}

	// Save theme to localStorage when it changes
	theme.subscribe(value => {
		if (mounted) {
			localStorage.setItem('theme', value);
		}
	});

	function getThemeIcon() {
		if ($theme === 'light') {
			return 'sun';
		} else if ($theme === 'dark') {
			return 'moon';
		}
		return 'monitor';
	}

	function getThemeLabel() {
		if ($theme === 'light') {
			return 'Light Mode';
		} else if ($theme === 'dark') {
			return 'Dark Mode';
		}
		return 'System Theme';
	}
</script>

<button
	type="button"
	on:click={toggleTheme}
	class="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
	title={getThemeLabel()}
>
	{#if getThemeIcon() === 'sun'}
		<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
		</svg>
	{:else if getThemeIcon() === 'moon'}
		<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
		</svg>
	{:else}
		<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
		</svg>
	{/if}
</button>