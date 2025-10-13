<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import directusAuth from '$lib/server/auth';

	onMount(async () => {
		// Check if user is already authenticated
		try {
			const user = await directusAuth.initAuth();
			if (user) {
				// User is already logged in, redirect to hub or intended page
				const redirectTo = $page.url.searchParams.get('redirect') || '/hub';
				goto(redirectTo, { replaceState: true });
			}
		} catch (error) {
			console.error('Auth check failed:', error);
		}
	});
</script>

<div class="min-h-screen">
	<slot />
</div>