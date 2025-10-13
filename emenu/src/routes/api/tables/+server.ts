import { json } from '@sveltejs/kit';
import { TableService } from '$lib/server/tableService';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const branchId = url.searchParams.get('branch') || 'branch-1';
		const zone = url.searchParams.get('zone');
		const status = url.searchParams.getAll('status');
		const search = url.searchParams.get('search') || '';

		// Get all tables
		const tables = await TableService.getTables(branchId);

		// Apply filters
		let filteredTables = tables;

		// Zone filter
		if (zone) {
			filteredTables = filteredTables.filter(table => table.zone === zone);
		}

		// Status filter
		if (status.length > 0) {
			filteredTables = filteredTables.filter(table =>
				status.includes(table.status)
			);
		}

		// Search filter
		if (search) {
			const searchTerm = search.toLowerCase();
			filteredTables = filteredTables.filter(table =>
				table.number.toString().includes(searchTerm) ||
				(table.name && table.name.toLowerCase().includes(searchTerm))
			);
		}

		// Get zones and metrics
		const [zones, metrics] = await Promise.all([
			TableService.getZones(branchId),
			TableService.getTableMetrics(branchId)
		]);

		return json({
			success: true,
			data: {
				tables: filteredTables,
				zones,
				metrics,
				total: filteredTables.length
			},
			timestamp: new Date().toISOString()
		});
	} catch (error) {
		console.error('Tables API error:', error);
		return json(
			{
				success: false,
				error: 'Failed to fetch tables data',
				message: error instanceof Error ? error.message : 'Unknown error'
			},
			{ status: 500 }
		);
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { action, tableId, data } = body;

		if (!action || !tableId) {
			return json(
				{
					success: false,
					error: 'Missing required parameters: action and tableId'
				},
				{ status: 400 }
			);
		}

		let result;
		switch (action) {
			// Basic table operations
			case 'updateStatus':
				result = await TableService.updateTableStatus(tableId, data.status, data.staffId);
				break;

			case 'startSession':
				result = await TableService.updateTableStatus(tableId, 'occupied', data.staffId);
				break;

			case 'endSession':
				result = await TableService.updateTableStatus(tableId, 'cleaning');
				break;

			case 'markAvailable':
				result = await TableService.updateTableStatus(tableId, 'available');
				break;

			case 'createReservation':
				result = await TableService.createReservation(tableId, data.reservationTime, data.customerName);
				break;

			case 'cancelReservation':
				result = await TableService.cancelReservation(tableId);
				break;

			case 'assignStaff':
				result = await TableService.assignStaff(tableId, data.staffId);
				break;

			// Advanced session lifecycle operations
			case 'startTableSession':
				result = await TableService.startTableSession(tableId, {
					customers: data.customers,
					staffId: data.staffId,
					customerName: data.customerName,
					notes: data.notes,
					reservationId: data.reservationId
				});
				break;

			case 'updateTableSession':
				result = await TableService.updateTableSession(tableId, {
					orders: data.orders,
					amount: data.amount,
					customers: data.customers,
					notes: data.notes
				});
				break;

			case 'endTableSession':
				result = await TableService.endTableSession(tableId, {
					paymentMethod: data.paymentMethod,
					paymentAmount: data.paymentAmount,
					tip: data.tip,
					finalAmount: data.finalAmount,
					staffId: data.staffId
				});
				break;

			// Cleaning and reset operations
			case 'markTableClean':
				result = await TableService.markTableClean(tableId, data.staffId);
				break;

			case 'requestCleaning':
				result = await TableService.requestTableCleaning(tableId, data.priority);
				break;

			case 'resetTable':
				result = await TableService.resetTable(tableId, data.reason);
				break;

			// Staff management operations
			case 'assignStaffToTables':
				result = await TableService.assignStaffToTables(data.staffId, data.tableIds);
				break;

			case 'transferTable':
				result = await TableService.transferTable(tableId, data.fromStaffId, data.toStaffId, data.reason);
				break;

			// Advanced table operations
			case 'mergeTables':
				result = await TableService.mergeTables(data.tableIds, data.newTableName);
				break;

			case 'splitTable':
				result = await TableService.splitTable(tableId);
				break;

			// Data operations
			case 'getHistory':
				result = await TableService.getTableHistory(tableId, data.limit);
				break;

			case 'getStaffWorkload':
				result = await TableService.getStaffWorkload(data.branchId);
				break;

			case 'getAvailableStaff':
				result = await TableService.getAvailableStaff(data.branchId);
				break;

			default:
				return json(
					{
						success: false,
						error: 'Invalid action',
						message: `Action '${action}' is not supported`
					},
					{ status: 400 }
				);
		}

		return json({
			success: true,
			data: result,
			action,
			timestamp: new Date().toISOString()
		});
	} catch (error) {
		console.error('Tables API POST error:', error);
		return json(
			{
				success: false,
				error: 'Failed to process table action',
				message: error instanceof Error ? error.message : 'Unknown error'
			},
			{ status: 500 }
		);
	}
};