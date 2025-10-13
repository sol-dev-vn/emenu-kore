<script lang="ts">
	import Skeleton from './Skeleton.svelte';

	export let rows = 5;
	export let columns = 4;
	export let showHeader = true;
	export let class: string = '';
</script>

<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden {class}">
	{#if showHeader}
		<div class="border-b dark:border-gray-700 p-4">
			<div class="grid grid-cols-{columns} gap-4">
				{#each Array(columns) as _}
					<Skeleton height="h-4" />
				{/each}
			</div>
		</div>
	{/if}

	<div class="divide-y dark:divide-gray-700">
		{#each Array(rows) as _, rowIndex}
			<div class="p-4">
				<div class="grid grid-cols-{columns} gap-4">
					{#each Array(columns) as _, colIndex}
						<Skeleton
							width={colIndex === 0 ? 'w-16' : colIndex === columns - 1 ? 'w-20' : 'w-full'}
							height="h-4"
						/>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>