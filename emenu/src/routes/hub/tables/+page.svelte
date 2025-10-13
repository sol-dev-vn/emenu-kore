<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import TableGrid from '$lib/components/TableGrid.svelte';
	import TableOperationsPanel from '$lib/components/TableOperationsPanel.svelte';
	import Card from '$lib/components/flowbite/Card.svelte';
	import Button from '$lib/components/flowbite/Button.svelte';
	import Badge from '$lib/components/flowbite/Badge.svelte';
	import type { TableService } from '$lib/server/tableService';
	import { getTableSyncClient, type TableSyncEvent, initializeTableSync } from '$lib/client/tableSync';
	import { tableSyncStore } from '$lib/client/tableSync';
	import type { Table, Zone, TableMetrics } from '$lib/types/table';

	export let data;

	let tables: Table[] = data.tables;
	let zones: Zone[] = data.zones;
	let metrics: TableMetrics = data.metrics;
	let selectedZone: string | null = null;
	let selectedTable: Table | null = null;
	let isLoading = false;
	let error = data.error || null;
	let showTableDetails = false;
	let showOperationsPanel = false;
	let syncClient: any = null;
	let lastSyncUpdate: string | null = null;

	// Enhanced search and filter state
	let searchTerm = '';
	let statusFilter: string[] = [];
	let capacityFilter = { min: 0, max: 10 };
	let zoneFilter: string[] = [];
	let staffFilter: string[] = [];
	let sessionStatusFilter: string[] = [];
	let availabilityFilter: string = 'all'; // 'all', 'available', 'unavailable'
	let sortBy: string = 'number'; // 'number', 'capacity', 'zone', 'status', 'lastUpdated'
	let sortOrder: 'asc' | 'desc' = 'asc';
	let showAdvancedFilters = false;
	let filteredTablesCount = 0;

	// Real-time connection status
	$: connectionStatus = $tableSyncStore;

	onMount(() => {
		initializeRealTimeSync();
		setupSyncEventListeners();

		return () => {
			cleanupRealTimeSync();
		};
	});

	function initializeRealTimeSync() {
		try {
			// Initialize table sync with WebSocket connection
			syncClient = initializeTableSync({
				branchId: data.branchId,
				userId: data.user.id,
				enablePolling: true, // Fallback to HTTP polling
				pollingInterval: 15000 // 15 seconds
			});

			// Subscribe to real-time updates
			syncClient.subscribe(['tables', 'sessions', 'metrics']);

			console.log('Real-time table sync initialized');
		} catch (error) {
			console.error('Failed to initialize real-time sync:', error);
			// Fallback to simple polling
			startSimplePolling();
		}
	}

	function setupSyncEventListeners() {
		if (!syncClient) return;

		// Listen for table updates
		syncClient.on('table_update', (event: TableSyncEvent) => {
			console.log('Table update received:', event.data);
			updateTableFromSync(event.data.table);
		});

		// Listen for session updates
		syncClient.on('session_update', (event: TableSyncEvent) => {
			console.log('Session update received:', event.data);
			updateSessionFromSync(event.data.session, event.data.tableId);
		});

		// Listen for metrics updates
		syncClient.on('metrics_update', (event: TableSyncEvent) => {
			console.log('Metrics update received:', event.data);
			metrics = event.data.metrics;
		});

		// Listen for connection events
		syncClient.on('connection', (event: TableSyncEvent) => {
			console.log('Connection event:', event.data);
			if (event.data.connected) {
				lastSyncUpdate = event.timestamp;
			}
		});
	}

	function updateTableFromSync(updatedTable: Table) {
		const tableIndex = tables.findIndex(t => t.id === updatedTable.id);
		if (tableIndex !== -1) {
			// Update the table in place to maintain reactivity
			tables = [...tables.slice(0, tableIndex), updatedTable, ...tables.slice(tableIndex + 1)];
		}
	}

	function updateSessionFromSync(updatedSession: TableSession, tableId: string) {
		const tableIndex = tables.findIndex(t => t.id === tableId);
		if (tableIndex !== -1) {
			// Update session data for the table
			tables[tableIndex].currentSession = updatedSession;
			tables = [...tables];
		}
	}

	function cleanupRealTimeSync() {
		if (syncClient) {
			syncClient.disconnect();
			syncClient = null;
		}
	}

	// Fallback simple polling
	function startSimplePolling() {
		const updateInterval = setInterval(async () => {
			await refreshTableData();
		}, 30000); // 30 seconds

		return () => clearInterval(updateInterval);
	}

	async function refreshTableData() {
		try {
			isLoading = true;
			error = null;

			// In real implementation, this would be an API call
			// For now, we'll keep the mock data
			// const response = await fetch(`/api/tables?branch=${data.branchId}`);
			// const newData = await response.json();
			// tables = newData.tables;
			// metrics = newData.metrics;
		} catch (error) {
			console.error('Failed to refresh table data:', error);
			error = error instanceof Error ? error.message : 'Unknown error occurred';
		} finally {
			isLoading = false;
		}
	}

	function handleTableSelect(event: CustomEvent) {
		const { table } = event.detail;
		selectedTable = table;
		showOperationsPanel = true;
	}

	function handleTableAction(event: CustomEvent) {
		const { table, action } = event.detail;
		console.log(`Table action: ${action} on table ${table.id}`);

		// Handle different table actions
		switch (action) {
			case 'Start Session':
				startTableSession(table);
				break;
			case 'Payment':
				processPayment(table);
				break;
			case 'Mark Clean':
				markTableClean(table);
				break;
			case 'Reserve':
				reserveTable(table);
				break;
			// Add more actions as needed
		}
	}

	// Comprehensive action handler for the operations panel
	async function handleOperationsAction(action: string, data: any) {
		try {
			isLoading = true;

			const response = await fetch('/api/tables', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action,
					...data
				})
			});

			const result = await response.json();

			if (result.success) {
				// Update local state based on action
				const tableIndex = tables.findIndex(t => t.id === data.tableId);
				if (tableIndex !== -1 && result.data) {
					if (result.data.table) {
						tables[tableIndex] = result.data.table;
					} else {
						tables[tableIndex] = result.data;
					}
				}

				// Send real-time update
				if (syncClient) {
					syncClient.sendTableAction(data.tableId, action.toLowerCase().replace('table', ''), data.data || {});
				}

				console.log(`Operation ${action} completed successfully`);
			} else {
				throw new Error(result.message || `Failed to perform ${action}`);
			}
		} catch (error) {
			console.error(`Failed to perform ${action}:`, error);
			error = error instanceof Error ? error.message : `Failed to perform ${action}`;
			// You might want to show this error to the user
		} finally {
			isLoading = false;
		}
	}

	async function startTableSession(table: Table) {
		try {
			isLoading = true;

			// Call the comprehensive session start API
			const response = await fetch('/api/tables', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					action: 'startTableSession',
					tableId: table.id,
					data: {
						customers: 1, // Default to 1 customer, could be made configurable
						staffId: data.user.id,
						customerName: undefined, // Could add customer name input
						notes: undefined, // Could add session notes
						reservationId: undefined // Could link to existing reservation
					}
				})
			});

			const result = await response.json();

			if (result.success) {
				// Update table with session data
				const tableIndex = tables.findIndex(t => t.id === table.id);
				if (tableIndex !== -1 && result.data.table) {
					tables[tableIndex] = result.data.table;
				}

				// Send real-time update
				if (syncClient) {
					syncClient.sendTableAction(table.id, 'start_session', {
						sessionId: result.data.session?.id,
						staffId: data.user.id,
						customers: 1
					});
				}

				console.log('Session started successfully for table:', table.id);
			} else {
				throw new Error(result.message || 'Failed to start session');
			}
		} catch (error) {
			console.error('Failed to start table session:', error);
			error = error instanceof Error ? error.message : 'Failed to start session';
		} finally {
			isLoading = false;
		}
	}

	async function processPayment(table: Table) {
		try {
			isLoading = true;

			// Call the comprehensive session end API
			const response = await fetch('/api/tables', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					action: 'endTableSession',
					tableId: table.id,
					data: {
						paymentMethod: 'cash', // Default payment method, could be configurable
						paymentAmount: table.currentSession?.amount || 0,
						tip: undefined, // Could add tip input
						finalAmount: table.currentSession?.amount || 0,
						staffId: data.user.id // Staff processing payment
					}
				})
			});

			const result = await response.json();

			if (result.success) {
				// Update table with completed session data
				const tableIndex = tables.findIndex(t => t.id === table.id);
				if (tableIndex !== -1 && result.data.table) {
					tables[tableIndex] = result.data.table;
				}

				// Send real-time update
				if (syncClient) {
					syncClient.sendTableAction(table.id, 'end_session', {
						sessionId: result.data.completedSession?.id,
						staffId: data.user.id,
						amount: result.data.completedSession?.amount
					});
				}

				console.log('Payment processed successfully for table:', table.id);
			} else {
				throw new Error(result.message || 'Failed to process payment');
			}
		} catch (error) {
			console.error('Failed to process payment:', error);
			error = error instanceof Error ? error.message : 'Failed to process payment';
		} finally {
			isLoading = false;
		}
	}

	async function markTableClean(table: Table) {
		try {
			isLoading = true;

			// Call the table cleaning API
			const response = await fetch('/api/tables', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					action: 'markTableClean',
					tableId: table.id,
					data: {
						staffId: data.user.id // Staff marking table as clean
					}
				})
			});

			const result = await response.json();

			if (result.success) {
				// Update table with cleaned data
				const tableIndex = tables.findIndex(t => t.id === table.id);
				if (tableIndex !== -1 && result.data) {
					tables[tableIndex] = result.data;
				}

				// Send real-time update
				if (syncClient) {
					syncClient.sendTableAction(table.id, 'mark_clean', {
						staffId: data.user.id
					});
				}

				console.log('Table marked as clean successfully:', table.id);
			} else {
				throw new Error(result.message || 'Failed to mark table clean');
			}
		} catch (error) {
			console.error('Failed to mark table clean:', error);
			error = error instanceof Error ? error.message : 'Failed to mark table clean';
		} finally {
			isLoading = false;
		}
	}

	async function reserveTable(table: Table) {
		try {
			isLoading = true;

			// Update table status locally for immediate feedback
			const tableIndex = tables.findIndex(t => t.id === table.id);
			if (tableIndex !== -1) {
				tables[tableIndex].status = 'reserved';
				const reservationTime = new Date(Date.now() + Math.random() * 7200000); // Random time in next 2 hours
				tables[tableIndex].reservationTime = reservationTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
			}

			// Send action to real-time sync
			if (syncClient) {
				syncClient.sendTableAction(table.id, 'reserve_table', {
					reservationTime: new Date(Date.now() + Math.random() * 7200000).toISOString()
				});
			}

			console.log('Reserving table:', table.id);
		} catch (error) {
			console.error('Failed to reserve table:', error);
			error = error instanceof Error ? error.message : 'Failed to reserve table';
		} finally {
			isLoading = false;
		}
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
	}

	function formatTime(minutes: number): string {
		if (minutes < 60) return `${minutes}m`;
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return `${hours}h ${mins}m`;
	}

	function getStatusColor(status: string): string {
		switch (status) {
			case 'available': return 'success';
			case 'occupied': return 'danger';
			case 'reserved': return 'warning';
			case 'cleaning': return 'info';
			case 'maintenance': return 'secondary';
			default: return 'secondary';
		}
	}

	// Enhanced filtering and sorting logic
	$: filteredTables = (() => {
		let filtered = [...tables];

		// Zone filter (legacy compatibility)
		if (selectedZone && !zoneFilter.includes(selectedZone)) {
			zoneFilter = [selectedZone];
		}

		// Search filter (enhanced to search multiple fields)
		if (searchTerm) {
			const searchLower = searchTerm.toLowerCase();
			filtered = filtered.filter(table =>
				table.number.toString().includes(searchLower) ||
				(table.name && table.name.toLowerCase().includes(searchLower)) ||
				(table.zone && getZoneName(table.zone).toLowerCase().includes(searchLower)) ||
				(table.staff && `${table.staff.firstName} ${table.staff.lastName}`.toLowerCase().includes(searchLower)) ||
				(table.currentSession?.customerName && table.currentSession.customerName.toLowerCase().includes(searchLower))
			);
		}

		// Zone filter
		if (zoneFilter.length > 0) {
			filtered = filtered.filter(table => table.zone && zoneFilter.includes(table.zone));
		}

		// Status filter
		if (statusFilter.length > 0) {
			filtered = filtered.filter(table => statusFilter.includes(table.status));
		}

		// Capacity filter
		if (capacityFilter.min > 0 || capacityFilter.max < 10) {
			filtered = filtered.filter(table =>
				table.capacity >= capacityFilter.min && table.capacity <= capacityFilter.max
			);
		}

		// Staff filter
		if (staffFilter.length > 0) {
			filtered = filtered.filter(table =>
				table.staff && staffFilter.includes(table.staff.id)
			);
		}

		// Session status filter
		if (sessionStatusFilter.length > 0) {
			filtered = filtered.filter(table =>
				table.currentSession && sessionStatusFilter.includes(table.currentSession.status)
			);
		}

		// Availability filter
		if (availabilityFilter !== 'all') {
			if (availabilityFilter === 'available') {
				filtered = filtered.filter(table => table.status === 'available');
			} else if (availabilityFilter === 'unavailable') {
				filtered = filtered.filter(table => table.status !== 'available');
			}
		}

		// Sorting
		filtered.sort((a, b) => {
			let comparison = 0;

			switch (sortBy) {
				case 'number':
					comparison = a.number - b.number;
					break;
				case 'capacity':
					comparison = a.capacity - b.capacity;
					break;
				case 'zone':
					comparison = getZoneName(a.zone || '').localeCompare(getZoneName(b.zone || ''));
					break;
				case 'status':
					comparison = a.status.localeCompare(b.status);
					break;
				case 'lastUpdated':
					comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
					break;
				default:
					comparison = a.number - b.number;
			}

			return sortOrder === 'asc' ? comparison : -comparison;
		});

		// Update count for display
		filteredTablesCount = filtered.length;

		return filtered;
	})();

	// Helper function to get zone name
	function getZoneName(zoneId: string): string {
		const zone = zones.find(z => z.id === zoneId);
		return zone ? zone.name : zoneId;
	}

	// Clear all filters
	function clearAllFilters() {
		searchTerm = '';
		statusFilter = [];
		capacityFilter = { min: 0, max: 10 };
		zoneFilter = [];
		staffFilter = [];
		sessionStatusFilter = [];
		availabilityFilter = 'all';
		sortBy = 'number';
		sortOrder = 'asc';
		selectedZone = null;
	}

	// Get filter summary for display
	$: filterSummary = (() => {
		const activeFilters = [];

		if (searchTerm) activeFilters.push(`Search: "${searchTerm}"`);
		if (statusFilter.length > 0) activeFilters.push(`Status: ${statusFilter.join(', ')}`);
		if (zoneFilter.length > 0) activeFilters.push(`Zones: ${zoneFilter.map(z => getZoneName(z)).join(', ')}`);
		if (staffFilter.length > 0) activeFilters.push(`Staff: ${staffFilter.length} selected`);
		if (sessionStatusFilter.length > 0) activeFilters.push(`Session: ${sessionStatusFilter.join(', ')}`);
		if (availabilityFilter !== 'all') activeFilters.push(`Availability: ${availabilityFilter}`);
		if (capacityFilter.min > 0 || capacityFilter.max < 10) activeFilters.push(`Capacity: ${capacityFilter.min}-${capacityFilter.max}`);

		return activeFilters;
	})();

	// Quick filter presets
	function applyQuickFilter(preset: string) {
		clearAllFilters();

		switch (preset) {
			case 'available':
				availabilityFilter = 'available';
				break;
			case 'occupied':
				statusFilter = ['occupied'];
				break;
			case 'cleaning':
				statusFilter = ['cleaning'];
				break;
			case 'large-parties':
				capacityFilter = { min: 6, max: 10 };
				break;
			case 'vip-area':
				const vipZone = zones.find(z => z.name.toLowerCase().includes('vip'));
				if (vipZone) zoneFilter = [vipZone.id];
				break;
			case 'active-sessions':
				sessionStatusFilter = ['active'];
				break;
		}
	}
