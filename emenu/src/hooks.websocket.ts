import { WebSocketManager } from '$lib/server/websocketManager';
import type { Table, TableSession } from '$lib/types/table';

export const handleWebSocket = async (request: Request) => {
	const url = new URL(request.url);
	const userId = url.searchParams.get('userId');
	const branchId = url.searchParams.get('branch');

	if (!userId || !branchId) {
		return new Response('Missing userId or branchId parameter', { status: 400 });
	}

	// Upgrade HTTP connection to WebSocket
	return new Response(null, {
		status: 101,
		headers: {
			'Upgrade': 'websocket',
			'Connection': 'Upgrade',
			'Sec-WebSocket-Key': request.headers.get('Sec-WebSocket-Key'),
			'Sec-WebSocket-Protocol': request.headers.get('Sec-WebSocket-Protocol')
		}
	});
};

// WebSocket server implementation (would be integrated with SvelteKit's WebSocket handling)
export class WebSocketServer {
	private wsManager: WebSocketManager;
	private port: number;

	constructor(port: number = 8080) {
		this.wsManager = WebSocketManager.getInstance();
		this.port = port;
	}

	async start(): Promise<void> {
		// In a real implementation, this would set up a WebSocket server
		// For now, this is a placeholder that shows the structure
		console.log(`WebSocket server would start on port ${this.port}`);
		console.log('WebSocket Manager initialized for real-time table updates');
	}

	// Simulate real-time table updates (for demo purposes)
	startSimulatedUpdates(): void {
		// Simulate table status changes every 30 seconds
		setInterval(() => {
			this.simulateTableUpdate();
		}, 30000);

		// Simulate session updates every 15 seconds
		setInterval(() => {
			this.simulateSessionUpdate();
		}, 15000);
	}

	private simulateTableUpdate(): void {
		// This would be triggered by actual table operations
		// For demo purposes, we're simulating random updates
		const mockTable: Table = {
			id: `table-${Math.floor(Math.random() * 24) + 1}`,
			number: Math.floor(Math.random() * 24) + 1,
			capacity: [2, 4, 6, 8][Math.floor(Math.random() * 4)],
			zone: `zone-${Math.floor(Math.random() * 4) + 1}`,
			status: ['available', 'occupied', 'reserved', 'cleaning'][Math.floor(Math.random() * 4)] as Table['status'],
			position: { x: Math.random() * 300, y: Math.random() * 200 },
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};

		const mockOperation: any = {
			type: 'status_change',
			tableId: mockTable.id,
			previousStatus: 'available',
			newStatus: mockTable.status,
			timestamp: new Date().toISOString()
		};

		// Notify all connected clients
		this.wsManager.notifyTableUpdate(mockTable, mockOperation, 'branch-1');
	}

	private simulateSessionUpdate(): void {
		// Simulate session progress updates
		const mockSession: TableSession = {
			id: `session-${Date.now()}`,
			tableId: `table-${Math.floor(Math.random() * 24) + 1}`,
			startTime: new Date(Date.now() - Math.random() * 7200000).toISOString(), // Random time in last 2 hours
			duration: Math.floor(Math.random() * 120) + 30, // 30-150 minutes
			status: 'active',
			orders: Math.floor(Math.random() * 15) + 1,
			amount: Math.floor(Math.random() * 3000000) + 500000,
			customers: Math.floor(Math.random() * 6) + 1,
			staff: {
				id: 'staff-1',
				firstName: 'Staff',
				lastName: 'Member',
				email: 'staff@sol.vn',
				role: 'Waiter',
				isActive: true
			}
		};

		this.wsManager.notifySessionUpdate(mockSession, mockSession.tableId, 'branch-1');
	}

	// Handle real table operations (these would be called by the API endpoints)
	handleTableStatusChange(table: Table, operation: any): void {
		this.wsManager.notifyTableUpdate(table, operation, 'branch-1');
	}

	handleSessionUpdate(session: TableSession, tableId: string): void {
		this.wsManager.notifySessionUpdate(session, tableId, 'branch-1');
	}

	handleMetricsUpdate(metrics: any): void {
		this.wsManager.notifyMetricsUpdate(metrics, 'branch-1');
	}

	// Get connection statistics
	getStats() {
		return this.wsManager.getStats();
	}
}

// Singleton instance
let wsServer: WebSocketServer | null = null;

export function getWebSocketServer(): WebSocketServer {
	if (!wsServer) {
		wsServer = new WebSocketServer();
	}
	return wsServer;
}