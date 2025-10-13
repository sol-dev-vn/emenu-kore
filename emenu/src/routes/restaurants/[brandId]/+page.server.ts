import type { PageServerLoad } from './$types';
import { createDirectus, rest, staticToken, readItems } from '@directus/sdk';
import { DIRECTUS_URL, DIRECTUS_SERVER_TOKEN } from '$env/static/private';
import { getErrorMessage } from '$lib/utils.js';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, fetch }) => {
  const { brandId } = params;

  const directus = createDirectus(DIRECTUS_URL, { globals: { fetch } })
    .with(staticToken(DIRECTUS_SERVER_TOKEN))
    .with(rest());

  // Brand information
  const brandInfo = {
    miwaku_premium: { name: 'Miwaku Premium', color: '#FF6B6B', description: 'Iconic Anniversary Restaurant at Landmark 81' },
    s79_teppanyaki: { name: 'S79 Japanese Teppanyaki', color: '#4ECDC4', description: 'Premium teppanyaki experience' },
    kohaku_sashimi_yakiniku: { name: 'Kohaku Sashimi & Yakiniku', color: '#45B7D1', description: 'Traditional Japanese cuisine' },
    kohaku_sushi: { name: 'Kohaku Sushi', color: '#96CEB4', description: 'Authentic sushi and sashimi' },
    kohaku_udon_ramen: { name: 'Kohaku Udon & Ramen', color: '#FFEAA7', description: 'Japanese noodle specialties' },
    date_nariya: { name: 'Date Nariya', color: '#DDA0DD', description: 'Japanese Gyutan Steak' },
    machida_shoten: { name: 'Machida Shoten', color: '#FFA500', description: 'Traditional Japanese izakaya' },
    warehouse: { name: 'Warehouse', color: '#708090', description: 'Central warehouse and supply chain operations' }
  };

  // Check if brand exists
  if (!brandInfo[brandId as keyof typeof brandInfo]) {
    throw error(404, `Brand "${brandId}" not found`);
  }

  try {
    // Fetch branches for the specific brand
    const branches = await directus.request(readItems('branches', {
      filter: { brand_id: { _eq: brandId } },
      sort: ['name'],
      fields: ['*', 'brand_id']
    }));

    // Get total menu items count
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

    // Enhanced branches with counts
    const enrichedBranches = await Promise.all(
      branches.map(async (branch) => {
        try {
          // Get branch-specific menu items count
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
            menuItemsCount = totalMenuItemsCount;
          }

          // Fallback to total count if no branch-specific items found
          if (menuItemsCount === 0) {
            menuItemsCount = totalMenuItemsCount;
          }

          // Get categories count
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

          // Count tables for this branch
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

    return {
      brandBranches: enrichedBranches,
      brandInfo: brandInfo[brandId as keyof typeof brandInfo],
      error: null
    };
  } catch (err) {
    console.error('Error fetching brand branches:', err);
    return {
      brandBranches: [],
      brandInfo: brandInfo[brandId as keyof typeof brandInfo],
      error: getErrorMessage(err as Error)
    };
  }
};