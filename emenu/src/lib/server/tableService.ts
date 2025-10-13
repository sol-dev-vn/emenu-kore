import type { Table, Zone, TableMetrics, TableSession, Staff } from '$lib/types/table';

// Mock data - in real implementation, this would come from Directus API
const mockZones: Zone[] = [
	{
		id: 'zone-1',
		name: 'Main Dining',
		description: 'Primary dining area with window seats',
		color: '#10B981',
		tableCount: 12,
		capacity: 48,
		position: { x: 0, y: 0, width: 400, height: 300 }
	},
	{
		id: 'zone-2',
		name: 'VIP Room',
		description: 'Private dining area for special occasions',
		color: '#8B5CF6',
		tableCount: 6,
		capacity: 24,
		position: { x: 420, y: 0, width: 300, height: 300 }
	},
	{
		id: 'zone-3',
		name: 'Terrace',
		description: 'Outdoor seating with garden view',
		color: '#F59E0B',
		tableCount: 8,
		capacity: 32,
		position: { x: 0, y: 320, width: 350, height: 250 }
	},
	{
		id: 'zone-4',
		name: 'Bar Area',
		description: 'Casual seating at the bar',
		color: '#EF4444',
		tableCount: 4,
		capacity: 16,
		position: { x: 370, y: 320, width: 250, height: 250 }
	}
];

const mockStaff: Staff[] = [
	{ id: 'staff-1', firstName: 'Nguyen', lastName: 'Van A', email: 'nguyena@sol.vn', role: 'Waiter', isActive: true },
	{ id: 'staff-2', firstName: 'Tran', lastName: 'Thi B', email: 'tranb@sol.vn', role: 'Waiter', isActive: true },
	{ id: 'staff-3', firstName: 'Le', lastName: 'Van C', email: 'lec@sol.vn', role: 'Waiter', isActive: true },
	{ id: 'staff-4', firstName: 'Pham', lastName: 'Thi D', email: 'phamd@sol.vn', role: 'Host', isActive: true }
];

