<script lang="ts">
	import Skeleton from './Skeleton.svelte';

	export let showHeader = true;
	export let showAvatar = false;
	export let lines = 3;
	export let class: string = '';
</script>

<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6 {class}">
	{#if showHeader}
		<div class="flex items-center space-x-4 mb-4">
			{#if showAvatar}
				<Skeleton width="w-12" height="h-12" variant="circular" />
			{/if}
			<div class="flex-1">
				<Skeleton width="w-32" height="h-6" class="mb-2" />
				<Skeleton width="w-24" height="h-4" />
			</div>
		</div>
	{/if}

	<div class="space-y-3">
		{#each Array(lines) as _, i}
			<Skeleton width={i === lines - 1 ? 'w-3/4' : 'w-full'} height="h-4" />
		{/each}
	</div>
</div>