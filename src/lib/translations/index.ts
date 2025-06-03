import i18n, { type Config } from 'sveltekit-i18n';

import lang from './lang.json' with { type: 'json' };

export interface Params {
	lang?: 'en' | 'es';
	remainingTasks?: number | null;
	itemType?: 'list' | 'task';
	itemTitle?: string;
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
			key: 'layout',
			loader: async () => (await import('./en/layout.json')).default,
		},
		{
			locale: 'en',
			key: 'home',
			routes: ['/'],
			loader: async () => (await import('./en/home.json')).default,
		},
		{
			locale: 'en',
			key: 'list',
			loader: async () => (await import('./en/list.json')).default,
		},
		{
			locale: 'en',
			key: 'error',
			loader: async () => (await import('./en/error.json')).default,
		},
		{
			locale: 'es',
			key: 'layout',
			loader: async () => (await import('./es/layout.json')).default,
		},
		{
			locale: 'es',
			key: 'home',
			routes: ['/'],
			loader: async () => (await import('./es/home.json')).default,
		},
		{
			locale: 'es',
			key: 'list',
			loader: async () => (await import('./es/list.json')).default,
		},
		{
			locale: 'es',
			key: 'error',
			loader: async () => (await import('./es/error.json')).default,
		},
	],
};

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);
