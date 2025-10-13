<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Dropdown as DropdownType } from 'flowbite-svelte';
	import { Dropdown } from 'flowbite-svelte';

	// Enhanced dropdown props with SOL theming
	export let text: string = '';
	export let placement: 'bottom' | 'top' | 'left' | 'right' = 'bottom';
	export let inline = false;
	export let class: string = '';

	const dispatch = createEventDispatcher();

	function handleSelect(event: CustomEvent) {
		dispatch('select', event.detail);
	}
</script>

<Dropdown
	{text}
	{placement}
	{inline}
	class="transition-all duration-200 {class}"
	on:select={handleSelect}
	{...$$restProps}
>
	<slot />
</Dropdown>