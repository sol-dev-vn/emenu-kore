import { error } from '@sveltejs/kit';
import directus from '$lib/directus';

export async function load({ params, cookies, request }) {
	const { tableId } = params;

	if (!tableId) {
		throw error(400, 'Table ID is required');
	}

	try {
		// Get table information with branch relation
		const tableData = await directus.items('tables').readOne(tableId, {
			fields: ['*', { branch_relation: ['*'] }]
		});

		if (!tableData) {
			throw error(404, 'Table not found');
		}

		// Check if table is active and available
		if (!tableData.is_active || !tableData.is_available) {
			throw error(410, 'Table is not available');
		}

		// Get brand information from branch
		let brandData = null;
		if (tableData.branch_relation?.brand_id) {
			brandData = await directus.items('brands').readOne(tableData.branch_relation.brand_id);
		}

		// Create session token
		const sessionToken = generateSessionToken();
		const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours

		// Get customer device info
		const userAgent = request.headers.get('user-agent') || '';
		const ipAddress = request.headers.get('x-forwarded-for') ||
						   request.headers.get('x-real-ip') ||
						   'unknown';

		// Create table session
		const sessionData = {
			table: parseInt(tableId),
			session_token: sessionToken,
			customer_device_info: `${userAgent.substring(0, 200)}${userAgent.length > 200 ? '...' : ''}`,
			scan_time: new Date().toISOString(),
			last_activity: new Date().toISOString(),
			expires_at: expiresAt.toISOString(),
			order_placed: false,
			ip_address: ipAddress,
			user_agent: userAgent,
			is_active: true
		};

		const session = await directus.items('table_sessions').createOne(sessionData);

		// Get branch-specific menu items
		const menuItems = await directus.items('menu_items').readByQuery({
			fields: ['*', { category: ['*'] }],
			filter: {
				brand_menu: { _in: getBrandMenuIds(tableData.branch_relation?.brand_id) }
			},
			sort: ['category.sort', 'sort']
		});

		// Get branch-specific active items
		const activeMenuItems = await directus.items('branch_menu_items').readByQuery({
			fields: ['*', { menu_item: ['*', { category: ['*'] }] }],
			filter: {
				branch: { _eq: tableData.branch_relation?.id },
				is_active: { _eq: true }
			}
		});

		return {
			table: tableData,
			branch: tableData.branch_relation,
			brand: brandData,
			session: session,
			menuItems: activeMenuItems.map(item => item.menu_item),
			sessionToken,
			error: null
		};

	} catch (err) {
		console.error('QR route error:', err);
		if (err.status) {
			throw err;
		}
		throw error(500, 'Internal server error');
	}
}

function generateSessionToken(): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < 32; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}

async function getBrandMenuIds(brandId: string): Promise<string[]> {
	if (!brandId) return [];

	try {
		const brandMenus = await directus.items('brand_menus').readByQuery({
			fields: ['id'],
			filter: {
				brand: { _eq: brandId },
				is_active: { _eq: true }
			}
		});

		return brandMenus.map(menu => menu.id);
	} catch {
		return [];
	}
}