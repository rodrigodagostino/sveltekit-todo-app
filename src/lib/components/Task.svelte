<script lang="ts" context="module">
	export interface ITask {
		listId: number;
		id: number;
		position: number;
		title: string;
		isDone: boolean;
	}
</script>

<script lang="ts">
	import { tick } from 'svelte';

	import { Button, Icon } from '$lib/components';
	import { lists } from '$lib/stores';
	import { t } from '$lib/translations';

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
</script>

<div class="task" class:task--done={isDone} class:is-editing={isEditing}>
	<span class="task__handle">
		<Icon icon="grip-dots-vertical" />
	</span>
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
			class="task__button-confirm"
			on:click={() => handleTaskChanges('confirm')}
		>
			<svelte:fragment slot="sr-only">{$t('list.confirmChanges')}</svelte:fragment>
		</Button>
		<Button
			variant="ghost"
			icon="times"
			class="task__button-cancel"
			on:click={() => handleTaskChanges('cancel')}
		>
			<svelte:fragment slot="sr-only">{$t('list.cancelChanges')}</svelte:fragment>
		</Button>
		<Button variant="ghost" icon="pen" class="task__button-edit" on:click={handleEditTask}>
			<svelte:fragment slot="sr-only">{$t('list.editTask')}</svelte:fragment>
		</Button>
		<Button
			variant="ghost"
			icon="trash-can"
			class="task__button-remove"
			on:click={() => lists.removeTask(listId, id)}
		>
			<svelte:fragment slot="sr-only">{$t('list.removeTask')}</svelte:fragment>
		</Button>
	</div>
</div>

<style lang="scss">
	.task {
		display: grid;
		grid-template-columns: auto auto 1fr auto;
		align-items: center;
		padding: 0.5rem 0;

		&--done {
			.task__title-placeholder {
				text-decoration: line-through;
				opacity: 0.5;
			}
		}

		&.is-editing {
			.task__title-placeholder {
				visibility: hidden;
			}

			.task__title {
				visibility: visible;
			}

			:global(.task__button-confirm),
			:global(.task__button-cancel) {
				display: block;
			}

			:global(.task__button-edit),
			:global(.task__button-remove) {
				display: none;
			}
		}

		&__handle {
			display: flex;
			padding: 0.25rem 0.5rem;
			cursor: grab;

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

		&__status {
			flex-shrink: 0;
			margin-inline: 0.5rem 0;
		}

		&__title-placeholder,
		&__title {
			grid-column: 3/4;
			grid-row: 1;
			padding: 0.25rem 0;
			font-size: 1.25rem;
			line-height: 1.2;
			transition: opacity 0.24s;
		}

		&__title-placeholder {
			padding-inline: 0.75rem;
			justify-self: start;
		}

		&__title {
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

		&__actions {
			grid-column: 4/-1;
			margin-left: auto;
			display: flex;
			gap: 0.25rem;
		}

		:global(.task__button-confirm),
		:global(.task__button-cancel) {
			display: none;
		}

		:global(.task__button-confirm) {
			&:focus,
			&:hover {
				color: var(--green-500);
			}
		}

		:global(.task__button-cancel) {
			&:focus,
			&:hover {
				color: var(--red-500);
			}
		}
	}
</style>
