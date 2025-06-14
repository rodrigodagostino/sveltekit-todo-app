<script lang="ts" context="module">
	import type { IList } from '$lib/components/List.svelte';
	import type { ITask } from '$lib/components/Task.svelte';

	export interface Notification {
		id: number;
		type: 'list' | 'task';
		text: string;
		backup: IList | ITask;
	}
</script>

<script lang="ts">
	import { Button } from '$lib/components/index.js';
	import { lists, notifications } from '$lib/stores/index.js';
	import { fadeScale, flyScale } from '$lib/transitions/index.js';
	import { t } from '$lib/translations/index.js';

	export let id: Notification['id'];
	export let type: Notification['type'];
	export let text: Notification['text'];
	export let backup: Notification['backup'];

	const undoRemoval = () => {
		type === 'list' && !backup.hasOwnProperty('listId')
			? lists.addList({ ...backup, position: $lists.length + 1 } as IList)
			: lists.addTask((backup as ITask).listId, {
					...backup,
					position: $lists.find((list) => list.id === (backup as ITask).listId)?.tasks.length! + 1,
				} as ITask);
		notifications.dismiss(id);
	};
</script>

<div
	id={`notification-${id}`}
	class="notification"
	in:flyScale={{ y: 32, duration: 320 }}
	out:fadeScale={{ duration: 320 }}
>
	<div class="notification__inner">
		<p class="notification__text" role="status">{@html text}</p>
		<div class="notification__actions">
			<Button variant="neutral-dark" on:click|once={undoRemoval}>{$t('layout.undoRemoval')}</Button>
			<Button variant="ghost-dark" icon="times" on:click|once={() => notifications.dismiss(id)}>
				<svelte:fragment slot="sr-only">{$t('layout.closeNotification')}</svelte:fragment>
			</Button>
		</div>
		<div class="notification__progress" />
	</div>
</div>

<style lang="scss">
	.notification__inner {
		display: flex;
		gap: 1rem;
		align-items: center;
		padding-block: 0.75rem;
		padding-inline: 1.25rem 0.75rem;
		background-color: var(--gray-900);
		color: var(--gray-050);
		position: relative;
	}

	.notification__text {
		:global(strong) {
			color: var(--white-rich);
			font-weight: 600;
		}
	}

	.notification__actions {
		display: flex;
		gap: 0.5rem;
	}

	.notification__progress {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 0.25rem;
		background-color: var(--indigo-600);
		animation: progress 8s linear forwards;
	}

	@keyframes progress {
		0% {
			width: 100%;
		}
		100% {
			width: 0;
		}
	}
</style>
