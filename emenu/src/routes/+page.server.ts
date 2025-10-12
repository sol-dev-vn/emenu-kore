import type { PageServerLoad } from './$types';
import { createDirectus, rest, staticToken, readItems } from '@directus/sdk';
import { DIRECTUS_URL, DIRECTUS_SERVER_TOKEN } from '$env/static/private';
import { getErrorMessage } from '$lib/utils.js';

export const load: PageServerLoad = async ({ fetch }) => {
  const directus = createDirectus(DIRECTUS_URL, { globals: { fetch } })
    .with(staticToken(DIRECTUS_SERVER_TOKEN))
    .with(rest());

  try {
    // Fetch branches with basic info
    const branches = await directus.request(readItems('branches', {
      sort: ['name']
    }));

    // Enhanced branches with counts
    const enrichedBranches = await Promise.all(
      branches.map(async (branch) => {
        try {
          // Count menu items for this branch (using external_id fallback for now)
          const menuItemsCount = branch.external_id
            ? await directus.request(readItems('menu_items', {
                filter: { external_id: { _eq: branch.external_id } },
                limit: 0,
                aggregate: { count: '*' }
              })).then(result => result?.[0]?.count || 0).catch(() => 0)
            : 0;

          // Count categories (global, not branch-specific)
          const categoriesCount = await directus.request(readItems('categories', {
            filter: { is_active: { _eq: true } },
            limit: 0,
            aggregate: { count: '*' }
          })).then(result => result?.[0]?.count || 0).catch(() => 0);

          // Count tables for this branch (using external_id fallback for now)
          const tablesCount = branch.external_id
            ? await directus.request(readItems('tables', {
                filter: { external_id: { _eq: branch.external_id } },
                limit: 0,
                aggregate: { count: '*' }
              })).then(result => result?.[0]?.count || 0).catch(() => 0)
            : 0;

          return {
            ...branch,
            menu_items_count: menuItemsCount,
            categories_count: categoriesCount,
            tables_count: tablesCount
          };
        } catch (err) {
          console.error(`Error enriching branch ${branch.id}:`, err);
          return {
            ...branch,
            menu_items_count: 0,
            categories_count: 0,
            tables_count: 0
          };
        }
      })
    );

    return { branches: enrichedBranches, error: null };
  } catch (err) {
    console.error('Error fetching branches:', err);
    return { branches: [], error: getErrorMessage(err as Error) };
  }
};