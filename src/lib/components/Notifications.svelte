<script lang="ts">
	import { Notification } from '$lib/components/index.js';
	import { notifications } from '$lib/stores/index.js';
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
