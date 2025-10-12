import type { PageServerLoad } from './$types'
import { createDirectus, rest, staticToken, readItems } from '@directus/sdk'
import { DIRECTUS_URL, DIRECTUS_SERVER_TOKEN } from '$env/static/private'
import { getErrorMessage } from '$lib/utils.js'

export const load: PageServerLoad = async ({ params, fetch }) => {
  const { id } = params
  const directus = createDirectus(DIRECTUS_URL, { globals: { fetch } })
    .with(staticToken(DIRECTUS_SERVER_TOKEN))
    .with(rest())

  try {
    // Fetch all categories (global categories, not branch-specific)
    const categories = await directus.request(
      readItems('categories', {
        filter: { is_active: { _eq: true } },
        limit: -1,
        sort: ['sort', 'name']
      })
    ).catch(() => [])

    // Fetch branch by id to obtain external_id and basic info
    const branchItems = await directus.request(
      readItems('branches', {
        filter: { id: { _eq: id } },
        limit: 1
      })
    )

    const branch = Array.isArray(branchItems) ? branchItems[0] : null

    if (!branch) {
      return {
        branch: null,
        categories: [],
        menu_items: [],
        zones: [],
        tables: [],
        error: `Branch not found for id ${id}`
      }
    }

    const external_id = branch.external_id ?? null

    // Fetch menu items using the new branch_id relationship
    let menu_items = [];
    try {
      console.log(`Fetching menu items for branch ${branch.name} (${branch.id})`);

      // First try: Get menu items specifically linked to this branch
      const branch_menu_items = await directus.request(
        readItems('menu_items', {
          filter: { branch_id: { _eq: branch.id } },
          fields: ['*', { category_id: ['*', 'name', 'code'] }, { branch_id: ['*', 'name', 'code'] }],
          limit: -1,
          sort: ['sort', 'name']
        })
      ).catch(() => []);

      if (branch_menu_items && branch_menu_items.length > 0) {
        menu_items = branch_menu_items;
        console.log(`Found ${menu_items.length} branch-specific menu items`);
      } else {
        // If no branch-specific items, get all items as fallback
        console.log('No branch-specific menu items found, showing all menu items as fallback');
        menu_items = await directus.request(
          readItems('menu_items', {
            fields: ['*', { category_id: ['*', 'name', 'code'] }, { branch_id: ['*', 'name', 'code'] }],
            limit: -1,
            sort: ['sort', 'name']
          })
        ).catch(() => []);
      }
    } catch (err) {
      console.error('Error fetching menu items for branch:', err);
      // Fallback to all menu items
      menu_items = await directus.request(
        readItems('menu_items', {
          fields: ['*', { category_id: ['*', 'name', 'code'] }, { branch_id: ['*', 'name', 'code'] }],
          limit: -1,
          sort: ['sort', 'name']
        })
      ).catch(() => []);
    }

    // Group menu items by category using the new category_id relationship
    const menuItemsByCategory = [];
    const categoryMap = new Map();

    // Create a map of categories and their menu items
    menu_items.forEach(item => {
      const category = item.category_id;
      if (category) {
        if (!categoryMap.has(category.id)) {
          categoryMap.set(category.id, {
            id: category.id,
            name: category.name,
            description: category.description || `${category.name} menu items`,
            menu_items: []
          });
        }
        categoryMap.get(category.id).menu_items.push(item);
      } else {
        // Items without a category go to "Uncategorized"
        if (!categoryMap.has('uncategorized')) {
          categoryMap.set('uncategorized', {
            id: 'uncategorized',
            name: 'Uncategorized',
            description: 'Menu items without a category',
            menu_items: []
          });
        }
        categoryMap.get('uncategorized').menu_items.push(item);
      }
    });

    // Convert map to array and sort by category name
    categoryMap.forEach(category => {
      menuItemsByCategory.push(category);
    });

    // Sort categories: put "Uncategorized" at the end, others alphabetically
    menuItemsByCategory.sort((a, b) => {
      if (a.id === 'uncategorized') return 1;
      if (b.id === 'uncategorized') return -1;
      return a.name.localeCompare(b.name);
    });

    // Fetch zones for this branch (using external_id fallback due to permissions)
    const zones = await directus.request(
      readItems('zones', {
        filter: external_id ? { external_id: { _eq: external_id } } : { branch_id: { _eq: id } },
        limit: -1,
        sort: ['sort', 'name']
      })
    ).catch(() => [])

    // Fetch tables for this branch (using external_id fallback due to permissions)
    const tables = await directus.request(
      readItems('tables', {
        filter: external_id ? { external_id: { _eq: external_id } } : { branch_id: { _eq: id } },
        limit: -1,
        sort: ['name']
      })
    ).catch(() => [])

    return {
      branch,
      categories: menuItemsByCategory,
      menu_items,
      zones,
      tables,
      error: null
    }
  } catch (err) {
    console.error('Error loading branch details:', err)
    return {
      branch: null,
      categories: [],
      menu_items: [],
      zones: [],
      tables: [],
      error: getErrorMessage(err as Error)
    }
  }
}