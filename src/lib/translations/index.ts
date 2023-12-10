import i18n, { type Config } from 'sveltekit-i18n';
import lang from './lang.json';

interface Params {
	remainingTasks?: number | null;
	image?: string;
}

const config: Config<Params> = {
	translations: {
		en: { lang },
		es: { lang },
	},
	loaders: [
		{
			locale: 'en',
			key: 'home',
			routes: ['/'],
			loader: async () => (await import('./en/home.json')).default,
		},
		{
			locale: 'es',
			key: 'home',
			routes: ['/'],
			loader: async () => (await import('./es/home.json')).default,
		},
	],
};

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);
