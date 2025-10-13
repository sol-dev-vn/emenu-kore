<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';

	// Create and export theme store for global access
	export const theme: Writable<'light' | 'dark' | 'system'> = writable('system');

	// Set the theme context for child components
	setContext('theme', theme);

	let mounted = false;
	let systemTheme: 'light' | 'dark' = 'light';

	$: isDark = ($theme === 'dark' || ($theme === 'system' && systemTheme === 'dark'));

	onMount(() => {
		mounted = true;

		// Check system preference
		if (typeof window !== 'undefined') {
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

			return () => {
				mediaQuery.removeEventListener('change', handleChange);
			};
		}
	});

	// Apply theme to document
	$: if (mounted && typeof document !== 'undefined') {
		if (isDark) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}

	// Save theme to localStorage when it changes
	if (typeof window !== 'undefined') {
		theme.subscribe(value => {
			if (mounted) {
				localStorage.setItem('theme', value);
			}
		});
	}

	export function setTheme(newTheme: 'light' | 'dark' | 'system') {
		theme.set(newTheme);
	}

	export function toggleTheme() {
		theme.update(current => {
			if (current === 'light') return 'dark';
			if (current === 'dark') return 'system';
			return 'light';
		});
	}
</script>

<slot />