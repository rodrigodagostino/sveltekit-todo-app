<script lang="ts">
	import { fly } from 'svelte/transition';
	import Sortable, { type SortableOptions } from 'sortablejs';
	import cloneDeep from 'lodash.clonedeep';

	import { Button, Icon } from '$lib/components';
	import { lists, selectedListId } from '$lib/stores';
	import { fadeScale, flyScale } from '$lib/transitions';
	import { t } from '$lib/translations';

	let listNewTitle: string = '';

	const handleAddList = () => {
		if (!(listNewTitle.trim() !== '')) return;

		lists.addList({
			id: new Date().getTime(),
			position: +$lists.length + 1 || 1,
			title: listNewTitle,
			tasks: [],
		});
		listNewTitle = '';
	};

	const sortableOptions: SortableOptions = {
		handle: '.tabs__item-handle',
		ghostClass: 'tabs__item--ghost',
		chosenClass: 'tabs__item--chosen',
		dragClass: 'tabs__item--drag',
		animation: 200,
		store: {
			get: () => {
				const order = $lists.map((list) => `${list.id}`);
				return order ? order : [];
			},
			set: (sortable) => {
				const order = sortable.toArray();
				const reorderedLists = cloneDeep($lists)
					.sort((a, b) => order.indexOf(`${a.id}`) - order.indexOf(`${b.id}`))
					.map((list, i) => {
						return {
							...list,
							position: i + 1,
						};
					});
				lists.set(reorderedLists);
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

<nav class="tabs" in:fly={{ y: 32, duration: 320, delay: 320 }}>
	<ul class="tabs__items" use:sortable={sortableOptions}>
		{#each $lists as list (list.id)}
			<li
				class="tabs__item"
				class:is-active={list.id === $selectedListId}
				data-id={list.id}
				in:flyScale={{ y: 64, duration: 320 }}
				out:fadeScale={{ duration: 320 }}
			>
				<button class="tabs__item-button" on:click={() => ($selectedListId = list.id)}>
					<span class="tabs__item-handle">
						<Icon icon="grip-dots-vertical" />
					</span>
					<span class="tabs__item-label">{list.title}</span>
				</button>
			</li>
		{/each}
	</ul>
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
	.tabs {
		color: var(--white);

		&__item {
			list-style: none;
			background-color: var(--indigo-400);
			transition: background-color 0.24s;

			&.is-active {
				background-color: var(--indigo-800);

				.tabs__item-button {
					padding: 1rem 1rem 1rem 0.75rem;
					font-weight: 600;
					color: var(--white-rich);
				}
			}

			&:is(&--chosen) {
				background-color: rgba(79, 70, 229, 0.5);
				position: relative;
				z-index: 10;
			}

			&:is(&--drag) {
				opacity: 0;
			}
		}

		&__item-button {
			display: flex;
			gap: 0.5rem;
			align-items: center;
			width: 100%;
			padding: 1rem 0;
			border: none;
			outline: 3px solid transparent;
			font-size: 1.5rem;
			line-height: 1.2;
			transition:
				padding 0.24s,
				outline 0.24s;
			cursor: pointer;

			&:focus-visible {
				outline: 3px solid currentColor;
			}
		}

		&__item-handle {
			display: block;
			flex: 0 0 auto;
			display: flex;
			padding: 0.25rem 0.5rem;
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

		&__form {
			display: flex;
			gap: 0.25rem;
			padding-left: 2rem;
			padding-right: 1rem;
			margin-top: 1rem;
		}

		&__form-input {
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
	}
</style>
