import type { Table, TableSession, TableMetrics } from '$lib/types/table';

export interface TableSyncEvent {
	type: 'table_update' | 'session_update' | 'metrics_update' | 'connection';
	data: any;
	timestamp: string;
}

export interface TableSyncOptions {
	branchId: string;
	userId: string;
	autoReconnect?: boolean;
	reconnectInterval?: number;
	enablePolling?: boolean;
	pollingInterval?: number;
}

class TableSyncClient {
	private ws: WebSocket | null = null;
	private options: Required<TableSyncOptions>;
	private isConnecting = false;
	private isConnected = false;
	private reconnectAttempts = 0;
	private maxReconnectAttempts = 5;
	private pollingInterval: NodeJS.Timeout | null = null;
	private eventListeners = new Map<string, Set<(event: TableSyncEvent) => void>>();

	constructor(options: TableSyncOptions) {
		this.options = {
			...options,
			autoReconnect: true,
			reconnectInterval: 3000,
			enablePolling: false,
			pollingInterval: 15000
		};
	}

	// Connect to WebSocket server
	async connect(): Promise<void> {
		if (this.isConnecting || this.isConnected) {
			return;
		}

		this.isConnecting = true;

		try {
			// In a real implementation, this would connect to the actual WebSocket server
			// For now, we'll simulate the connection
			await this.simulateConnection();
		} catch (error) {
			console.error('Failed to connect to WebSocket:', error);
			this.isConnecting = false;

			if (this.options.autoReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
				setTimeout(() => {
					this.reconnectAttempts++;
					this.connect();
				}, this.options.reconnectInterval);
			}
		}
	}

	// Simulate WebSocket connection (for demo purposes)
	private async simulateConnection(): Promise<void> {
		return new Promise((resolve) => {
			// Simulate connection delay
			setTimeout(() => {
				this.isConnected = true;
				this.isConnecting = false;
				this.reconnectAttempts = 0;

				// Emit connection event
				this.emit({
					type: 'connection',
					data: { connected: true, branchId: this.options.branchId },
					timestamp: new Date().toISOString()
				});

				// Start polling if enabled
				if (this.options.enablePolling) {
					this.startPolling();
				}

				console.log('Connected to table sync service');
				resolve();
			}, 1000);
		});
	}

	// Disconnect from WebSocket server
	disconnect(): void {
		if (this.ws) {
			this.ws.close();
			this.ws = null;
		}

		if (this.pollingInterval) {
			clearInterval(this.pollingInterval);
			this.pollingInterval = null;
		}

		this.isConnected = false;
		this.isConnecting = false;
		this.reconnectAttempts = 0;

		console.log('Disconnected from table sync service');
	}

	// Start HTTP polling as fallback
	private startPolling(): void {
		if (this.pollingInterval) {
			clearInterval(this.pollingInterval);
		}

		this.pollingInterval = setInterval(async () => {
			await this.pollForUpdates();
		}, this.options.pollingInterval);
	}

	// Poll for updates via HTTP API
	private async pollForUpdates(): Promise<void> {
		try {
			const response = await fetch(`/api/tables?branch=${this.options.branchId}&t=${Date.now()}`);
			const result = await response.json();

			if (result.success) {
				// Emit metrics update
				this.emit({
					type: 'metrics_update',
					data: result.data.metrics,
					timestamp: new Date().toISOString()
				});

				// Check for table updates (in real implementation, we'd compare timestamps)
				// For now, we'll just emit that data was refreshed
				console.log('Polled for table updates');
			}
		} catch (error) {
			console.error('Failed to poll for updates:', error);
		}
	}

	// Send WebSocket message
	private send(message: any): void {
		if (this.ws && this.ws.readyState === WebSocket.OPEN) {
			this.ws.send(JSON.stringify(message));
		}
	}

	// Subscribe to specific updates
	subscribe(subscriptions: string[]): void {
		this.send({
			type: 'subscribe',
			data: { subscriptions },
			timestamp: new Date().toISOString()
		});
	}

	// Unsubscribe from specific updates
	unsubscribe(subscriptions: string[]): void {
		this.send({
			type: 'unsubscribe',
			data: { subscriptions },
			timestamp: new Date().toISOString()
		});
	}

