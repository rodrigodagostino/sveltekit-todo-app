<script lang="ts">
	import { selectedListId, todos } from '$lib/stores/todos';

	import List from '$lib/components/List.svelte';
	import NoListsMessage from '$lib/components/NoListsMessage.svelte';
</script>

{#if $todos.length}
	{#each $todos as list (list.id)}
		{#if $selectedListId === list.id}
			<List id={list.id} position={list.position} title={list.title} tasks={list.tasks} />
		{/if}
	{/each}
{:else}
	<NoListsMessage />
{/if}
