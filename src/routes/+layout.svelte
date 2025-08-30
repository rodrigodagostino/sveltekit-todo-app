<script lang="ts">
	import { enhance } from '$app/forms';
	import svelteLogo from '$lib/assets/images/svelte-logo.svg';
	import { Button, Notifications } from '$lib/components/index.js';
	import { t, locale, locales } from '$lib/translations/index.js';
	import './styles.css';
</script>

<svelte:head>
	<title>SvelteKit To-Do App</title>
</svelte:head>

<header class="app-header">
	<div class="container">
		<nav class="app-nav">
			{#each $locales as value}
				{#if value !== $locale}
					<form method="POST" action="/?/setLocale" use:enhance>
						<input type="hidden" name="locale" {value} />
						<Button type="submit" variant="ghost-negative">
							{$t(`lang.${value}`)}
							<svelte:fragment slot="sr-only">
								{$t('layout.switchLanguage', { lang: value })}
							</svelte:fragment>
						</Button>
					</form>
				{/if}
			{/each}
		</nav>
	</div>
</header>
<main class="app-main">
	<div class="container">
		<h1 class="app-title">{$t('layout.title')}</h1>
		<slot />
	</div>
</main>
<footer class="app-footer">
	<div class="container">
		<a
			href="https://github.com/rodrigodagostino/sveltekit-todo-app"
			target="_blank"
			rel="noreferrer"
		>
			{@html $t('layout.footer', { image: `<img src=${svelteLogo} alt="SvelteKit" />` })}
		</a>
	</div>
</footer>

<Notifications />

<style lang="scss">
	.container {
		max-width: 52rem;
		padding-inline: 1.25rem;
		margin-inline: auto;
		position: relative;
	}

	.app-nav {
		display: flex;
		justify-content: end;
		gap: 1rem;
	}

	.app-title {
		grid-column: 1/-1;
		margin-bottom: -1.5rem;
		font-size: clamp(2rem, 10vw, 4.375rem);
		font-weight: 900;
		color: var(--indigo-600);
		line-height: 1;
		text-align: center;
		text-transform: uppercase;
		opacity: 0.4;
		user-select: none;
	}

	.app-main {
		.container {
			display: grid;
			grid-template-columns: minmax(0, 1fr);
			grid-gap: 3rem 2rem;
			align-items: start;
		}
	}

	.app-footer {
		font-size: 0.875rem;
		text-align: center;
		margin-top: auto;

		.container {
			display: flex;
			justify-content: center;
			padding: 1rem 0;
		}

		a {
			color: var(--gray-900);
		}

		:global(img) {
			display: inline-block;
			width: auto;
			height: 1.25rem;
			vertical-align: middle;
		}
	}

	@media screen and (min-width: 48em) {
		.app-title {
			margin-bottom: -2rem;
		}

		.app-main {
			.container {
				grid-template-columns: 18rem minmax(0, 29.5rem);
			}
		}
	}
</style>