	// Add event listener
	on(event: string, callback: (event: TableSyncEvent) => void): () => void {
		if (!this.eventListeners.has(event)) {
			this.eventListeners.set(event, new Set());
		}
		this.eventListeners.get(event)!.add(callback);

		// Return unsubscribe function
		return () => {
			const listeners = this.eventListeners.get(event);
			if (listeners) {
				listeners.delete(callback);
				if (listeners.size === 0) {
					this.eventListeners.delete(event);
				}
			}
		};
	}

	// Emit event to listeners
	private emit(event: TableSyncEvent): void {
		const listeners = this.eventListeners.get(event.type);
		if (listeners) {
			listeners.forEach(callback => {
				try {
					callback(event);
				} catch (error) {
					console.error('Error in event listener:', error);
				}
			});
		}
	}

	// Handle WebSocket messages
	private handleWebSocketMessage(message: any): void {
		switch (message.type) {
			case 'table_update':
				this.emit({
					type: 'table_update',
					data: message.data,
					timestamp: message.timestamp
				});
				break;

			case 'session_update':
				this.emit({
					type: 'session_update',
					data: message.data,
					timestamp: message.timestamp
				});
				break;

			case 'metrics_update':
				this.emit({
					type: 'metrics_update',
					data: message.data,
					timestamp: message.timestamp
				});
				break;

			case 'ping':
				// Respond to ping
				this.send({
					type: 'pong',
					data: { timestamp: new Date().toISOString() },
					timestamp: new Date().toISOString()
				});
				break;

			case 'pong':
				// Server received our ping
				break;

			default:
				console.log('Unhandled WebSocket message:', message.type);
		}
	}

	// Get connection status
	getStatus(): {
		isConnected: boolean;
		isConnecting: boolean;
		branchId: string;
		reconnectAttempts: number;
	} {
		return {
			isConnected: this.isConnected,
			isConnecting: this.isConnecting,
			branchId: this.options.branchId,
			reconnectAttempts: this.reconnectAttempts
		};
	}

	// Send table action to server
	sendTableAction(tableId: string, action: string, data?: any): void {
		this.send({
			type: 'table_action',
			data: { tableId, action, data },
			timestamp: new Date().toISOString()
		});
	}
}

// Singleton instance for table sync
let tableSyncClient: TableSyncClient | null = null;

export function getTableSyncClient(options?: TableSyncOptions): TableSyncClient {
	if (!tableSyncClient) {
		// Get user and branch info from current session
		const defaultOptions: TableSyncOptions = {
			branchId: 'branch-1',
			userId: 'user-1'
		};

		tableSyncClient = new TableSyncClient({ ...defaultOptions, ...options });
	}

	return tableSyncClient;
}

// Reactive store for table synchronization
import { writable, derived } from 'svelte/store';

export const tableSyncStore = writable<{
	client: TableSyncClient | null;
	isConnected: boolean;
	lastUpdate: string | null;
	error: string | null;
}>({
	client: null,
	isConnected: false,
	lastUpdate: null,
	error: null
});

// Helper to initialize table sync in Svelte components
export function initializeTableSync(options: TableSyncOptions) {
	const client = getTableSyncClient(options);

	// Set up event listeners
	client.on('connection', (event) => {
		tableSyncStore.update(store => ({
			...store,
			isConnected: true,
			lastUpdate: event.timestamp,
			error: null
		}));
	});

	client.on('table_update', (event) => {
		tableSyncStore.update(store => ({
			...store,
			lastUpdate: event.timestamp
		}));
	});

	client.on('session_update', (event) => {
		tableSyncStore.update(store => ({
			...store,
			lastUpdate: event.timestamp
		}));
	});

	client.on('metrics_update', (event) => {
		tableSyncStore.update(store => ({
			...store,
			lastUpdate: event.timestamp
		}));
	});

	// Connect to the sync service
	client.connect().catch(error => {
		console.error('Failed to initialize table sync:', error);
		tableSyncStore.update(store => ({
			...store,
			error: error.message
		}));
	});

	// Update store with client instance
	tableSyncStore.update(store => ({
		...store,
		client
	}));

	return client;
}

export default TableSyncClient;