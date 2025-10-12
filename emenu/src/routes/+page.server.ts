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

    // Get total menu items count (used as fallback for branches without specific menus)
    let totalMenuItemsCount = 0;
    try {
      const allMenuItems = await directus.request(readItems('menu_items', {
        limit: -1,
        fields: ['id']
      }));
      totalMenuItemsCount = allMenuItems.length;
    } catch (err) {
      console.error('Error getting total menu items count:', err);
      totalMenuItemsCount = 0;
    }

    // Enhanced branches with counts using the new branch_id relationship
    const enrichedBranches = await Promise.all(
      branches.map(async (branch) => {
        try {
          // Get branch-specific menu items count using the new relationship
          let menuItemsCount = 0;
          try {
            const branchMenuItems = await directus.request(readItems('menu_items', {
              filter: { branch_id: { _eq: branch.id } },
              fields: ['id'],
              limit: -1
            }));
            menuItemsCount = branchMenuItems?.length || 0;
            console.log(`Branch ${branch.name} has ${menuItemsCount} specific menu items`);
          } catch (err) {
            console.warn(`Could not get branch-specific menu count for ${branch.name}:`, err);
            // Fallback to total count if there's an error
            menuItemsCount = totalMenuItemsCount;
          }

          // Fallback to total count if no branch-specific items found
          if (menuItemsCount === 0) {
            menuItemsCount = totalMenuItemsCount;
          }

          // Get categories count (using all categories since they are typically global)
          let categoriesCount = 0;
          try {
            const allCategories = await directus.request(readItems('categories', {
              filter: { is_active: { _eq: true } },
              fields: ['id'],
              limit: -1
            }));
            categoriesCount = allCategories?.length || 0;
          } catch (err) {
            console.warn(`Could not get categories count:`, err);
            categoriesCount = 0;
          }

          // Count tables for this branch using branch.id (proper relationship)
          const tablesCount = await directus.request(readItems('tables', {
            filter: { branch_id: { _eq: branch.id } },
            fields: ['id'],
            limit: -1
          })).then(result => result?.length || 0).catch(() => 0);

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