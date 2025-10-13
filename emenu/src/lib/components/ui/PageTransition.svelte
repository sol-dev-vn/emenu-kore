<script lang="ts">
	import { onMount } from 'svelte';

	export let show = true;
	export let duration = 300;
	export let blur = false;
	export let scale = false;
	export let direction: 'up' | 'down' | 'left' | 'right' | 'none' = 'up';

	let element: HTMLElement;
	let isAnimating = false;

	onMount(() => {
		if (element) {
			// Initial setup
			if (!show) {
				setInitialHiddenState();
			}
		}
	});

	function setInitialHiddenState() {
		if (!element) return;

		const transforms = getTransforms(false);
		element.style.opacity = '0';
		element.style.transform = transforms;
		element.style.transition = `all ${duration}ms ease-out`;
	}

	function getTransforms(visible: boolean) {
		const transforms = [];

		if (!visible) {
			if (direction === 'up') transforms.push('translateY(20px)');
			else if (direction === 'down') transforms.push('translateY(-20px)');
			else if (direction === 'left') transforms.push('translateX(20px)');
			else if (direction === 'right') transforms.push('translateX(-20px)');

			if (blur) transforms.push('blur(4px)');
			if (scale) transforms.push('scale(0.95)');
		}

		return transforms.join(' ');
	}

	$: if (element && !isAnimating) {
		isAnimating = true;

		const transforms = getTransforms(show);
		element.style.opacity = show ? '1' : '0';
		element.style.transform = transforms;

		setTimeout(() => {
			isAnimating = false;
		}, duration);
	}
</script>

<div bind:this={element} class="w-full h-full">
	<slot />
</div>