<script lang="ts">
	import { List, NoListsMessage, Tabs } from '$lib/components';
	import { selectedListId, lists } from '$lib/stores';

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
