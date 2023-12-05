<script lang="ts">
	import Check from './Icon/Check.svelte';
	import GripDotsVertical from './Icon/GripDotsVertical.svelte';
	import Pen from './Icon/Pen.svelte';
	import Plus from './Icon/Plus.svelte';
	import Times from './Icon/Times.svelte';
	import TrashCan from './Icon/TrashCan.svelte';

	export let icon: 'check' | 'grip-dots-vertical' | 'pen' | 'plus' | 'times' | 'trash-can';
	export let size: 'small' | 'medium' | 'large' = 'small';

	const iconComponents = {
		check: Check,
		'grip-dots-vertical': GripDotsVertical,
		pen: Pen,
		plus: Plus,
		times: Times,
		'trash-can': TrashCan,
	};

	const sizeInNumbers = {
		small: '16px',
		medium: '24px',
		large: '40px',
	};
</script>

<svelte:component this={iconComponents[icon]} size={sizeInNumbers[size]} {...$$restProps} />

<style lang="scss">
	:global(.icon) {
		display: block;
	}
</style>
