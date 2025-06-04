<script lang="ts" context="module">
	import Task, { type ITask } from './Task.svelte';

	export interface IList extends SortableItemData {
		id: string;
		position: number;
		title: string;
		tasks: ITask[];
	}
</script>

<script lang="ts">
	import { tick } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import {
		SortableList,
		SortableItem,
		sortItems,
		type SortableItemData,
		type DragEndEventDetail,
	} from '@rodrigodagostino/svelte-sortable-list';

	import { Button } from '$lib/components/index.js';
	import { lists } from '$lib/stores/index.js';
	import { fadeScale } from '$lib/transitions/index.js';
	import { t } from '$lib/translations/index.js';
	import Icon from './Icon.svelte';

	export let id: IList['id'];
	export let position: IList['position'];
	export let title: IList['title'];
	export let tasks: IList['tasks'];

	let titleRef: HTMLTextAreaElement;

	let prevTitle: string = title;
	let newTaskTitle: string = '';
	let isEditing = false;
	let remainingTasks: number | null = null;
	$: {
		remainingTasks = tasks.length
			? tasks.reduce((total, currentValue) => (!currentValue.isDone ? total + 1 : total), 0)
			: 0;
	}

	const handleEditList = async () => {
		isEditing = true;
		await tick();
		prevTitle = title || '';
		titleRef.focus();
	};

	const handleListChanges = (action: 'confirm' | 'cancel') => {
		isEditing = false;
		if (action === 'confirm') {
			prevTitle !== title && lists.editList(id, { id, position, title: title || '', tasks });
		} else if (action === 'cancel') {
			title = prevTitle;
		}
	};

	const handleOnKeydownListChanges = (event: KeyboardEvent) => {
		switch (event.key) {
			case 'Enter':
				event.preventDefault();
				handleListChanges('confirm');
				break;
			case 'Escape':
				handleListChanges('cancel');
				break;
		}
	};

	const handleAddTask = () => {
		if (!(newTaskTitle.trim() !== '')) return;

		lists.addTask(id, {
			listId: id,
			id: String(new Date().getTime()),
			position: +tasks.length + 1 || 1,
			title: newTaskTitle,
			isDone: false,
		});
		newTaskTitle = '';
	};

	function handleDragEnd(event: CustomEvent<DragEndEventDetail>) {
		const { draggedItemIndex, targetItemIndex, isCanceled } = event.detail;
		if (
			!isCanceled &&
			typeof targetItemIndex === 'number' &&
			draggedItemIndex !== targetItemIndex
		) {
			const reorderedTasks = sortItems(tasks, draggedItemIndex, targetItemIndex);
			const reorderedList = { id, position, title, tasks: reorderedTasks };
			lists.editList(id, reorderedList);
		}
	}
</script>

<section
	class="list"
	class:is-editing={isEditing}
	in:fly={{ y: 32, duration: 320, delay: 320 }}
	out:fade={{ duration: 320 }}
