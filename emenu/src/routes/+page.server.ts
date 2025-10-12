import type { PageServerLoad } from './$types';
import { createDirectus, rest, staticToken, readItems } from '@directus/sdk';
import { DIRECTUS_URL, DIRECTUS_SERVER_TOKEN } from '$env/static/private';
import { getErrorMessage } from '$lib/utils.js';

export const load: PageServerLoad = async ({ fetch }) => {
  const directus = createDirectus(DIRECTUS_URL, { globals: { fetch } })
    .with(staticToken(DIRECTUS_SERVER_TOKEN))
    .with(rest());

  try {
    const branches = await directus.request(readItems('branches'));
    return { branches, error: null };
  } catch (err) {
    console.error('Error fetching branches:', err);
    return { branches: [], error: getErrorMessage(err as Error) };
  }
};