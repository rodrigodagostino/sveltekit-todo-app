import { writable } from 'svelte/store';

import type { Notification } from '$lib/components/Notification.svelte';
import { t, type Params } from '$lib/translations';

function createNotificationsStore() {
	const { subscribe, update } = writable<Notification[]>([]);

	function add(type: Notification['type'], currentItem: Notification['backup']) {
		const notificationId = new Date().getTime();
		const titleCasedType = type.charAt(0).toUpperCase() + type.slice(1);

		update((currValue) => [
			...currValue,
			{
				id: notificationId,
				type,
				text: t.get('layout.notificationMessage', {
					itemType: titleCasedType as Params['itemType'],
					itemTitle: currentItem.title,
				}),
				backup: currentItem,
			},
		]);
		setTimeout(() => dismiss(notificationId), 8000);
	}

	function dismiss(notificationId: Notification['id']) {
		update((currValue) => currValue.filter((item) => item.id !== notificationId));
	}

	return {
		subscribe,
		add,
		dismiss,
	};
}

export default createNotificationsStore();