>
	<header class="list__header">
		<div class="list__header-top">
			<h2 class="list__title-placeholder">{title}</h2>
			<textarea
				bind:this={titleRef}
				name="list-title"
				id="list-title-{id}"
				class="list__title"
				bind:value={title}
				rows="1"
				on:keydown={(event) => handleOnKeydownListChanges(event)}
				required
			/>
			<div class="list__actions">
				<Button
					variant="ghost"
					icon="check"
					class="button--confirm"
					on:click={() => handleListChanges('confirm')}
				>
					<svelte:fragment slot="sr-only">{$t('list.confirmChanges')}</svelte:fragment>
				</Button>
				<Button
					variant="ghost"
					icon="times"
					class="button--cancel"
					on:click={() => handleListChanges('cancel')}
				>
					<svelte:fragment slot="sr-only">{$t('list.cancelChanges')}</svelte:fragment>
				</Button>
				<Button variant="ghost" icon="pen" class="button--edit" on:click={handleEditList}>
					<svelte:fragment slot="sr-only">{$t('list.editList')}</svelte:fragment>
				</Button>
				<Button
					variant="ghost"
					icon="trash-can"
					class="button--remove"
					on:click={() => lists.removeList(id)}
				>
					<svelte:fragment slot="sr-only">{$t('list.removeList')}</svelte:fragment>
				</Button>
			</div>
		</div>
		{#if tasks.length}
			<div class="list__header-bottom" transition:fadeScale={{ duration: 320 }}>
				<p class="list__subhead">{$t('list.tasksRemaining', { remainingTasks: remainingTasks })}</p>
			</div>
		{/if}
	</header>

	<div class="list__content">
		<SortableList gap={0} hasLockedAxis={true} hasBoundaries={true} on:dragend={handleDragEnd}>
			{#each tasks as task, index (task.id)}
				<SortableItem id={task.id} {index}>
					<Task
						listId={id}
						id={task.id}
						position={task.position}
						title={task.title}
						isDone={task.isDone}
					/>
				</SortableItem>
			{/each}
		</SortableList>
		<form class="list__form" on:submit|preventDefault={handleAddTask}>
			<input
				type="text"
				name="task-title"
				class="list__form-input"
				bind:value={newTaskTitle}
				required
			/>
			<Button type="submit" variant="ghost" icon="plus">
				<svelte:fragment slot="sr-only">{$t('list.addTask')}</svelte:fragment>
			</Button>
		</form>
	</div>
</section>

<style lang="scss">
	.list {
		grid-column: 1;
		grid-row: 3;
		background-color: var(--white);
		max-width: 100%;
		overflow: hidden;

		&.is-editing {
			.list__title-placeholder {
				visibility: hidden;
			}

			.list__title {
				visibility: visible;
			}

			:global(.list__button-confirm),
			:global(.list__button-cancel) {
				display: block;
			}

			:global(.list__button-edit) {
				display: none;
			}
		}

		:global(.button--confirm),
		:global(.button--cancel) {
			display: none;
		}

		:global(.button--confirm) {
			&:focus,
			&:hover {
				color: var(--green-500);
			}
		}

		:global(.button--cancel) {
			&:focus,
			&:hover {
				color: var(--red-500);
			}
		}
	}

	.list__header {
		padding: 1.75rem 1.5rem;
		background-color: var(--gray-100);
	}

	.list__header-top {
		display: grid;
		grid-template-columns: 1fr auto;
	}

	.list__title-placeholder,
	.list__title {
		grid-column: 1/2;
		grid-row: 1;
		font-size: 2rem;
		font-weight: 700;
		line-height: 1.1;
	}

	.list__title {
		height: 100%;
		padding: 0;
		margin: 0 0.5rem 0 0;
		background-color: transparent;
		border: none;
		outline: none;
		box-shadow: 0 0.125rem 0 var(--gray-400);
		resize: none;
		overflow: hidden;
		visibility: hidden;

		&:focus {
			box-shadow: 0 0.125rem 0 var(--indigo-500);
		}
	}

	.list__header-bottom {
		margin-top: 0.25rem;
	}

	.list__subhead {
		font-size: 1rem;
		user-select: none;
	}

	.list__actions {
		display: flex;
		gap: 0.25rem;
	}

	.list__content {
		padding: 1.5rem 1.5rem 2rem;
	}

	.list__form {
		display: flex;
		gap: 0.25rem;
		padding-left: 2rem;
		margin-top: 1rem;
	}

	.list__form-input {
		flex: 1;
		font-size: 1.25rem;
		background-color: transparent;
		border: none;
		border-bottom: 2px solid var(--gray-400);
		outline: none;
		transition: border 0.24s;

		&:focus {
			border-bottom-color: var(--indigo-500);
		}
	}

	@media screen and (min-width: 48em) {
		.list {
			grid-column: 2;
			grid-row: 2;
		}
	}
</style>
