import type { Actions } from './$types';

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
