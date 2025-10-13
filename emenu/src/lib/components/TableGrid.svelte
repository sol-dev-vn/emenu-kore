<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Card from '$lib/components/flowbite/Card.svelte';
	import Badge from '$lib/components/flowbite/Badge.svelte';
	import Button from '$lib/components/flowbite/Button.svelte';

	export let tables: Table[] = [];
	export let zones: Zone[] = [];
	export let selectedZone: string | null = null;
	export let selectedTable: string | null = null;
	export let isLoading = false;

	const dispatch = createEventDispatcher();

	// Table status configuration
	const tableStatusConfig = {
		available: { color: 'success', bgColor: 'bg-green-100 dark:bg-green-900/30', textColor: 'text-green-800 dark:text-green-200' },
		occupied: { color: 'danger', bgColor: 'bg-red-100 dark:bg-red-900/30', textColor: 'text-red-800 dark:text-red-200' },
		reserved: { color: 'warning', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30', textColor: 'text-yellow-800 dark:text-yellow-200' },
		cleaning: { color: 'info', bgColor: 'bg-blue-100 dark:bg-blue-900/30', textColor: 'text-blue-800 dark:text-blue-200' },
		maintenance: { color: 'secondary', bgColor: 'bg-gray-100 dark:bg-gray-900/30', textColor: 'text-gray-800 dark:text-gray-200' }
	};

	function handleTableClick(table: Table) {
		selectedTable = selectedTable === table.id ? null : table.id;
		dispatch('table-select', { table });
	}

	function handleTableAction(table: Table, action: string) {
		dispatch('table-action', { table, action });
	}

	function getStatusBadge(status: string) {
		const config = tableStatusConfig[status as keyof typeof tableStatusConfig];
		return config || { color: 'secondary', bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
	}

	function getFilteredTables() {
		if (!selectedZone) return tables;
		return tables.filter(table => table.zone === selectedZone);
	}

	function getTablesByZone() {
		const tablesByZone = new Map<string, Table[]>();

		zones.forEach(zone => {
			tablesByZone.set(zone.id, tables.filter(table => table.zone === zone.id));
		});

		// Add tables without zones to "Unassigned" zone
		const unassignedTables = tables.filter(table => !table.zone);
		if (unassignedTables.length > 0) {
			tablesByZone.set('unassigned', unassignedTables);
		}

		return tablesByZone;
	}

	$: filteredTables = selectedZone ? getFilteredTables() : tables;
	$: tablesByZone = getTablesByZone();

	function formatDuration(minutes: number): string {
		if (minutes < 60) return `${minutes}m`;
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return `${hours}h ${mins}m`;
	}
</script>

<div class="space-y-6">
	<!-- Zone Filter -->
	<div class="flex items-center justify-between">
		<div class="flex items-center space-x-4">
			<Button
				color={selectedZone === null ? 'cyan' : 'secondary'}
				size="sm"
				outline={selectedZone !== null}
				onclick={() => selectedZone = null}
			>
				All Zones
				<Badge color="cyan" size="xs" class="ml-2">{tables.length}</Badge>
			</Button>
			{#each zones as zone}
				<Button
					color={selectedZone === zone.id ? 'cyan' : 'secondary'}
					size="sm"
					outline={selectedZone !== zone.id}
					onclick={() => selectedZone = zone.id}
				>
					{zone.name}
					<Badge color="cyan" size="xs" class="ml-2">
						{tables.filter(t => t.zone === zone.id).length}
					</Badge>
				</Button>
			{/each}
		</div>
		{#if isLoading}
			<div class="flex items-center space-x-2">
				<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-600"></div>
				<span class="text-sm text-gray-600">Loading...</span>
			</div>
		{/if}
	</div>

	<!-- Table Grid by Zones -->
	{#if selectedZone}
		<!-- Single Zone View -->
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
			{#each filteredTables as table}
				{@const statusConfig = getStatusBadge(table.status)}
				<Card
					hover={true}
					class="cursor-pointer transition-all duration-200 transform hover:scale-105"
					class:selected={selectedTable === table.id ? 'ring-2 ring-cyan-500' : ''}
					onclick={() => handleTableClick(table)}
				>
					<div class="p-4">
						<div class="flex items-center justify-between mb-3">
							<h3 class="font-bold text-gray-900 dark:text-white">Table {table.number}</h3>
							<Badge color={statusConfig.color} size="xs">{table.status}</Badge>
						</div>

						<div class="space-y-2">
							<div class="flex items-center justify-between text-sm">
								<span class="text-gray-600 dark:text-gray-400">Capacity:</span>
								<span class="font-medium">{table.capacity}</span>
							</div>

							{#if table.currentSession}
								<div class="flex items-center justify-between text-sm">
									<span class="text-gray-600 dark:text-gray-400">Duration:</span>
									<span class="font-medium">{formatDuration(table.currentSession.duration)}</span>
								</div>
								<div class="flex items-center justify-between text-sm">
									<span class="text-gray-600 dark:text-gray-400">Orders:</span>
									<span class="font-medium">{table.currentSession.orders}</span>
								</div>
								<div class="flex items-center justify-between text-sm">
									<span class="text-gray-600 dark:text-gray-400">Amount:</span>
									<span class="font-medium">{new Intl.NumberFormat('vi-VN').format(table.currentSession.amount)}₫</span>
								</div>
							{:else if table.status === 'reserved'}
								<div class="flex items-center justify-between text-sm">
									<span class="text-gray-600 dark:text-gray-400">Reserved:</span>
									<span class="font-medium">{table.reservationTime}</span>
								</div>
							{/if}

							{#if table.staff}
								<div class="flex items-center space-x-2 text-sm">
									<div class="w-6 h-6 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center">
										<span class="text-xs font-bold text-cyan-800 dark:text-cyan-200">
											{table.staff.firstName[0]}{table.staff.lastName[0]}
										</span>
									</div>
									<span class="text-gray-600 dark:text-gray-400">{table.staff.firstName}</span>
								</div>
							{/if}
						</div>

						{#if selectedTable === table.id}
							<div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
								<div class="grid grid-cols-2 gap-2">
									{#if table.status === 'available'}
										<Button color="cyan" size="xs" class="w-full">
											Start Session
										</Button>
										<Button color="warning" size="xs" class="w-full" outline={true}>
											Reserve
										</Button>
									{:else if table.status === 'occupied'}
										<Button color="success" size="xs" class="w-full">
											Payment
										</Button>
										<Button color="info" size="xs" class="w-full" outline={true}>
											Add Order
										</Button>
									{:else if table.status === 'reserved'}
										<Button color="success" size="xs" class="w-full">
											Seat Guest
										</Button>
										<Button color="danger" size="xs" class="w-full" outline={true}>
											Cancel
										</Button>
									{:else if table.status === 'cleaning'}
										<Button color="success" size="xs" class="w-full">
											Mark Clean
										</Button>
										<Button color="info" size="xs" class="w-full" outline={true}>
											Assign Staff
										</Button>
									{/if}
								</div>
							</div>
						{/if}
					</div>
				</Card>
			{/each}
		</div>
	{:else}
		<!-- Multi-Zone View -->
		{#each zones as zone}
			{@const zoneTables = tablesByZone.get(zone.id) || []}
			{#if zoneTables.length > 0}
				<div class="space-y-4">
					<div class="flex items-center justify-between">
						<div class="flex items-center space-x-3">
							<div class="w-4 h-4 rounded-full" style="background-color: {zone.color}"></div>
							<h3 class="text-lg font-semibold text-gray-900 dark:text-white">{zone.name}</h3>
							<Badge color="secondary" size="sm">{zoneTables.length} tables</Badge>
						</div>
						<Button color="cyan" size="sm" outline={true}>
							View Zone Details
						</Button>
					</div>

					<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
						{#each zoneTables as table}
							{@const statusConfig = getStatusBadge(table.status)}
							<Card
								hover={true}
								class="cursor-pointer transition-all duration-200 transform hover:scale-105"
								class:selected={selectedTable === table.id ? 'ring-2 ring-cyan-500' : ''}
								onclick={() => handleTableClick(table)}
							>
								<div class="p-3">
									<div class="flex items-center justify-between mb-2">
										<h4 class="font-bold text-gray-900 dark:text-white text-sm">T{table.number}</h4>
										<Badge color={statusConfig.color} size="xs" class="text-xs">{table.status.slice(0, 1).toUpperCase()}</Badge>
									</div>

									<div class="space-y-1">
										<div class="flex items-center justify-between text-xs">
											<span class="text-gray-500">Cap:</span>
											<span class="font-medium">{table.capacity}</span>
										</div>

										{#if table.currentSession}
											<div class="flex items-center justify-between text-xs">
												<span class="text-gray-500">Duration:</span>
												<span class="font-medium">{formatDuration(table.currentSession.duration)}</span>
											</div>
										{/if}

										{#if table.staff}
											<div class="flex items-center space-x-1 text-xs">
												<div class="w-4 h-4 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center">
													<span class="text-[8px] font-bold text-cyan-800 dark:text-cyan-200">
														{table.staff.firstName[0]}
													</span>
												</div>
												<span class="text-gray-600">{table.staff.firstName}</span>
											</div>
										{/if}
									</div>
								</div>
							</Card>
						{/each}
					</div>
				</div>
			{/if}
		{/each}
	{/if}

	<!-- Table Status Legend -->
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
		<h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Table Status Legend</h3>
			<div class="flex flex-wrap gap-4">
				{#each Object.entries(tableStatusConfig) as [status, config]}
					<div class="flex items-center space-x-2">
						<div class={`w-4 h-4 rounded ${config.bgColor}`}></div>
						<span class="text-sm text-gray-600 dark:text-gray-400 capitalize">{status}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>

<style>
	.card.selected {
		transform: scale(1.02);
		box-shadow: 0 0 0 2px rgb(6 182 212);
	}
</style>