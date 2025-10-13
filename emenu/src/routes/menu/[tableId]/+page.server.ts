import { error } from '@sveltejs/kit';

export async function load({ params }) {
	try {
		const { tableId } = params;

		// Validate table ID
		if (!tableId || !/^[a-zA-Z0-9-]+$/.test(tableId)) {
			throw error(400, 'Invalid table ID');
		}

		// In a real implementation, this would:
		// 1. Validate the table exists in Directus
		// 2. Check if the table is active and available
		// 3. Load menu data from Directus based on restaurant/branch
		// 4. Apply any menu restrictions or special items

		// For now, return basic validation
		return {
			tableId,
			error: null
		};

	} catch (err) {
		console.error('Menu page load error:', err);

		// Return error state
		return {
			tableId: null,
			error: err instanceof Error ? err.message : 'Failed to load menu'
		};
	}
}