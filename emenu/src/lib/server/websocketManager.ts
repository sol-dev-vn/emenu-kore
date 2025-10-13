import type { Table, TableSession, TableOperation } from '$lib/types/table';

export interface WebSocketMessage {
	type: 'table_update' | 'session_update' | 'metrics_update' | 'connection_ack';
	data: any;
	timestamp: string;
	branchId: string;
}

export interface WebSocketClient {
	id: string;
	userId: string;
	branchId: string;
	socket: WebSocket;
	lastPing: number;
	subscriptions: Set<string>;
}

class WebSocketManager {
	private static instance: WebSocketManager;
	private clients = new Map<string, WebSocketClient>();
	private connections = new Map<string, WebSocket>();
	private pingInterval: NodeJS.Timeout | null = null;

	private constructor() {
		// Start ping interval to detect disconnected clients
		this.pingInterval = setInterval(() => {
			this.pingClients();
		}, 30000); // 30 seconds
	}

	static getInstance(): WebSocketManager {
		if (!WebSocketManager.instance) {
			WebSocketManager.instance = new WebSocketManager();
		}
		return WebSocketManager.instance;
	}

	// Register a new WebSocket connection
	registerClient(socket: WebSocket, userId: string, branchId: string): string {
		const clientId = this.generateClientId();
		const client: WebSocketClient = {
			id: clientId,
			userId,
			branchId,
			socket,
			lastPing: Date.now(),
			subscriptions: new Set(['tables', 'metrics']) // Default subscriptions
		};

		this.clients.set(clientId, client);
		this.connections.set(clientId, socket);

		// Set up event handlers
		this.setupSocketHandlers(clientId, socket);

		// Send acknowledgment
		this.sendToClient(clientId, {
			type: 'connection_ack',
			data: { clientId, branchId },
			timestamp: new Date().toISOString(),
			branchId
		});

		console.log(`WebSocket client connected: ${clientId} (User: ${userId}, Branch: ${branchId})`);
		return clientId;
	}

	// Unregister a WebSocket connection
	unregisterClient(clientId: string): void {
		const client = this.clients.get(clientId);
		if (client) {
			console.log(`WebSocket client disconnected: ${clientId} (User: ${client.userId}, Branch: ${client.branchId})`);
		}

		this.clients.delete(clientId);
		this.connections.delete(clientId);
	}

	// Set up WebSocket event handlers
	private setupSocketHandlers(clientId: string, socket: WebSocket): void {
		socket.onmessage = (event) => {
			try {
				const message = JSON.parse(event.data) as WebSocketMessage;
				this.handleClientMessage(clientId, message);
			} catch (error) {
				console.error(`Invalid WebSocket message from ${clientId}:`, error);
			}
		};

		socket.onclose = () => {
			this.unregisterClient(clientId);
		};

		socket.onerror = (error) => {
			console.error(`WebSocket error for client ${clientId}:`, error);
		};
	}

	// Handle messages from clients
	private handleClientMessage(clientId: string, message: WebSocketMessage): void {
		const client = this.clients.get(clientId);
		if (!client) return;

		switch (message.type) {
			case 'ping':
				client.lastPing = Date.now();
				this.sendToClient(clientId, {
					type: 'pong',
					data: { timestamp: new Date().toISOString() },
					timestamp: new Date().toISOString(),
					branchId: client.branchId
				});
				break;

			case 'subscribe':
				if (message.data?.subscriptions) {
					message.data.subscriptions.forEach((sub: string) => {
						client.subscriptions.add(sub);
					});
				}
				break;

			case 'unsubscribe':
				if (message.data?.subscriptions) {
					message.data.subscriptions.forEach((sub: string) => {
						client.subscriptions.delete(sub);
					});
				}
				break;

			default:
				console.log(`Unhandled message type from ${clientId}:`, message.type);
		}
	}

	// Send message to specific client
	sendToClient(clientId: string, message: WebSocketMessage): boolean {
		const socket = this.connections.get(clientId);
		if (socket && socket.readyState === WebSocket.OPEN) {
			try {
				socket.send(JSON.stringify(message));
				return true;
			} catch (error) {
				console.error(`Failed to send message to client ${clientId}:`, error);
				this.unregisterClient(clientId);
				return false;
			}
		}
		return false;
	}

	// Broadcast message to all clients in a branch
	broadcastToBranch(branchId: string, message: WebSocketMessage, excludeClientId?: string): number {
		let sentCount = 0;
		for (const [clientId, client] of this.clients) {
			if (client.branchId === branchId && clientId !== excludeClientId) {
				if (this.sendToClient(clientId, message)) {
					sentCount++;
				}
			}
		}
		return sentCount;
	}

	// Broadcast to clients subscribed to specific topic
	broadcastToTopic(topic: string, message: WebSocketMessage, branchId?: string): number {
		let sentCount = 0;
		for (const [clientId, client] of this.clients) {
			if (client.subscriptions.has(topic) && (!branchId || client.branchId === branchId)) {
				if (this.sendToClient(clientId, message)) {
					sentCount++;
				}
			}
		}
		return sentCount;
	}

	// Notify clients of table updates
	notifyTableUpdate(table: Table, operation: TableOperation, branchId: string): void {
		const message: WebSocketMessage = {
			type: 'table_update',
			data: { table, operation },
			timestamp: new Date().toISOString(),
			branchId
		};

		this.broadcastToBranch(branchId, message);
		this.broadcastToTopic('tables', message, branchId);
	}

	// Notify clients of session updates
	notifySessionUpdate(session: TableSession, tableId: string, branchId: string): void {
		const message: WebSocketMessage = {
			type: 'session_update',
			data: { session, tableId },
			timestamp: new Date().toISOString(),
			branchId
		};

		this.broadcastToBranch(branchId, message);
		this.broadcastToTopic('sessions', message, branchId);
	}

	// Notify clients of metrics updates
	notifyMetricsUpdate(metrics: any, branchId: string): void {
		const message: WebSocketMessage = {
			type: 'metrics_update',
			data: metrics,
			timestamp: new Date().toISOString(),
			branchId
		};

		this.broadcastToTopic('metrics', message, branchId);
	}

	// Ping clients to check connectivity
	private pingClients(): void {
		const now = Date.now();
		const disconnectedClients: string[] = [];

		for (const [clientId, client] of this.clients) {
			if (now - client.lastPing > 60000) { // 60 seconds timeout
				disconnectedClients.push(clientId);
			} else {
				// Send ping
				this.sendToClient(clientId, {
					type: 'ping',
					data: { timestamp: new Date().toISOString() },
					timestamp: new Date().toISOString(),
					branchId: client.branchId
				});
			}
		}

		// Clean up disconnected clients
		disconnectedClients.forEach(clientId => {
			this.unregisterClient(clientId);
		});
	}

	// Get connection statistics
	getStats(): { totalClients: number; branchStats: Record<string, number> } {
		const branchStats: Record<string, number> = {};

		for (const client of this.clients.values()) {
			branchStats[client.branchId] = (branchStats[client.branchId] || 0) + 1;
		}

		return {
			totalClients: this.clients.size,
			branchStats
		};
	}

	// Generate unique client ID
	private generateClientId(): string {
		return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}

	// Cleanup
	destroy(): void {
		if (this.pingInterval) {
			clearInterval(this.pingInterval);
		}

		// Close all connections
		for (const [clientId, socket] of this.connections) {
			try {
				socket.close();
			} catch (error) {
				console.error(`Error closing connection ${clientId}:`, error);
			}
		}

		this.clients.clear();
		this.connections.clear();
	}
}

export default WebSocketManager;