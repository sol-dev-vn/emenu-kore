<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/flowbite/Button.svelte';
	import Card from '$lib/components/flowbite/Card.svelte';
	import Badge from '$lib/components/flowbite/Badge.svelte';
	import type { Table, Staff, TableHistoryEntry } from '$lib/types/table';

	export let table: Table;
	export let onAction: (action: string, data?: any) => void;
	export let onClose: () => void;

	let showHistory = false;
	let showStaffAssignment = false;
	let showAdvancedOptions = false;
	let tableHistory: TableHistoryEntry[] = [];
	let availableStaff: Staff[] = [];
	let selectedStaff: Staff | null = null;
	let isLoading = false;
	let customerName = '';
	let sessionNotes = '';
	let customers = 1;

	onMount(async () => {
		await loadTableHistory();
		await loadAvailableStaff();
	});

	async function loadTableHistory() {
		try {
			const response = await fetch('/api/tables', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'getHistory',
					tableId: table.id,
					data: { limit: 20 }
				})
			});
			const result = await response.json();
			if (result.success) {
				tableHistory = result.data;
			}
		} catch (error) {
			console.error('Failed to load table history:', error);
		}
	}

	async function loadAvailableStaff() {
		try {
			const response = await fetch('/api/tables', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'getAvailableStaff',
					tableId: table.id,
					data: {}
				})
			});
			const result = await response.json();
			if (result.success) {
				availableStaff = result.data;
			}
		} catch (error) {
			console.error('Failed to load available staff:', error);
		}
	}

	async function handleSessionStart() {
		isLoading = true;
		try {
			await onAction('startTableSession', {
				tableId: table.id,
				data: {
					customers,
					staffId: selectedStaff?.id || table.staff?.id,
					customerName: customerName || undefined,
					notes: sessionNotes || undefined
				}
			});
			onClose();
		} finally {
			isLoading = false;
		}
	}

	async function handleStaffAssignment() {
		if (!selectedStaff) return;

		isLoading = true;
		try {
			await onAction('assignStaff', {
				tableId: table.id,
				data: { staffId: selectedStaff.id }
			});
			table.staff = selectedStaff;
			showStaffAssignment = false;
		} finally {
			isLoading = false;
		}
	}

	async function handleTableReset() {
		if (!confirm('Are you sure you want to reset this table? This will clear all session data.')) {
			return;
		}

		isLoading = true;
		try {
			await onAction('resetTable', {
				tableId: table.id,
				data: { reason: 'Manual reset via operations panel' }
			});
			onClose();
		} finally {
			isLoading = false;
		}
	}

	async function handleCleaningRequest(priority: 'normal' | 'urgent' = 'normal') {
		isLoading = true;
		try {
			await onAction('requestCleaning', {
				tableId: table.id,
				data: { priority }
			});
		} finally {
			isLoading = false;
		}
	}

	function formatTime(timestamp: string): string {
		return new Date(timestamp).toLocaleString();
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

	function getActionIcon(action: string): string {
		switch (action) {
			case 'session_started': return '🍽️';
			case 'session_ended': return '💳';
			case 'table_reset': return '🔄';
			case 'staff_assigned': return '👤';
			case 'cleaning_requested': return '🧹';
			default: return '📝';
		}
	}
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" on:click={onClose}>
	<div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" on:click|stopPropagation>
		<!-- Header -->
		<div class="p-6 border-b border-gray-200 dark:border-gray-700">
			<div class="flex items-center justify-between">
				<div class="flex items-center space-x-4">
					<div>
						<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Table {table.number} Operations</h2>
						<p class="text-gray-600 dark:text-gray-400 mt-1">{table.name || 'Operations Management'}</p>
					</div>
					<Badge color={getStatusColor(table.status)}>{table.status}</Badge>
				</div>
				<Button color="secondary" size="sm" onclick={onClose}>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</Button>
			</div>
		</div>

		<!-- Content -->
		<div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<!-- Left Column: Current Status & Quick Actions -->
				<div class="space-y-6">
					<!-- Current Status -->
					<Card>
						<div class="p-4">
							<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Status</h3>
							<div class="space-y-3">
								<div class="flex justify-between">
									<span class="text-gray-600 dark:text-gray-400">Status:</span>
									<Badge color={getStatusColor(table.status)}>{table.status}</Badge>
								</div>
								<div class="flex justify-between">
									<span class="text-gray-600 dark:text-gray-400">Capacity:</span>
									<span class="font-medium">{table.capacity} seats</span>
								</div>
								{#if table.staff}
									<div class="flex justify-between">
										<span class="text-gray-600 dark:text-gray-400">Staff:</span>
										<span class="font-medium">{table.staff.firstName} {table.staff.lastName}</span>
									</div>
								{/if}
								{#if table.currentSession}
									<div class="flex justify-between">
										<span class="text-gray-600 dark:text-gray-400">Session:</span>
										<span class="font-medium">{table.currentSession.customers} customers</span>
									</div>
									<div class="flex justify-between">
										<span class="text-gray-600 dark:text-gray-400">Duration:</span>
										<span class="font-medium">{table.currentSession.duration}m</span>
									</div>
									<div class="flex justify-between">
										<span class="text-gray-600 dark:text-gray-400">Amount:</span>
										<span class="font-medium">₫{table.currentSession.amount.toLocaleString()}</span>
									</div>
								{/if}
							</div>
						</div>
					</Card>

					<!-- Quick Actions -->
					<Card>
						<div class="p-4">
							<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
							<div class="space-y-3">
								{#if table.status === 'available'}
									<Button color="cyan" size="sm" class="w-full" onclick={() => showStaffAssignment = true}>
										<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
										</svg>
										Start Session
									</Button>
								{/if}
								{#if table.status === 'occupied'}
									<Button color="danger" size="sm" class="w-full" onclick={() => onAction('endSession', { tableId: table.id })}>
										<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
										</svg>
										End Session
									</Button>
								{/if}
								{#if table.status === 'cleaning'}
									<Button color="success" size="sm" class="w-full" onclick={() => onAction('markTableClean', { tableId: table.id })}>
										<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
										</svg>
										Mark Clean
									</Button>
								{/if}
								<Button color="secondary" size="sm" class="w-full" onclick={() => handleCleaningRequest('normal')}>
									<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
									</svg>
									Request Cleaning
								</Button>
							</div>
						</div>
					</Card>
				</div>

				<!-- Middle Column: Session Management -->
				<div class="space-y-6">
					{#if table.status === 'available'}
						<Card>
							<div class="p-4">
								<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Start New Session</h3>
								<div class="space-y-4">
									<div>
										<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Number of Customers</label>
										<input
											type="number"
											min="1"
											max={table.capacity}
											bind:value={customers}
											class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
										/>
									</div>
									<div>
										<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Customer Name (Optional)</label>
										<input
											type="text"
											placeholder="Enter customer name"
											bind:value={customerName}
											class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
										/>
									</div>
									<div>
										<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Session Notes</label>
										<textarea
											placeholder="Add any special notes..."
											bind:value={sessionNotes}
											rows="3"
											class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
										/>
									</div>
									<Button color="cyan" class="w-full" onclick={handleSessionStart} disabled={isLoading}>
										{#if isLoading}
											<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
												<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
												<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
										{/if}
										Start Session
									</Button>
								</div>
							</div>
						</Card>
					{/if}

					<!-- Staff Assignment -->
					<Card>
						<div class="p-4">
							<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Staff Assignment</h3>
							{#if table.staff}
								<div class="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
									<div>
										<p class="font-medium">{table.staff.firstName} {table.staff.lastName}</p>
										<p class="text-sm text-gray-600 dark:text-gray-400">{table.staff.role}</p>
									</div>
									<Badge color="info">Assigned</Badge>
								</div>
							{:else}
								<p class="text-gray-600 dark:text-gray-400 mb-4">No staff assigned</p>
							{/if}
							<Button color="secondary" size="sm" class="w-full" onclick={() => showStaffAssignment = true}>
								<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
								</svg>
								Change Staff
							</Button>
						</div>
					</Card>

					<!-- Advanced Options -->
					<Card>
						<div class="p-4">
							<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Advanced Options</h3>
							<div class="space-y-3">
								<Button color="secondary" size="sm" class="w-full" onclick={() => showAdvancedOptions = !showAdvancedOptions}>
									<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
									</svg>
									Advanced Options
								</Button>
								{#if showAdvancedOptions}
									<div class="space-y-2 mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
										<Button color="warning" size="sm" class="w-full" onclick={() => handleCleaningRequest('urgent')}>
											<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
											</svg>
											Urgent Cleaning
										</Button>
										<Button color="danger" size="sm" class="w-full" onclick={handleTableReset}>
											<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
											</svg>
											Reset Table
										</Button>
									</div>
								{/if}
							</div>
						</div>
					</Card>
				</div>

				<!-- Right Column: History & Information -->
				<div class="space-y-6">
					<!-- Table History -->
					<Card>
						<div class="p-4">
							<div class="flex items-center justify-between mb-4">
								<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
								<Button color="secondary" size="sm" onclick={() => showHistory = !showHistory}>
									{showHistory ? 'Hide' : 'Show'}
								</Button>
							</div>
							{#if showHistory}
								<div class="space-y-3 max-h-96 overflow-y-auto">
									{#each tableHistory as entry}
										<div class="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
											<span class="text-xl">{getActionIcon(entry.action)}</span>
											<div class="flex-1">
												<p class="text-sm font-medium text-gray-900 dark:text-white">
													{entry.action.replace('_', ' ').toUpperCase()}
												</p>
												<p class="text-xs text-gray-600 dark:text-gray-400">
													{formatTime(entry.timestamp)}
												</p>
												{#if entry.staff}
													<p class="text-xs text-gray-600 dark:text-gray-400">
														by {entry.staff.firstName} {entry.staff.lastName}
													</p>
												{/if}
											</div>
										</div>
									{/each}
									{#if tableHistory.length === 0}
										<p class="text-gray-600 dark:text-gray-400 text-center py-4">No recent activity</p>
									{/if}
								</div>
							{:else}
								<p class="text-gray-600 dark:text-gray-400 text-center py-4">Click "Show" to view activity history</p>
							{/if}
						</div>
					</Card>

					<!-- Table Information -->
					<Card>
						<div class="p-4">
							<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Table Information</h3>
							<div class="space-y-3">
								<div class="flex justify-between">
									<span class="text-gray-600 dark:text-gray-400">Table ID:</span>
									<span class="font-mono text-sm">{table.id}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-gray-600 dark:text-gray-400">Zone:</span>
									<span class="font-medium">{table.zone || 'Unassigned'}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-gray-600 dark:text-gray-400">Created:</span>
									<span class="font-medium">{formatTime(table.createdAt)}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-gray-600 dark:text-gray-400">Last Updated:</span>
									<span class="font-medium">{formatTime(table.updatedAt)}</span>
								</div>
								{#if table.mergedTables}
									<div class="flex justify-between">
										<span class="text-gray-600 dark:text-gray-400">Merged Tables:</span>
										<span class="font-medium">{table.mergedTables.length} tables</span>
									</div>
								{/if}
								{#if table.cleaningPriority}
									<div class="flex justify-between">
										<span class="text-gray-600 dark:text-gray-400">Cleaning Priority:</span>
										<Badge color={table.cleaningPriority === 'urgent' ? 'danger' : 'warning'}>
											{table.cleaningPriority}
										</Badge>
									</div>
								{/if}
							</div>
						</div>
					</Card>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Staff Assignment Modal -->
{#if showStaffAssignment}
	<div class="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4" on:click={() => showStaffAssignment = false}>
		<div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6" on:click|stopPropagation>
			<h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Assign Staff</h3>
			<div class="space-y-3 max-h-96 overflow-y-auto">
				{#each availableStaff as staff}
					<button
						class="w-full p-3 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-cyan-500 {selectedStaff?.id === staff.id ? 'ring-2 ring-cyan-500 bg-cyan-50 dark:bg-cyan-900/20' : ''}"
						on:click={() => selectedStaff = staff}
					>
						<div class="flex items-center justify-between">
							<div>
								<p class="font-medium text-gray-900 dark:text-white">
									{staff.firstName} {staff.lastName}
								</p>
								<p class="text-sm text-gray-600 dark:text-gray-400">{staff.role}</p>
							</div>
							{#if staff.isActive}
								<Badge color="success">Active</Badge>
							{:else}
								<Badge color="secondary">Inactive</Badge>
							{/if}
						</div>
					</button>
				{/each}
			</div>
			<div class="flex space-x-3 mt-6">
				<Button color="secondary" class="flex-1" onclick={() => showStaffAssignment = false}>Cancel</Button>
				<Button color="cyan" class="flex-1" onclick={handleStaffAssignment} disabled={!selectedStaff || isLoading}>
					{#if isLoading}
						<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
					{/if}
					Assign
				</Button>
			</div>
		</div>
	</div>
{/if}