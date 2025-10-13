<script lang="ts">
	export let cssClass: string = '';
	export let width: string = 'w-full';
	export let height: string = 'h-4';
	export let variant: 'default' | 'text' | 'circular' | 'rounded' = 'default';

	$: baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700';
	$: variantClasses = variant === 'circular' ? 'rounded-full' : variant === 'rounded' ? 'rounded-lg' : 'rounded';
	$: combinedClasses = `${baseClasses} ${variantClasses} ${width} ${height} ${cssClass}`;
</script>

<div class={combinedClasses}></div>