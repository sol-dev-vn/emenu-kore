<script lang="ts">
	export let loading = false;
	export let blur = true;
	export let showSpinner = true;
	export let spinnerSize = 'md';
	export let cssClass: string = '';
	export let contentClass: string = '';

	$: blurClass = blur && loading ? 'blur-sm opacity-75' : '';
	$: transitionClass = 'transition-all duration-300 ease-in-out';
	$: spinnerSizeClass = spinnerSize === 'sm' ? 'w-4 h-4' : spinnerSize === 'md' ? 'w-6 h-6' : spinnerSize === 'lg' ? 'w-8 h-8' : 'w-6 h-6';
</script>

<div class="relative {cssClass}">
	<div class="{transitionClass} {blurClass} {contentClass}">
		<slot />
	</div>

	{#if loading}
		<div class="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-50 rounded-lg">
			{#if showSpinner}
				<div class="flex flex-col items-center space-y-2">
					<div class="animate-spin">
						<svg class="{spinnerSizeClass} text-cyan-600" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
					</div>
					<slot name="loadingText">
						<p class="text-sm text-gray-600 dark:text-gray-400">Loading...</p>
					</slot>
				</div>
			{/if}
		</div>
	{/if}
</div>