import { createDirectus, rest } from '@directus/sdk';
import { readItems } from '@directus/sdk';
import { PUBLIC_DIRECTUS_URL } from '$env/static/public';

/**
 * @param {typeof fetch} [fetch] - Optional fetch function for SSR
 */
function getDirectusInstance(fetch) {
	const options = fetch ? { globals: { fetch } } : {};
	const directus = createDirectus(PUBLIC_DIRECTUS_URL, options).with(rest());
	return directus;
}

export default getDirectusInstance;
