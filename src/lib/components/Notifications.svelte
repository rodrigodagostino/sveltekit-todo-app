<script lang="ts">
	import { notifications } from '../stores/notifications';
	import Notification from './Notification.svelte';
</script>

<div class="notifications">
	{#each $notifications as notification (notification.id)}
		<Notification {...notification} />
	{/each}
</div>

<style lang="scss">
	.notifications {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: calc(100% - 2.5rem);
		position: fixed;
		left: 50%;
		bottom: 1.25rem;
		transform: translateX(-50%);

		:global(.notification + .notification) {
			margin-top: 0.75rem;
		}
	}
</style>