</script>

<svelte:head>
	<title>Table Management - Staff Hub</title>
	<meta name="description" content="SOL Restaurant table management system" />
</svelte:head>

<div class="p-6">
	<!-- Page Header -->
	<div class="mb-8">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold text-gray-900">Table Management</h1>
				<p class="text-gray-600 mt-2">Manage restaurant tables, zones, and reservations</p>
			</div>
			<div class="flex items-center space-x-4">
				<!-- Real-time Status Indicator -->
				<div class="flex items-center space-x-2">
					<div class={`w-3 h-3 rounded-full ${connectionStatus?.isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
					<span class="text-sm text-gray-600">
						{connectionStatus?.isConnected ? 'Connected' : 'Connecting...'}
					</span>
					{#if lastSyncUpdate}
						<span class="text-xs text-gray-500 ml-2">
							Last update: {new Date(lastSyncUpdate).toLocaleTimeString()}
						</span>
					{/if}
				</div>

				{#if isLoading}
					<div class="flex items-center space-x-2">
						<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-600"></div>
						<span class="text-sm text-gray-600">Updating...</span>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Error Message -->
	{#if error}
		<div class="mb-6">
			<Card class="border-red-200 bg-red-50 dark:bg-red-900/20">
				<div class="p-4">
					<div class="flex items-center">
						<svg class="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
						<div>
							<h3 class="text-sm font-medium text-red-800 dark:text-red-200">Data Loading Error</h3>
							<p class="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
						</div>
						<Button color="red" size="sm" onclick={refreshTableData} class="ml-auto">
							Retry
						</Button>
					</div>
				</div>
			</Card>
		</div>
	{/if}

	<!-- Metrics Overview -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
		<Card hover={true} class="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/30 border-cyan-200 dark:border-cyan-800">
			<div class="p-6">
				<div class="flex items-center justify-between mb-4">
					<h3 class="text-sm font-medium text-cyan-700 dark:text-cyan-300">Total Tables</h3>
					<Badge color="cyan" size="sm">{metrics.totalTables}</Badge>
				</div>
				<p class="text-2xl font-bold text-cyan-900 dark:text-cyan-100">{metrics.totalTables}</p>
				<p class="text-xs text-cyan-600 dark:text-cyan-400 mt-2">{zones.length} zones</p>
			</div>
		</Card>

		<Card hover={true} class="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 border-green-200 dark:border-green-800">
			<div class="p-6">
				<div class="flex items-center justify-between mb-4">
					<h3 class="text-sm font-medium text-green-700 dark:text-green-300">Available</h3>
					<Badge color="success" size="sm">{metrics.availableTables}</Badge>
				</div>
				<p class="text-2xl font-bold text-green-900 dark:text-green-100">{metrics.availableTables}</p>
				<p class="text-xs text-green-600 dark:text-green-400 mt-2">Ready for guests</p>
			</div>
		</Card>

		<Card hover={true} class="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/30 border-red-200 dark:border-red-800">
			<div class="p-6">
				<div class="flex items-center justify-between mb-4">
					<h3 class="text-sm font-medium text-red-700 dark:text-red-300">Occupied</h3>
					<Badge color="danger" size="sm">{metrics.occupiedTables}</Badge>
				</div>
				<p class="text-2xl font-bold text-red-900 dark:text-red-100">{metrics.occupiedTables}</p>
				<p class="text-xs text-red-600 dark:text-red-400 mt-2">{Math.round(metrics.occupancyRate)}% occupancy</p>
			</div>
		</Card>

		<Card hover={true} class="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30 border-purple-200 dark:border-purple-800">
			<div class="p-6">
				<div class="flex items-center justify-between mb-4">
					<h3 class="text-sm font-medium text-purple-700 dark:text-purple-300">Revenue</h3>
					<Badge color="warning" size="sm">Live</Badge>
				</div>
				<p class="text-2xl font-bold text-purple-900 dark:text-purple-100">{formatCurrency(metrics.totalRevenue)}</p>
				<p class="text-xs text-purple-600 dark:text-purple-400 mt-2">Active sessions</p>
			</div>
		</Card>
	</div>

	<!-- Enhanced Filters and Search -->
	<Card class="mb-6">
		<div class="p-6">
			<!-- Header with Results Count -->
			<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-6">
				<div class="flex items-center space-x-4">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
						Tables ({filteredTablesCount} of {tables.length})
					</h3>
					{#if filterSummary.length > 0}
						<div class="flex items-center space-x-2">
							<span class="text-sm text-gray-600 dark:text-gray-400">Filters:</span>
							<div class="flex flex-wrap gap-2">
								{#each filterSummary as filter}
									<Badge color="info" size="sm">{filter}</Badge>
								{/each}
							</div>
							<Button color="secondary" size="sm" onclick={clearAllFilters}>
								<svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
								</svg>
								Clear
							</Button>
						</div>
					{/if}
				</div>

				<!-- Quick Actions -->
				<div class="flex items-center space-x-4">
					<Button color="cyan" size="sm">
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
						</svg>
						Add Table
					</Button>
					<Button color="purple" size="sm" outline={true}>
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
						</svg>
						Bulk Operations
					</Button>
					<Button color="secondary" size="sm" outline={true}>
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4 4m4-4v12"></path>
						</svg>
						Export
					</Button>
					<Button color="secondary" size="sm" outline={true} onclick={refreshTableData}>
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
						</svg>
						Refresh
					</Button>
				</div>
			</div>

			<!-- Main Search and Filters -->
			<div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
				<!-- Search Bar -->
				<div class="lg:col-span-4">
					<div class="relative">
						<input
							type="text"
							placeholder="Search tables, staff, customers..."
							bind:value={searchTerm}
							class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
						/>
						<svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
						</svg>
					</div>
				</div>

				<!-- Quick Filter Presets -->
				<div class="lg:col-span-8">
					<div class="flex flex-wrap gap-2">
						<Button color="info" size="sm" outline={true} onclick={() => applyQuickFilter('available')}>
							Available
						</Button>
						<Button color="danger" size="sm" outline={true} onclick={() => applyQuickFilter('occupied')}>
							Occupied
						</Button>
						<Button color="warning" size="sm" outline={true} onclick={() => applyQuickFilter('cleaning')}>
							Cleaning
						</Button>
						<Button color="purple" size="sm" outline={true} onclick={() => applyQuickFilter('large-parties')}>
							Large Parties
						</Button>
						<Button color="success" size="sm" outline={true} onclick={() => applyQuickFilter('vip-area')}>
							VIP Area
						</Button>
						<Button color="secondary" size="sm" outline={true} onclick={() => applyQuickFilter('active-sessions')}>
							Active Sessions
						</Button>
						<Button color="secondary" size="sm" onclick={() => showAdvancedFilters = !showAdvancedFilters}>
							<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
							</svg>
							{showAdvancedFilters ? 'Hide' : 'Advanced'} Filters
						</Button>
					</div>
				</div>
			</div>

			<!-- Advanced Filters -->
			{#if showAdvancedFilters}
				<div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<!-- Status Filter -->
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
							<div class="space-y-2">
								{#each ['available', 'occupied', 'reserved', 'cleaning', 'maintenance'] as status}
									<label class="flex items-center">
										<input
											type="checkbox"
											bind:group={statusFilter}
											value={status}
											class="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700"
										/>
										<span class="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">{status}</span>
									</label>
								{/each}
							</div>
						</div>

						<!-- Zone Filter -->
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Zones</label>
							<div class="space-y-2">
								{#each zones as zone}
									<label class="flex items-center">
										<input
											type="checkbox"
											bind:group={zoneFilter}
											value={zone.id}
											class="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700"
										/>
										<span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{zone.name}</span>
									</label>
								{/each}
							</div>
						</div>

						<!-- Capacity Filter -->
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Capacity Range</label>
							<div class="space-y-3">
								<div class="flex items-center space-x-2">
									<label class="text-sm text-gray-600 dark:text-gray-400">Min:</label>
									<input
										type="number"
										min="0"
										max="10"
										bind:value={capacityFilter.min}
										class="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
									/>
								</div>
								<div class="flex items-center space-x-2">
									<label class="text-sm text-gray-600 dark:text-gray-400">Max:</label>
									<input
										type="number"
										min="0"
										max="10"
										bind:value={capacityFilter.max}
										class="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
									/>
								</div>
							</div>
						</div>

						<!-- Sort Options -->
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort By</label>
							<div class="space-y-3">
								<select
									bind:value={sortBy}
									class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
								>
									<option value="number">Table Number</option>
									<option value="capacity">Capacity</option>
									<option value="zone">Zone</option>
									<option value="status">Status</option>
									<option value="lastUpdated">Last Updated</option>
								</select>
								<div class="flex items-center space-x-4">
									<label class="flex items-center">
										<input
											type="radio"
											bind:group={sortOrder}
											value="asc"
											class="border-gray-300 text-cyan-600 focus:ring-cyan-500"
										/>
										<span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Ascending</span>
									</label>
									<label class="flex items-center">
										<input
											type="radio"
											bind:group={sortOrder}
											value="desc"
											class="border-gray-300 text-cyan-600 focus:ring-cyan-500"
										/>
										<span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Descending</span>
									</label>
								</div>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</Card>

	<!-- Table Grid -->
	<TableGrid
		tables={filteredTables}
		{zones}
		bind:selectedZone
		bind:selectedTable
		bind:isLoading
		on:table-select={handleTableSelect}
		on:table-action={handleTableAction}
	/>
</div>

<!-- Table Operations Panel -->
{#if showOperationsPanel && selectedTable}
	<TableOperationsPanel
		{table}
		onAction={handleOperationsAction}
		onClose={() => showOperationsPanel = false}
	/>
{/if}