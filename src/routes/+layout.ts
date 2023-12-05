import type { Load } from '@sveltejs/kit';
import { loadTranslations } from '$lib/translations';

export const load: Load = async ({ url }) => {
	const { pathname } = url;

	const initLocale = 'en';

	await loadTranslations(initLocale, pathname);

	return {};
};
