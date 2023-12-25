<script>
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import { t } from '$lib/translations';
</script>

<section class="error">
	<h2 class="error__status">
		<em>{$page.status}</em><br /><span>{$t('error.notFoundStatus')}</span>
	</h2>
	{#if $page.status === 404}
		<p class="error__message">{$t('error.notFoundMessage')}</p>
		<Button href="/" variant="ghost-negative">{$t('error.returnHome')}</Button>
	{:else}
		<p class="error__message">{$page.error?.message}</p>
	{/if}
</section>

<style lang="scss">
	.error {
		grid-column: 1/-1;
		justify-self: center;
		max-width: 40rem;
		padding-block: 4rem;
		text-align: center;

		&__status {
			line-height: 1.2;

			em {
				font-size: 4rem;
				font-style: normal;
			}
		}

		&__message {
			margin-top: 2rem;
		}

		:global(.button) {
			margin-top: 1rem;
		}
	}
</style>
