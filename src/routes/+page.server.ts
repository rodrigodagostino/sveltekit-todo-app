import type { Actions, PageServerLoad } from './$types';
import type { IList } from '$lib/components/List.svelte';

export const load: PageServerLoad = async ({ cookies }) => {
	const todos: IList[] = JSON.parse(cookies.get('todos') || '[]');

	return {
		todos,
		selectedListId: todos[0]?.id || null,
	};
};

export const actions: Actions = {
	setLocale: async ({ request, cookies }) => {
		const formData = await request.formData();
		const locale = String(formData.get('locale'));

		cookies.set('locale', locale, { path: '/' });

		return {
			success: true,
		};
	},
};
