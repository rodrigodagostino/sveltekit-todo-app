<script lang="ts">
	import { List, NoListsMessage, Tabs } from '$lib/components/index.js';
	import { selectedListId, lists } from '$lib/stores/index.js';

	export let data;

	$: lists.set(data.lists);
	$: selectedListId.set(data.selectedListId);
</script>

<Tabs />
{#if $lists.length}
	{#each $lists as list (list.id)}
		{#if $selectedListId === list.id}
			<List {...list} />
		{/if}
	{/each}
{:else}
	<NoListsMessage />
{/if}
