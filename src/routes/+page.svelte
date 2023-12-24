<script lang="ts">
	import { selectedListId, todos } from '$lib/stores/todos';

	import List from '$lib/components/List.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import NoListsMessage from '$lib/components/NoListsMessage.svelte';

	export let data;

	$: todos.set(data.todos);
	$: selectedListId.set(data.selectedListId);
</script>

<Navigation />
{#if $todos.length}
	{#each $todos as list (list.id)}
		{#if $selectedListId === list.id}
			<List {...list} />
		{/if}
	{/each}
{:else}
	<NoListsMessage />
{/if}
