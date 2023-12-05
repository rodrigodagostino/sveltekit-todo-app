import { writable, get } from 'svelte/store';
import type { Notification } from '$lib/components/Notification.svelte';

export const notifications = writable<Notification[]>([]);

export const addNotification = (
	type: Notification['type'],
	currentItem: Notification['backup']
) => {
	const notificationId = new Date().getTime();
	const titleCasedType = type.charAt(0).toUpperCase() + type.slice(1);

	notifications.update((currData) => [
		...currData,
		{
			id: notificationId,
			type: type,
			text: `${titleCasedType} <strong>${currentItem.title}</strong> was removed.`,
			backup: currentItem,
		},
	]);
	setTimeout(() => removeNotification(notificationId), 8000);
};

export const removeNotification = (notificationId: Notification['id']) => {
	const $notifications = get(notifications);
	if ($notifications.some((notification) => notification.id === notificationId)) {
		notifications.update((currData) => currData.filter((item) => item.id !== notificationId));
	}
};
