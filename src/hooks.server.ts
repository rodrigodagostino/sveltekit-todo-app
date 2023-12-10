import type { Handle } from '@sveltejs/kit';

export const handle: Handle = ({ event, resolve }) => {
	const locale = event.cookies.get('locale') || 'en';

	// TODO: Update DOM properly every time +page.server.ts setLocale() is called.
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', locale),
	});
};
