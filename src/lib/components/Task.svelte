<script lang="ts" context="module">
	export interface ITask extends SortableItemData {
		listId: string;
		id: string;
		position: number;
		title: string;
		isDone: boolean;
	}
</script>

<script lang="ts">
	import { tick } from 'svelte';
	import { Handle, Remove, type SortableItemData } from '@rodrigodagostino/svelte-sortable-list';

	import { Button } from '$lib/components/index.js';
	import { lists } from '$lib/stores/index.js';
	import { t } from '$lib/translations/index.js';
	import Icon from './Icon.svelte';

	export let listId: ITask['listId'];
	export let id: ITask['id'];
	export let position: ITask['position'];
	export let title: ITask['title'];
	export let isDone: ITask['isDone'];

	let statusRef: HTMLInputElement;
	let titleRef: HTMLTextAreaElement;

	let prevTitle: string = title;
	let isEditing = false;

	const handleEditTask = async () => {
		isEditing = true;
		await tick();
		prevTitle = title || '';
		statusRef.setAttribute('disabled', 'true');
		titleRef.focus();
	};

	const handleTaskChanges = async (action: 'confirm' | 'cancel') => {
		isEditing = false;
		if (action === 'confirm') {
			prevTitle !== title && lists.editTask(listId, id, title || '');
		} else if (action === 'cancel') {
			title = prevTitle;
		}
		statusRef.removeAttribute('disabled');
	};

	const handleOnKeydownTaskChanges = (event: KeyboardEvent) => {
		switch (event.key) {
			case 'Enter':
				event.preventDefault();
				handleTaskChanges('confirm');
				break;
			case 'Escape':
				handleTaskChanges('cancel');
				break;
		}
	};

	function handleRemoveTask(event: MouseEvent) {
		const target = event.target as HTMLElement;
		const item = target.closest<HTMLLIElement>('.ssl-item');
		const itemId = item?.dataset.itemId;
		if (itemId) lists.removeTask(listId, itemId);
	}
</script>

<div class="task" class:task--done={isDone} class:is-editing={isEditing}>
	<Handle>
		<Icon icon="grip-dots-vertical" />
	</Handle>
	<input
		bind:this={statusRef}
		type="checkbox"
		name="task-status"
		id="task-status-{id}"
		class="task__status"
		bind:checked={isDone}
		on:click={() => lists.toggleTaskStatus(listId, id)}
	/>
	<label for="task-status-{id}" class="task__title-placeholder">{title}</label>
	<label for="task-title-{id}" class="sr-only">{$t('list.taskTitle')}</label>
	<textarea
		bind:this={titleRef}
		name="task-title"
		id="task-title-{id}"
		class="task__title"
		bind:value={title}
		rows="1"
		on:keydown={(event) => handleOnKeydownTaskChanges(event)}
		required
	/>
	<div class="task__actions">
		<Button
			variant="ghost"
			icon="check"
			class="button--confirm"
			on:click={() => handleTaskChanges('confirm')}
		>
			<svelte:fragment slot="sr-only">{$t('list.confirmChanges')}</svelte:fragment>
		</Button>
		<Button
			variant="ghost"
			icon="times"
			class="button--cancel"
			on:click={() => handleTaskChanges('cancel')}
		>
			<svelte:fragment slot="sr-only">{$t('list.cancelChanges')}</svelte:fragment>
		</Button>
		<Button variant="ghost" icon="pen" class="button--edit" on:click={handleEditTask}>
			<svelte:fragment slot="sr-only">{$t('list.editTask')}</svelte:fragment>
		</Button>
		<Remove class="button button--ghost" on:click={handleRemoveTask}>
			<span class="sr-only">{$t('list.removeTask')}</span>
			<Icon icon="trash-can" />
		</Remove>
	</div>
</div>

<style lang="scss">
	.task {
		display: grid;
		grid-template-columns: auto auto 1fr auto;
		align-items: center;
		width: 100%;
		padding-block: 0.5rem;
		background-color: var(--white);
		border-bottom: 1px solid var(--gray-200);
		transition: background-color 0.24s;

		:global(.ssl-handle) {
			padding: 0.5rem;
			margin-inline-end: 0.5rem;

			:global(svg circle) {
				fill: var(--gray-400);
				transition: fill 0.24s;
			}

			&:focus,
			&:hover {
				:global(svg circle) {
					fill: var(--indigo-500);
				}
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

		&.is-editing {
			.task__title-placeholder {
				visibility: hidden;
			}

			.task__title {
				visibility: visible;
			}

			:global(.button--confirm),
			:global(.button--cancel) {
				display: block;
			}

			:global(.button--edit) {
				display: none;
			}
		}
	}

	.task__status {
		flex-shrink: 0;
		margin: 0;
	}

	.task__title-placeholder,
	.task__title {
		grid-column: 3/4;
		grid-row: 1;
		padding: 0.25rem 0;
		font-size: 1.25rem;
		line-height: 1.2;
		transition: opacity 0.24s;
	}

	.task__title-placeholder {
		padding-inline: 0.75rem;
		justify-self: start;
	}

	.task__title {
		height: 100%;
		margin: 0 0.75rem;
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

	.task__actions {
		grid-column: 4/-1;
		margin-left: auto;
		display: flex;
		gap: 0.25rem;
	}

	.task--done {
		.task__title-placeholder {
			text-decoration: line-through;
			opacity: 0.5;
		}
	}

	:global(.ssl-ghost[data-is-pointer-dragging='true']) .task,
	:global(.ssl-item[data-is-keyboard-dragging='true']) .task {
		background-color: var(--gray-100);
	}

	:global(.ssl-ghost[data-is-pointer-dragging='true']) .task :global(.ssl-handle svg circle) {
		fill: var(--indigo-500);
	}
</style>
