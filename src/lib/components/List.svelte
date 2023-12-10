<script lang="ts" context="module">
	import Task, { type ITask } from './Task.svelte';

	export interface IList {
		id: number;
		title: string;
		tasks: ITask[];
	}
</script>

<script lang="ts">
	import Sortable, { type SortableOptions } from 'sortablejs';
	import { fade, fly } from 'svelte/transition';
	import { fadeScale, flyScale } from '$lib/transitions';
	import { t } from '$lib/translations';
	import { addTask, editList, editListTitle, removeList } from '$lib/stores/todos';

	import Button from './Button.svelte';

	export let id: IList['id'];
	export let title: IList['title'];
	export let tasks: IList['tasks'];

	let titleRef: HTMLHeadingElement;

	let isListBeingEdited = false;
	let remainingTasks: number | null = null;
	$: {
		remainingTasks = tasks.length
			? tasks.reduce((total, currentValue) => (!currentValue.isDone ? total + 1 : total), 0)
			: 0;
	}
	let taskNewTitle: string = '';
	let titlePrevContent: string;

	const handleTitleChanges = (action: 'confirm' | 'cancel') => {
		isListBeingEdited = false;
		action === 'confirm'
			? editListTitle(id, titleRef.textContent || '')
			: (titleRef.textContent = titlePrevContent);
		titleRef.removeAttribute('contenteditable');
	};

	const handleOnKeydownTitleChanges = (event: KeyboardEvent) => {
		switch (event.key) {
			case 'Enter':
				handleTitleChanges('confirm');
				break;
			case 'Escape':
				handleTitleChanges('cancel');
				break;
		}
	};

	const triggerTitleEdit = () => {
		titlePrevContent = titleRef.textContent || '';
		isListBeingEdited = true;
		titleRef.setAttribute('contenteditable', 'true');
		titleRef.focus();
	};

	const handleAddTask = () => {
		if (!(taskNewTitle.trim() !== '')) return;

		addTask(id, {
			listId: id,
			id: new Date().getTime(),
			title: taskNewTitle,
			isDone: false,
		});
		taskNewTitle = '';
	};

	const sortableOptions: SortableOptions = {
		handle: '.task__handle',
		ghostClass: 'list__task--ghost',
		chosenClass: 'list__task--chosen',
		dragClass: 'list__task--drag',
		animation: 200,
		store: {
			get: () => {
				const order = tasks.map((task) => `${task.id}`);
				return order ? order : [];
			},
			set: (sortable) => {
				const order = sortable.toArray();
				const reorderedTasks = tasks.sort(
					(a, b) => order.indexOf(`${a.id}`) - order.indexOf(`${b.id}`)
				);
				const reorderedList = { id, title, tasks: reorderedTasks };
				editList(id, reorderedList);
			},
		},
	};

	const sortable = (element: HTMLUListElement, options: SortableOptions) => {
		const instance = Sortable.create(element, options);

		return {
			destroy() {
				instance.destroy;
			},
		};
	};
</script>

<section class="list" in:fly={{ y: 32, duration: 320, delay: 320 }} out:fade={{ duration: 320 }}>
	<header class="list__header">
		<div class="list__header-top">
			<h2
				bind:this={titleRef}
				class="list__title"
				on:keydown={(event) => handleOnKeydownTitleChanges(event)}
			>
				{title}
			</h2>
			{#if isListBeingEdited}
				<div class="list__actions">
					<Button variant="ghost" icon="check" on:click={() => handleTitleChanges('confirm')}>
						<svelte:fragment slot="sr-only">{$t('home.confirmChanges')}</svelte:fragment>
					</Button>
					<Button variant="ghost" icon="times" on:click={() => handleTitleChanges('cancel')}>
						<svelte:fragment slot="sr-only">{$t('home.cancelChanges')}</svelte:fragment>
					</Button>
				</div>
			{:else}
				<div class="list__actions">
					<Button variant="ghost" icon="pen" on:click={triggerTitleEdit}>
						<svelte:fragment slot="sr-only">{$t('home.editList')}</svelte:fragment>
					</Button>
					<Button variant="ghost" icon="trash-can" on:click={() => removeList(id)}>
						<svelte:fragment slot="sr-only">{$t('home.removeList')}</svelte:fragment>
					</Button>
				</div>
			{/if}
		</div>
		{#if tasks.length}
			<div class="list__header-bottom" transition:fadeScale={{ duration: 320 }}>
				<p class="list__subhead">{$t('home.tasksRemaining', { remainingTasks: remainingTasks })}</p>
			</div>
		{/if}
	</header>

	<div class="list__content">
		<ul class="list__tasks" use:sortable={sortableOptions}>
			{#each tasks as task (task.id)}
				<li
					class="list__task"
					data-id={task.id}
					in:flyScale={{ y: 64, duration: 320 }}
					out:fadeScale={{ duration: 320 }}
				>
					<Task listId={id} id={task.id} title={task.title} isDone={task.isDone} />
				</li>
			{/each}
		</ul>
		<form class="list__form" on:submit|preventDefault={handleAddTask}>
			<input type="text" class="list__form-input" bind:value={taskNewTitle} />
			<Button variant="ghost" type="submit" icon="plus">
				<svelte:fragment slot="sr-only">{$t('home.addTask')}</svelte:fragment>
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

		&__header {
			background-color: var(--gray-100);
			padding: 1.75rem 1.5rem;
		}

		&__header-top {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		&__title {
			font-size: 2rem;
			line-height: 1.1;

			&:is([contenteditable='true']) {
				outline: none;
				box-shadow: 0 2px 0 var(--indigo-500);
				cursor: text;
			}
		}

		&__header-bottom {
			margin-top: 0.25rem;
		}

		&__subhead {
			font-size: 1rem;
			user-select: none;
		}

		&__actions {
			display: flex;
			gap: 0.25rem;
		}

		&__content {
			padding: 1.5rem 1.5rem 2rem;
		}

		&__task {
			list-style: none;
			border-bottom: 1px solid var(--gray-200);
			background-color: var(--white);
			transition: background-color 0.24s;

			&:is(&--chosen) {
				background-color: var(--gray-100);
				position: relative;
				z-index: 10;
			}

			&:is(&--drag) {
				opacity: 0;
			}
		}

		&__form {
			display: flex;
			gap: 0.25rem;
			padding-left: 2rem;
			margin-top: 1rem;
		}

		&__form-input {
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
	}

	@media screen and (min-width: 48em) {
		.list {
			grid-column: 2;
			grid-row: 2;
		}
	}
</style>
