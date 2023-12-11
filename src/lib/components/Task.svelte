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
	import { t } from '$lib/translations';
	import { editTask, removeTask, toggleTaskStatus } from '$lib/stores/todos';

	import Button from './Button.svelte';
	import Icon from './Icon.svelte';

	export let listId: ITask['listId'];
	export let id: ITask['id'];
	export let position: ITask['position'];
	export let title: ITask['title'];
	export let isDone: ITask['isDone'];

	let checkboxRef: HTMLInputElement;
	let labelRef: HTMLLabelElement;

	let labelPrevContent: string;
	let isTaskBeingEdited = false;

	const handleEditTask = () => {
		labelPrevContent = labelRef.textContent || '';
		isTaskBeingEdited = true;
		checkboxRef.setAttribute('disabled', 'true');
		labelRef.setAttribute('contenteditable', 'true');
		labelRef.focus();
	};

	const handleTaskChanges = (action: 'confirm' | 'cancel') => {
		isTaskBeingEdited = false;
		action === 'confirm'
			? editTask(listId, id, labelRef.textContent || '')
			: (labelRef.textContent = labelPrevContent);
		checkboxRef.removeAttribute('disabled');
		labelRef.removeAttribute('contenteditable');
	};

	const handleOnKeydownTaskChanges = (event: KeyboardEvent) => {
		switch (event.key) {
			case 'Enter':
				handleTaskChanges('confirm');
				break;
			case 'Escape':
				handleTaskChanges('cancel');
				break;
		}
	};
</script>

<div class="task" class:task--done={isDone}>
	<span class="task__handle">
		<Icon icon="grip-dots-vertical" />
	</span>
	<input
		bind:this={checkboxRef}
		type="checkbox"
		bind:checked={isDone}
		id="task-{id}"
		class="task__checkbox"
		on:click={() => toggleTaskStatus(listId, id)}
	/>
	<label
		bind:this={labelRef}
		for="task-{id}"
		class="task__label"
		on:keydown={(event) => handleOnKeydownTaskChanges(event)}
	>
		{title}
	</label>
	{#if isTaskBeingEdited}
		<div class="task__actions">
			<Button
				variant="ghost"
				icon="check"
				class="task__button-confirm"
				on:click={() => handleTaskChanges('confirm')}
			>
				<svelte:fragment slot="sr-only">{$t('home.confirmChanges')}</svelte:fragment>
			</Button>
			<Button
				variant="ghost"
				icon="times"
				class="task__button-cancel"
				on:click={() => handleTaskChanges('cancel')}
			>
				<svelte:fragment slot="sr-only">{$t('home.cancelChanges')}</svelte:fragment>
			</Button>
		</div>
	{:else}
		<div class="task__actions">
			<Button variant="ghost" icon="pen" on:click={handleEditTask}>
				<svelte:fragment slot="sr-only">{$t('home.editTask')}</svelte:fragment>
			</Button>
			<Button variant="ghost" icon="trash-can" on:click={() => removeTask(listId, id)}>
				<svelte:fragment slot="sr-only">{$t('home.removeTask')}</svelte:fragment>
			</Button>
		</div>
	{/if}
</div>

<style lang="scss">
	.task {
		display: flex;
		align-items: center;
		padding: 0.5rem 0;

		&--done {
			.task__label {
				text-decoration: line-through;
				opacity: 0.5;
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

		&__checkbox,
		&__label {
			transition: opacity 0.24s;
			cursor: pointer;
		}

		&__checkbox:disabled {
			cursor: default;
		}

		&__checkbox {
			flex-shrink: 0;
			margin-left: 0.5rem;
		}

		&__label {
			font-size: 1.25rem;
			line-height: 1.2;
			margin-left: 0.75rem;

			&:is([contenteditable='true']) {
				outline: none;
				box-shadow: 0 2px 0 var(--indigo-500);
				cursor: text;
			}
		}

		&__actions {
			margin-left: auto;
			display: flex;
			gap: 0.25rem;
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
