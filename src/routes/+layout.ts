import { loadTranslations } from '$lib/translations/index.js';

export const load = async ({ data, url }) => {
	const { locale } = data;
	const { pathname } = url;

	const initLocale = locale || 'en';

	await loadTranslations(initLocale, pathname);

	return {};
};
