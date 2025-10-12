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
    // Fetch branch by id to obtain external_id
    const branchItems = await directus.request(
      readItems('branches', {
        filter: { id: { _eq: id } },
        limit: 1
      })
    )

    const branch = Array.isArray(branchItems) ? branchItems[0] : null

    if (!branch) {
      return { branch: null, menu_items: [], zones: [], tables: [], error: `Branch not found for id ${id}` }
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
    )

    // Fetch zones for this branch
    const zones = await directus.request(
      readItems('zones', {
        filter: { branch_id: { _eq: id } },
        limit: -1,
        sort: ['sort', 'name']
      })
    )

    // Fetch tables for this branch (will be grouped by zone client-side)
    const tables = await directus.request(
      readItems('tables', {
        filter: { branch_id: { _eq: id } },
        limit: -1,
        sort: ['name']
      })
    )

    return { branch, menu_items, zones, tables, error: null }
  } catch (err) {
    console.error('Error loading branch details:', err)
    return { branch: null, menu_items: [], zones: [], tables: [], error: getErrorMessage(err as Error) }
  }
}