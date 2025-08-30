import type { IList } from '$lib/components/List.svelte';

export const load = async ({ cookies }) => {
	const lists: IList[] = JSON.parse(cookies.get('lists') || '[]');

	return {
		lists,
		selectedListId: lists[0]?.id || null,
	};
};

export const actions = {
	setLocale: async ({ request, cookies }) => {
		const formData = await request.formData();
		const locale = String(formData.get('locale'));

		cookies.set('locale', locale, { path: '/' });

		return {
			success: true,
		};
	},
};
