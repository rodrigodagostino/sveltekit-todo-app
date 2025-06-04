<script lang="ts">
	import { fade, fly } from 'svelte/transition';

	import { t } from '$lib/translations/index.js';
</script>

<div
	class="no-lists-message"
	in:fly={{ y: 32, duration: 320, delay: 320 }}
	out:fade={{ duration: 320 }}
>
	<svg class="no-lists-message__arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
		<path
			d="M250.394 253.6C213.018 120.819 131.613 55.589 31.6 20.383c3.23 3.753 6.651 7.459 9.122 11.83 2.851 4.989-4.276 11.023-8.315 6.414C23.57 28.412 14.353 19.385 3.092 11.878-3.037 7.744.669-1.236 7.891.142c15.536 2.899 31.453 2.566 47.085.38 9.407-1.33 11.26 12.069 1.568 13.066-5.037.475-19.861-1.33-15.204.523 104.479 41.811 179.676 79.792 214.518 237.811.61 2.767-.848 4.061-2.436 4.078-1.235.013-2.548-.697-3.028-2.4Z"
			fill="currentColor"
		/>
	</svg>
	<h2 class="no-lists-message__text">
		{$t('home.noListsMessage')}
	</h2>
</div>

<style lang="scss">
	@font-face {
		font-display: swap;
		font-family: 'Gloria Hallelujah';
		font-style: normal;
		font-weight: 400;
		src:
			url('/fonts/gloria-hallelujah-v17-latin-400.woff2') format('woff2'),
			url('/fonts/gloria-hallelujah-v17-latin-400.woff') format('woff');
	}

	.no-lists-message {
		grid-column: 1;
		grid-row: 3;
		text-align: center;
	}

	.no-lists-message__arrow {
		width: 8rem;
		height: auto;
		margin-top: 1rem;
		margin-bottom: 2.5rem;
		transform: rotate(45deg);

		path {
			fill: var(--indigo-900);
		}
	}

	.no-lists-message__text {
		font-family: 'Gloria Hallelujah';
		font-size: 2rem;
		line-height: 1.4;
		color: var(--indigo-900);
	}

	@media screen and (min-width: 48em) {
		.no-lists-message {
			grid-column: 2;
			grid-row: 2;
			text-align: left;
		}

		.no-lists-message__arrow {
			width: 10rem;
			margin-top: 2.5rem;
			margin-bottom: 1rem;
			transform: none;
		}
	}

	@media screen and (min-width: 61.25em) {
		.no-lists-message__arrow {
			width: 12rem;
		}

		.no-lists-message__text {
			font-size: 2.5rem;
		}
	}
</style>