function generateMockTables(): Table[] {
	const tables: Table[] = [];
	const statuses: Table['status'][] = ['available', 'occupied', 'reserved', 'cleaning', 'maintenance'];
	const now = new Date();

	let tableNumber = 1;

	mockZones.forEach(zone => {
		for (let i = 0; i < zone.tableCount; i++) {
			const status = statuses[Math.floor(Math.random() * statuses.length)];
			const capacity = [2, 4, 6, 8][Math.floor(Math.random() * 4)];

			const table: Table = {
				id: `table-${tableNumber}`,
				number: tableNumber,
				name: `${zone.name} Table ${tableNumber}`,
				capacity,
				zone: zone.id,
				status,
				position: {
					x: Math.random() * 300,
					y: Math.random() * 200,
					width: 60 + Math.random() * 40,
					height: 60 + Math.random() * 40
				},
				createdAt: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
				updatedAt: new Date().toISOString()
			};

			// Add current session for occupied tables
			if (status === 'occupied') {
				const duration = Math.floor(Math.random() * 120) + 30; // 30-150 minutes
				table.currentSession = {
					id: `session-${tableNumber}`,
					tableId: table.id,
					startTime: new Date(now.getTime() - duration * 60 * 1000).toISOString(),
					duration,
					status: 'active',
					orders: Math.floor(Math.random() * 10) + 1,
					amount: Math.floor(Math.random() * 2000000) + 500000,
					customers: Math.floor(Math.random() * capacity) + 1,
					staff: mockStaff[Math.floor(Math.random() * mockStaff.length)]
				};
			}

			// Add reservation time for reserved tables
			if (status === 'reserved') {
				const reservationMinutes = Math.floor(Math.random() * 60) + 15;
				table.reservationTime = new Date(now.getTime() + reservationMinutes * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
			}

			// Add staff assignment for some tables
			if (Math.random() > 0.6) {
				table.staff = mockStaff[Math.floor(Math.random() * mockStaff.length)];
			}

			tables.push(table);
			tableNumber++;
		}
	});

	return tables;
}

let mockTables = generateMockTables();

export class TableService {
	// Get all tables
	static async getTables(branchId?: string): Promise<Table[]> {
		// In real implementation, this would be:
		// const tables = await directus.request(
		//   readItems('tables', {
		//     filter: { branch: { _eq: branchId } },
		//     fields: ['*', { 'staff': ['*'] }, { 'zone': ['*'] }]
		//   })
		// );

		return mockTables;
	}

	// Get table by ID
	static async getTable(tableId: string): Promise<Table | null> {
		const table = mockTables.find(t => t.id === tableId);
		return table || null;
	}

	// Update table status
	static async updateTableStatus(tableId: string, status: Table['status'], staffId?: string): Promise<Table> {
		const tableIndex = mockTables.findIndex(t => t.id === tableId);
		if (tableIndex === -1) {
			throw new Error(`Table ${tableId} not found`);
		}

		const table = mockTables[tableIndex];
		const previousStatus = table.status;
		table.status = status;
		table.updatedAt = new Date().toISOString();

		// Handle status-specific logic
		if (status === 'occupied' && previousStatus !== 'occupied') {
			// Start new session
			table.currentSession = {
				id: `session-${Date.now()}`,
				tableId: table.id,
				startTime: new Date().toISOString(),
				duration: 0,
				status: 'active',
				orders: 0,
				amount: 0,
				customers: 1,
				staff: staffId ? mockStaff.find(s => s.id === staffId) || mockStaff[0] : mockStaff[0]
			};
		} else if (status !== 'occupied' && previousStatus === 'occupied') {
			// End current session
			if (table.currentSession) {
				table.currentSession.endTime = new Date().toISOString();
				table.currentSession.status = 'completed';
			}
		}

		// Assign staff if provided
		if (staffId) {
			table.staff = mockStaff.find(s => s.id === staffId);
		}

		mockTables[tableIndex] = table;
		return table;
	}

	// Get all zones
	static async getZones(branchId?: string): Promise<Zone[]> {
		// In real implementation:
		// const zones = await directus.request(
		//   readItems('zones', {
		//     filter: { branch: { _eq: branchId } }
		//   })
		// );

		return mockZones;
	}

	// Get table metrics
	static async getTableMetrics(branchId?: string): Promise<TableMetrics> {
		const tables = mockTables;
		const occupiedTables = tables.filter(t => t.status === 'occupied');
		const totalRevenue = occupiedTables.reduce((sum, table) =>
			sum + (table.currentSession?.amount || 0), 0
		);

		const totalSessions = occupiedTables.filter(t => t.currentSession);
		const averageDuration = totalSessions.length > 0
			? totalSessions.reduce((sum, table) => sum + (table.currentSession?.duration || 0), 0) / totalSessions.length
			: 0;

		return {
			totalTables: tables.length,
			availableTables: tables.filter(t => t.status === 'available').length,
			occupiedTables: occupiedTables.length,
			reservedTables: tables.filter(t => t.status === 'reserved').length,
			cleaningTables: tables.filter(t => t.status === 'cleaning').length,
			maintenanceTables: tables.filter(t => t.status === 'maintenance').length,
			occupancyRate: (occupiedTables.length / tables.length) * 100,
			averageSessionDuration: Math.round(averageDuration),
			totalRevenue,
			activeStaff: new Set(tables.map(t => t.staff?.id).filter(Boolean)).size
		};
	}

	// Create table reservation
	static async createReservation(tableId: string, reservationTime: string, customerName?: string): Promise<Table> {
		const table = await this.getTable(tableId);
		if (!table) {
			throw new Error(`Table ${tableId} not found`);
		}

		if (table.status !== 'available') {
			throw new Error(`Table ${tableId} is not available for reservation`);
		}

		return await this.updateTableStatus(tableId, 'reserved');
	}

	// Cancel reservation
	static async cancelReservation(tableId: string): Promise<Table> {
		const table = await this.getTable(tableId);
		if (!table) {
			throw new Error(`Table ${tableId} not found`);
		}

		if (table.status !== 'reserved') {
			throw new Error(`Table ${tableId} is not reserved`);
		}

		return await this.updateTableStatus(tableId, 'available');
	}

	// Assign staff to table
	static async assignStaff(tableId: string, staffId: string): Promise<Table> {
		const table = await this.getTable(tableId);
		if (!table) {
			throw new Error(`Table ${tableId} not found`);
		}

		const tableIndex = mockTables.findIndex(t => t.id === tableId);
		const staff = mockStaff.find(s => s.id === staffId);

		if (!staff) {
			throw new Error(`Staff ${staffId} not found`);
		}

		mockTables[tableIndex].staff = staff;
		mockTables[tableIndex].updatedAt = new Date().toISOString();

		return mockTables[tableIndex];
	}

	// Search and filter tables
	static async searchTables(query: string, filters?: {
		status?: Table['status'][];
		zone?: string[];
		capacity?: { min?: number; max?: number };
	}): Promise<Table[]> {
		let filteredTables = mockTables;

		// Apply text search
		if (query) {
			const searchTerm = query.toLowerCase();
			filteredTables = filteredTables.filter(table =>
				table.number.toString().includes(searchTerm) ||
				(table.name && table.name.toLowerCase().includes(searchTerm))
			);
		}

		// Apply status filter
		if (filters?.status?.length) {
			filteredTables = filteredTables.filter(table =>
				filters.status!.includes(table.status)
			);
		}

		// Apply zone filter
		if (filters?.zone?.length) {
			filteredTables = filteredTables.filter(table =>
				table.zone && filters.zone!.includes(table.zone)
			);
		}

		// Apply capacity filter
		if (filters?.capacity) {
			filteredTables = filteredTables.filter(table => {
				if (filters.capacity!.min !== undefined && table.capacity < filters.capacity!.min) {
					return false;
				}
				if (filters.capacity!.max !== undefined && table.capacity > filters.capacity!.max) {
					return false;
				}
				return true;
			});
		}

		return filteredTables;
	}

	// Get available tables for time slot
	static async getAvailableTables(startTime: string, endTime: string, partySize: number): Promise<Table[]> {
		// In real implementation, this would check reservations and existing sessions
		return mockTables.filter(table =>
			table.status === 'available' &&
			table.capacity >= partySize
		);
	}

	// === TABLE SESSION LIFECYCLE MANAGEMENT ===

	// Start table session with comprehensive workflow
	static async startTableSession(tableId: string, sessionData: {
		customers: number;
		staffId: string;
		customerName?: string;
		notes?: string;
		reservationId?: string;
	}): Promise<{ table: Table; session: TableSession }> {
		const table = await this.getTable(tableId);
		if (!table) {
			throw new Error(`Table ${tableId} not found`);
		}

		if (table.status !== 'available') {
			throw new Error(`Table ${tableId} is not available. Current status: ${table.status}`);
		}

		const staff = mockStaff.find(s => s.id === sessionData.staffId);
		if (!staff) {
			throw new Error(`Staff ${sessionData.staffId} not found`);
		}

		// Create new session
		const session: TableSession = {
			id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
			tableId: table.id,
			startTime: new Date().toISOString(),
			duration: 0,
			status: 'active',
			orders: 0,
			amount: 0,
			customers: sessionData.customers,
			staff,
			customerName: sessionData.customerName,
			notes: sessionData.notes,
			reservationId: sessionData.reservationId
		};

		// Update table status and session
		const tableIndex = mockTables.findIndex(t => t.id === tableId);
		mockTables[tableIndex].status = 'occupied';
		mockTables[tableIndex].currentSession = session;
		mockTables[tableIndex].staff = staff;
		mockTables[tableIndex].updatedAt = new Date().toISOString();

		// Clear any existing reservation
		mockTables[tableIndex].reservationTime = undefined;

		return { table: mockTables[tableIndex], session };
	}

	// Update table session (order updates, duration tracking, etc.)
	static async updateTableSession(tableId: string, sessionUpdates: {
		orders?: number;
		amount?: number;
		customers?: number;
		notes?: string;
	}): Promise<TableSession> {
		const table = await this.getTable(tableId);
		if (!table || !table.currentSession) {
			throw new Error(`No active session found for table ${tableId}`);
		}

		const session = table.currentSession;

		// Update session fields
		if (sessionUpdates.orders !== undefined) {
			session.orders = sessionUpdates.orders;
		}
		if (sessionUpdates.amount !== undefined) {
			session.amount = sessionUpdates.amount;
		}
		if (sessionUpdates.customers !== undefined) {
			session.customers = sessionUpdates.customers;
		}
		if (sessionUpdates.notes !== undefined) {
			session.notes = sessionUpdates.notes;
		}

		// Recalculate duration
		const startTime = new Date(session.startTime);
		const now = new Date();
		session.duration = Math.floor((now.getTime() - startTime.getTime()) / 60000); // minutes

		// Update table
		const tableIndex = mockTables.findIndex(t => t.id === tableId);
		mockTables[tableIndex].currentSession = session;
		mockTables[tableIndex].updatedAt = new Date().toISOString();

		return session;
	}

	// End table session with payment processing workflow
	static async endTableSession(tableId: string, endData: {
		paymentMethod?: string;
		paymentAmount?: number;
		tip?: number;
		finalAmount?: number;
		staffId?: string;
	}): Promise<{ table: Table; completedSession: TableSession }> {
		const table = await this.getTable(tableId);
		if (!table || !table.currentSession) {
			throw new Error(`No active session found for table ${tableId}`);
		}

		const session = table.currentSession;
		const now = new Date();

		// Update session completion data
		session.endTime = now.toISOString();
		session.status = 'completed';
		session.duration = Math.floor((now.getTime() - new Date(session.startTime).getTime()) / 60000);

		// Add payment details if provided
		if (endData.paymentMethod) {
			session.paymentMethod = endData.paymentMethod;
		}
		if (endData.paymentAmount) {
			session.paymentAmount = endData.paymentAmount;
		}
		if (endData.tip) {
			session.tip = endData.tip;
		}
		if (endData.finalAmount) {
			session.amount = endData.finalAmount;
		}

		// Update table status to cleaning
		const tableIndex = mockTables.findIndex(t => t.id === tableId);
		mockTables[tableIndex].status = 'cleaning';
		mockTables[tableIndex].currentSession = session;
		mockTables[tableIndex].updatedAt = now.toISOString();

		// Assign cleaning staff if different from service staff
		if (endData.staffId && endData.staffId !== session.staff.id) {
			const cleaningStaff = mockStaff.find(s => s.id === endData.staffId);
			if (cleaningStaff) {
				mockTables[tableIndex].staff = cleaningStaff;
				mockTables[tableIndex].cleaningStaff = cleaningStaff;
			}
		}

		return { table: mockTables[tableIndex], completedSession: session };
	}

	// === TABLE CLEANING AND RESET WORKFLOWS ===

	// Mark table as clean and available
	static async markTableClean(tableId: string, staffId?: string): Promise<Table> {
		const table = await this.getTable(tableId);
		if (!table) {
			throw new Error(`Table ${tableId} not found`);
		}

		if (table.status !== 'cleaning') {
			throw new Error(`Table ${tableId} is not in cleaning status. Current status: ${table.status}`);
		}

		const tableIndex = mockTables.findIndex(t => t.id === tableId);

		// Update table status
		mockTables[tableIndex].status = 'available';
		mockTables[tableIndex].currentSession = undefined;
		mockTables[tableIndex].cleaningStaff = undefined;
		mockTables[tableIndex].updatedAt = new Date().toISOString();

		// Update staff if provided
		if (staffId) {
			const staff = mockStaff.find(s => s.id === staffId);
			if (staff) {
				mockTables[tableIndex].staff = staff;
			}
		}

		return mockTables[tableIndex];
	}

	// Request table cleaning
	static async requestTableCleaning(tableId: string, priority: 'normal' | 'urgent' = 'normal'): Promise<Table> {
		const table = await this.getTable(tableId);
		if (!table) {
			throw new Error(`Table ${tableId} not found`);
		}

		const tableIndex = mockTables.findIndex(t => t.id === tableId);

		// Set to cleaning status with priority timestamp
		mockTables[tableIndex].status = 'cleaning';
		mockTables[tableIndex].cleaningPriority = priority;
		mockTables[tableIndex].cleaningRequestedAt = new Date().toISOString();
		mockTables[tableIndex].updatedAt = new Date().toISOString();

		return mockTables[tableIndex];
	}

	// Reset table to available (force reset)
	static async resetTable(tableId: string, reason?: string): Promise<Table> {
		const table = await this.getTable(tableId);
		if (!table) {
			throw new Error(`Table ${tableId} not found`);
		}

		const tableIndex = mockTables.findIndex(t => t.id === tableId);

		// Clear all session data
		mockTables[tableIndex].status = 'available';
		mockTables[tableIndex].currentSession = undefined;
		mockTables[tableIndex].reservationTime = undefined;
		mockTables[tableIndex].cleaningStaff = undefined;
		mockTables[tableIndex].cleaningPriority = undefined;
		mockTables[tableIndex].cleaningRequestedAt = undefined;
		mockTables[tableIndex].updatedAt = new Date().toISOString();

		if (reason) {
			mockTables[tableIndex].resetReason = reason;
		}

		return mockTables[tableIndex];
	}

	// === STAFF ASSIGNMENT AND MANAGEMENT WORKFLOWS ===

	// Assign staff member to multiple tables
	static async assignStaffToTables(staffId: string, tableIds: string[]): Promise<{ assigned: string[]; failed: string[] }> {
		const staff = mockStaff.find(s => s.id === staffId);
		if (!staff) {
			throw new Error(`Staff ${staffId} not found`);
		}

		const assigned: string[] = [];
		const failed: string[] = [];

		for (const tableId of tableIds) {
			try {
				await this.assignStaff(tableId, staffId);
				assigned.push(tableId);
			} catch (error) {
				failed.push(tableId);
			}
		}

		return { assigned, failed };
	}

	// Get staff workload and assignment statistics
	static async getStaffWorkload(branchId?: string): Promise<Array<{
		staff: Staff;
		activeTables: number;
		totalSessions: number;
		totalRevenue: number;
		averageSessionTime: number;
	}>> {
		const workloadMap = new Map<string, {
			activeTables: number;
			totalSessions: number;
			totalRevenue: number;
			totalDuration: number;
			sessionCount: number;
		}>();

		// Calculate workload for each staff member
		mockTables.forEach(table => {
			if (table.staff) {
				const staffId = table.staff.id;
				if (!workloadMap.has(staffId)) {
					workloadMap.set(staffId, {
						activeTables: 0,
						totalSessions: 0,
						totalRevenue: 0,
						totalDuration: 0,
						sessionCount: 0
					});
				}

				const workload = workloadMap.get(staffId)!;

				// Count active tables
				if (table.status === 'occupied' || table.status === 'reserved') {
					workload.activeTables++;
				}

				// Count sessions and revenue
				if (table.currentSession) {
					workload.totalSessions++;
					workload.totalRevenue += table.currentSession.amount;
					workload.totalDuration += table.currentSession.duration;
					workload.sessionCount++;
				}
			}
		});

		// Transform to result array
		return Array.from(workloadMap.entries()).map(([staffId, workload]) => {
			const staff = mockStaff.find(s => s.id === staffId)!;
			return {
				staff,
				activeTables: workload.activeTables,
				totalSessions: workload.totalSessions,
				totalRevenue: workload.totalRevenue,
				averageSessionTime: workload.sessionCount > 0
					? Math.round(workload.totalDuration / workload.sessionCount)
					: 0
			};
		});
	}

	// Get available staff for assignment
	static async getAvailableStaff(branchId?: string): Promise<Staff[]> {
		// In real implementation, this would consider staff schedules, breaks, etc.
		return mockStaff.filter(staff => staff.isActive);
	}

	// === TABLE OPERATIONS HISTORY AND AUDIT ===

	// Get table operation history
	static async getTableHistory(tableId: string, limit: number = 50): Promise<Array<{
		timestamp: string;
		action: string;
		staff?: Staff;
		details: any;
	}>> {
		// Mock implementation - in real system this would come from database
		const table = await this.getTable(tableId);
		if (!table) {
			throw new Error(`Table ${tableId} not found`);
		}

		// Generate mock history based on current state
		const history = [];
		const now = new Date();

		// Session start
		if (table.currentSession) {
			history.push({
				timestamp: table.currentSession.startTime,
				action: 'session_started',
				staff: table.currentSession.staff,
				details: {
					customers: table.currentSession.customers,
					sessionId: table.currentSession.id
				}
			});
		}

		// Staff assignment
		if (table.staff) {
			history.push({
				timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
				action: 'staff_assigned',
				staff: table.staff,
				details: { staffId: table.staff.id }
			});
		}

		// Table reset
		history.push({
			timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(), // yesterday
			action: 'table_reset',
			details: { reason: 'daily_reset' }
		});

		return history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, limit);
	}

	// === ADVANCED TABLE OPERATIONS ===

	// Transfer table to different staff
	static async transferTable(tableId: string, fromStaffId: string, toStaffId: string, reason?: string): Promise<Table> {
		const table = await this.getTable(tableId);
		if (!table) {
			throw new Error(`Table ${tableId} not found`);
		}

		if (table.staff?.id !== fromStaffId) {
			throw new Error(`Table ${tableId} is not assigned to staff ${fromStaffId}`);
		}

		const toStaff = mockStaff.find(s => s.id === toStaffId);
		if (!toStaff) {
			throw new Error(`Target staff ${toStaffId} not found`);
		}

		// Update table staff assignment
		const tableIndex = mockTables.findIndex(t => t.id === tableId);
		mockTables[tableIndex].staff = toStaff;
		mockTables[tableIndex].updatedAt = new Date().toISOString();

		// Update current session if exists
		if (mockTables[tableIndex].currentSession) {
			mockTables[tableIndex].currentSession!.staff = toStaff;
		}

		// Add transfer note
		if (reason) {
			mockTables[tableIndex].transferNote = reason;
		}

		return mockTables[tableIndex];
	}

	// Merge tables (for large parties)
	static async mergeTables(tableIds: string[], newTableName?: string): Promise<Table> {
		if (tableIds.length < 2) {
			throw new Error('At least 2 tables are required for merging');
		}

		// Get all tables and verify they're available
		const tables = await Promise.all(tableIds.map(id => this.getTable(id)));
		const validTables = tables.filter(t => t && t.status === 'available');

		if (validTables.length !== tableIds.length) {
			throw new Error('All tables must be available for merging');
		}

		// Use the first table as the primary table
		const primaryTable = validTables[0]!;
		const totalCapacity = validTables.reduce((sum, table) => sum + table.capacity, 0);

		// Update primary table
		const tableIndex = mockTables.findIndex(t => t.id === primaryTable.id);
		mockTables[tableIndex].capacity = totalCapacity;
		mockTables[tableIndex].name = newTableName || `Merged Table (${tableIds.join(', ')})`;
		mockTables[tableIndex].mergedTables = tableIds;
		mockTables[tableIndex].updatedAt = new Date().toISOString();

		// Mark other tables as unavailable
		tableIds.slice(1).forEach(tableId => {
			const otherTableIndex = mockTables.findIndex(t => t.id === tableId);
			if (otherTableIndex !== -1) {
				mockTables[otherTableIndex].status = 'maintenance';
				mockTables[otherTableIndex].mergedInto = primaryTable.id;
				mockTables[otherTableIndex].updatedAt = new Date().toISOString();
			}
		});

		return mockTables[tableIndex];
	}

	// Split merged table
	static async splitTable(tableId: string): Promise<Table[]> {
		const table = await this.getTable(tableId);
		if (!table || !table.mergedTables) {
			throw new Error(`Table ${tableId} is not a merged table`);
		}

		// Restore original tables
		const restoredTables: Table[] = [];

		// Update primary table back to original state
		const tableIndex = mockTables.findIndex(t => t.id === tableId);
		mockTables[tableIndex].mergedTables = undefined;
		mockTables[tableIndex].capacity = Math.floor(mockTables[tableIndex].capacity / table.mergedTables.length);
		mockTables[tableIndex].updatedAt = new Date().toISOString();
		restoredTables.push(mockTables[tableIndex]);

		// Restore other tables
		table.mergedTables.slice(1).forEach(mergedTableId => {
			const otherTableIndex = mockTables.findIndex(t => t.id === mergedTableId);
			if (otherTableIndex !== -1) {
				mockTables[otherTableIndex].status = 'available';
				mockTables[otherTableIndex].mergedInto = undefined;
				mockTables[otherTableIndex].capacity = Math.floor(mockTables[tableIndex].capacity / table.mergedTables.length);
				mockTables[otherTableIndex].updatedAt = new Date().toISOString();
				restoredTables.push(mockTables[otherTableIndex]);
			}
		});

		return restoredTables;
	}
}

export default TableService;