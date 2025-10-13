export interface Table {
	id: string;
	number: number;
	name?: string;
	capacity: number;
	zone: string | null;
	status: 'available' | 'occupied' | 'reserved' | 'cleaning' | 'maintenance';
	position: {
		x: number;
		y: number;
		width?: number;
		height?: number;
	};
	currentSession?: TableSession;
	reservationTime?: string;
	staff?: Staff;
	cleaningStaff?: Staff;
	cleaningPriority?: 'normal' | 'urgent';
	cleaningRequestedAt?: string;
	resetReason?: string;
	transferNote?: string;
	mergedTables?: string[]; // IDs of tables that were merged into this table
	mergedInto?: string; // ID of table this table was merged into
	createdAt: string;
	updatedAt: string;
}

export interface TableSession {
	id: string;
	tableId: string;
	startTime: string;
	endTime?: string;
	duration: number; // in minutes
	status: 'active' | 'completed' | 'cancelled';
	orders: number;
	amount: number;
	customers: number;
	staff: Staff;
	items?: OrderItem[];
	customerName?: string;
	notes?: string;
	reservationId?: string;
	paymentMethod?: string;
	paymentAmount?: number;
	tip?: number;
}

export interface OrderItem {
	id: string;
	name: string;
	quantity: number;
	price: number;
	status: 'ordered' | 'preparing' | 'ready' | 'served' | 'cancelled';
}

export interface Staff {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	role: string;
	avatar?: string;
	isActive: boolean;
}

export interface Zone {
	id: string;
	name: string;
	description?: string;
	color: string;
	tableCount: number;
	capacity: number;
	position?: {
		x: number;
		y: number;
		width?: number;
		height?: number;
	};
}

export interface TableOperation {
	type: 'status_change' | 'session_start' | 'session_end' | 'reservation' | 'assignment' | 'cleaning_request' | 'table_reset' | 'staff_transfer' | 'table_merge' | 'table_split';
	tableId: string;
	previousStatus?: string;
	newStatus?: string;
	staffId?: string;
	timestamp: string;
	note?: string;
	details?: any;
}

export interface TableHistoryEntry {
	timestamp: string;
	action: string;
	staff?: Staff;
	details: any;
}

export interface StaffWorkload {
	staff: Staff;
	activeTables: number;
	totalSessions: number;
	totalRevenue: number;
	averageSessionTime: number;
}

export interface TableMetrics {
	totalTables: number;
	availableTables: number;
	occupiedTables: number;
	reservedTables: number;
	cleaningTables: number;
	maintenanceTables: number;
	occupancyRate: number;
	averageSessionDuration: number;
	totalRevenue: number;
	activeStaff: number;
}