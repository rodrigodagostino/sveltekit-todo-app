<script lang="ts">
	import { fly } from 'svelte/transition';
	import {
		SortableList,
		SortableItem,
		Handle,
		sortItems,
		type DragEndEventDetail,
	} from '@rodrigodagostino/svelte-sortable-list';

	import { Button, Icon } from '$lib/components/index.js';
	import { lists, selectedListId } from '$lib/stores/index.js';
	import { t } from '$lib/translations/index.js';

	let listNewTitle: string = '';

	const handleAddList = () => {
		if (!(listNewTitle.trim() !== '')) return;

		lists.addList({
			id: String(new Date().getTime()),
			position: +$lists.length + 1 || 1,
			title: listNewTitle,
			tasks: [],
		});
		listNewTitle = '';
	};

	function handleDragEnd(event: CustomEvent<DragEndEventDetail>) {
		const { draggedItemIndex, targetItemIndex, isCanceled } = event.detail;
		if (
			!isCanceled &&
			typeof targetItemIndex === 'number' &&
			draggedItemIndex !== targetItemIndex
		) {
			const reorderedLists = sortItems($lists, draggedItemIndex, targetItemIndex);
			lists.set(reorderedLists);
		}
	}
</script>

<nav class="tabs" in:fly={{ y: 32, duration: 320, delay: 320 }}>
	<SortableList gap={0} hasLockedAxis={true} hasBoundaries={true} on:dragend={handleDragEnd}>
		{#each $lists as list, index (list.id)}
			<SortableItem id={list.id} {index}>
				<button
					class="tab"
					class:is-active={list.id === $selectedListId}
					on:click={() => ($selectedListId = list.id)}
				>
					<Handle>
						<Icon icon="grip-dots-vertical" />
					</Handle>
					<span class="tabs__item-label">{list.title}</span>
				</button>
			</SortableItem>
		{/each}
	</SortableList>
	<form class="tabs__form" on:submit|preventDefault={handleAddList}>
		<input
			type="text"
			class="tabs__form-input"
			name="list-title"
			bind:value={listNewTitle}
			required
		/>
		<Button type="submit" variant="ghost-negative" icon="plus">
			<svelte:fragment slot="sr-only">{$t('layout.addList')}</svelte:fragment>
		</Button>
	</form>
</nav>

<style lang="scss">
	.tab {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		width: 100%;
		padding: 0.75rem 0;
		background-color: var(--indigo-400);
		border: none;
		outline: 3px solid transparent;
		font-size: 1.5rem;
		line-height: 1.2;
		color: var(--white);
		transition:
			padding 0.24s,
			background-color 0.24s,
			outline 0.24s;
		cursor: pointer;

		&:focus-visible {
			outline: 3px solid currentColor;
		}

		&.is-active {
			padding-inline-start: 0.5rem;
			background-color: var(--indigo-800);
			font-weight: 600;
			color: var(--white-rich);
		}

		:global(.ssl-handle) {
			display: block;
			flex: 0 0 auto;
			display: flex;
			padding: 0.5rem 0.75rem;
			cursor: grab;

			:global(svg circle) {
				fill: var(--indigo-200);
				transition: fill 0.24s;
			}

			&:focus,
			&:hover {
				:global(svg circle) {
					fill: var(--indigo-100);
				}
			}
		}
	}

	:global(.ssl-list),
	:global(.ssl-item__inner) {
		outline: 3px solid transparent;
	}

	:global(.ssl-list):focus-visible {
		outline: 3px solid var(--gray-800);
		transition: outline 0.24s;
	}

	:global(.ssl-item__inner) {
		transition: outline 0.24s;
	}

	:global(.ssl-item) {
		outline: none;

		&:focus-within:focus-visible {
			:global(.ssl-item__inner) {
				outline: 3px solid var(--gray-800);
			}
		}
	}

	:global(.ssl-ghost[data-is-pointer-dragging='true']) .tab,
	:global(.ssl-item[data-is-keyboard-dragging='true']) .tab {
		background-color: var(--indigo-500);
	}

	.tabs__form {
		display: flex;
		gap: 0.25rem;
		padding-left: 2rem;
		padding-right: 1rem;
		margin-top: 1rem;
	}

	.tabs__form-input {
		flex: 1;
		font-size: 1.25rem;
		background-color: transparent;
		border: none;
		border-bottom: 2px solid var(--gray-100);
		outline: none;
		transition: border 0.24s;

		&:focus {
			border-bottom-color: var(--white-rich);
		}
	}
</style>
