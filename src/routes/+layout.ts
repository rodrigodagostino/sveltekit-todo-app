import type { LayoutLoad } from './$types';
import { loadTranslations } from '$lib/translations';

export const load: LayoutLoad = async ({ data, url }) => {
	const { locale } = data;
	const { pathname } = url;

	const initLocale = locale || 'en';

	await loadTranslations(initLocale, pathname);

	return {};
};
