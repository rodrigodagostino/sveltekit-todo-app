<script lang="ts">
	import { List, NoListsMessage, Tabs } from '$lib/components';
	import { selectedListId, todos } from '$lib/stores/todos';

	export let data;

	$: todos.set(data.todos);
	$: selectedListId.set(data.selectedListId);
</script>

<Tabs />
{#if $todos.length}
	{#each $todos as list (list.id)}
		{#if $selectedListId === list.id}
			<List {...list} />
		{/if}
	{/each}
{:else}
	<NoListsMessage />
{/if}
