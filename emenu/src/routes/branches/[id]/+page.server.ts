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

    // Fetch menu items belonging to this branch using external_id (legacy fallback)
    // TODO: Switch back to branch_id once Directus collection schema is updated
    const menu_items = await directus.request(
      readItems('menu_items', {
        filter: external_id ? { external_id: { _eq: external_id } } : undefined,
        limit: -1,
        sort: ['sort', 'name']
      })
    ).catch(() => [])

    // Group menu items by category
    const menuItemsByCategory = categories.map(category => ({
      ...category,
      menu_items: menu_items.filter(item => item.category_id === category.id)
    })).filter(category => category.menu_items.length > 0)

    // Add uncategorized items if any
    const uncategorizedItems = menu_items.filter(item => !item.category_id)
    if (uncategorizedItems.length > 0) {
      menuItemsByCategory.push({
        id: 'uncategorized',
        name: 'Other Items',
        description: 'Items without category',
        menu_items: uncategorizedItems
      })
    }

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