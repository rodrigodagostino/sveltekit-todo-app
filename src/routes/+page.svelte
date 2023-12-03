<script lang="ts">
	import './styles.css';
	import svelteLogo from '$assets/images/svelte-logo.svg';
</script>

<svelte:head>
	<title>Welcome to SvelteKit</title>
</svelte:head>

<main class="app-main">
	<div class="container">
		<div>
			<a href="https://kit.svelte.dev" target="_blank" rel="noreferrer">
				<img src={svelteLogo} alt="SvelteKit" />
			</a>
		</div>
		<h1>Welcome to SvelteKit</h1>
		<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation.</p>
	</div>
</main>
<footer class="app-footer">
	<div class="container">
		<a
			href="https://github.com/rodrigodagostino/vite-svelte-ts-template"
			target="_blank"
			rel="noreferrer"
		>
			Made with <img src={svelteLogo} alt="SvelteKit" /> by Rodrigo D’Agostino
		</a>
	</div>
</footer>

<style lang="scss">
	.container {
		max-width: 54rem;
		margin: 0 auto;
		padding: 1rem;
		position: relative;
	}

	.app-main {
		margin-top: 24vh;

		img {
			width: 6rem;
			height: auto;
			margin: 0 auto;
		}

		h1 {
			margin: 2rem 0 1rem;
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
			display: flex;
			color: var(--gray-400);

			&:focus,
			&:hover {
				color: var(--gray-600);
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
</style>
