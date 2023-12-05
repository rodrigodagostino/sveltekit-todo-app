<script lang="ts">
	import { todos } from '$lib/stores/todos';
	import { t } from '$lib/translations';

	import './styles.css';
	import svelteLogo from '$lib/assets/images/svelte-logo.svg';
	import Navigation from '$lib/components/Navigation.svelte';
	import List from '$lib/components/List.svelte';
	import NoListsMessage from '$lib/components/NoListsMessage.svelte';
	import Notifications from '$lib/components/Notifications.svelte';
</script>

<svelte:head>
	<title>SvelteKit To-Do App</title>
</svelte:head>

<header class="app-header">
	<div class="container">
		<h1 class="app-title">{$t('home.appTitle')}</h1>
	</div>
</header>
<main class="app-main">
	<div class="container">
		<Navigation />
		{#if !$todos.lists.length}
			<NoListsMessage />
		{:else}
			{#each $todos.lists as list (list.id)}
				{#if $todos.selectedListId === list.id}
					<List id={list.id} title={list.title} tasks={list.tasks} />
				{/if}
			{/each}
		{/if}
	</div>
</main>
<footer class="app-footer">
	<div class="container">
		<a
			href="https://github.com/rodrigodagostino/sveltekit-todo-app"
			target="_blank"
			rel="noreferrer"
		>
			Made with <img src={svelteLogo} alt="Svelte.js logo" /> by Rodrigo D’Agostino
		</a>
	</div>
</footer>
<Notifications />

<style lang="scss">
	.container {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		grid-gap: 3rem 2rem;
		align-items: start;
		max-width: 52rem;
		padding: 1.25rem;
		margin: 0 auto;
		position: relative;
	}

	.app-header {
		.container {
			display: block;
		}

		.app-title {
			margin-bottom: -0.5em;
			font-size: clamp(2rem, 10vw, 5.8125rem);
			font-weight: 900;
			color: var(--indigo-600);
			text-align: center;
			text-transform: uppercase;
			white-space: nowrap;
			opacity: 0.4;
			user-select: none;
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
			color: var(--gray-150);
			text-decoration: none;
			transition: color 0.24s;

			&:focus,
			&:hover {
				color: var(--white-rich);
			}
		}

		img {
			height: 1.25rem;
			width: auto;
			vertical-align: middle;
			margin: 0 0.25rem;
			display: inline-block;
		}
	}

	@media screen and (min-width: 48em) {
		.app-main {
			.container {
				grid-template-columns: 18rem minmax(0, 29.5rem);
			}
		}
	}
</style>
