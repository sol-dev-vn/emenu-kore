<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from '$lib/components/flowbite/Button.svelte';
	import Card from '$lib/components/flowbite/Card.svelte';
	import Badge from '$lib/components/flowbite/Badge.svelte';

	export let isOpen = false;

	const dispatch = createEventDispatcher();

	// Mock branch data - in real implementation, this would come from Directus API
	let branches = [
		{
			id: 'branch-1',
			name: 'SOL District 1',
			location: '123 Nguyen Hue Street, District 1',
			activeTables: 18,
			totalTables: 24,
			status: 'active',
			revenue: 45600000,
			brand: 'SOL Restaurant'
		},
		{
			id: 'branch-2',
			name: 'SOL Thao Dien',
			location: '45 Xuan Thuy Street, District 2',
			activeTables: 12,
			totalTables: 16,
			status: 'active',
			revenue: 28900000,
			brand: 'SOL Restaurant'
		},
		{
			id: 'branch-3',
			name: 'SOL Phu My Hung',
			location: '78 Nguyen Luong Bang Street, District 7',
			activeTables: 8,
			totalTables: 20,
			status: 'maintenance',
			revenue: 15600000,
			brand: 'SOL Restaurant'
		}
	];

	let selectedBranch = branches[0]; // Current branch
	let searchTerm = '';

	function handleClose() {
		isOpen = false;
		dispatch('close');
	}

	function handleBranchSelect(branch: any) {
		selectedBranch = branch;
		isOpen = false;
		dispatch('branch-change', { branch });
	}

	$: filteredBranches = branches.filter(branch =>
		branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		branch.location.toLowerCase().includes(searchTerm.toLowerCase())
	);

	function getStatusColor(status: string) {
		switch (status) {
			case 'active': return 'success';
			case 'maintenance': return 'warning';
			case 'closed': return 'danger';
			default: return 'secondary';
		}
	}

	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
	}
</script>

{#if isOpen}
	<!-- Backdrop -->
	<div class="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4" on:click={handleClose}>
		<!-- Modal Content -->
		<div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden" on:click|stopPropagation>
			<!-- Header -->
			<div class="p-6 border-b border-gray-200 dark:border-gray-700">
				<div class="flex items-center justify-between">
					<div>
						<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Select Branch</h2>
						<p class="text-gray-600 dark:text-gray-400 mt-1">Choose your current location to continue</p>
					</div>
					<Button color="secondary" size="sm" onclick={handleClose}>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					</Button>
				</div>
			</div>

			<!-- Search -->
			<div class="p-6 border-b border-gray-200 dark:border-gray-700">
				<div class="relative">
					<input
						type="text"
						placeholder="Search branches..."
						bind:value={searchTerm}
						class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
					/>
					<svg class="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
					</svg>
				</div>
			</div>

			<!-- Branch List -->
			<div class="p-6 overflow-y-auto max-h-[50vh]">
				<div class="space-y-4">
					{#each filteredBranches as branch (branch.id)}
						<Card
							hover={true}
							class={`p-4 cursor-pointer border-2 transition-all duration-200 ${
								selectedBranch.id === branch.id
									? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20'
									: 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
							}`}
							onclick={() => handleBranchSelect(branch)}
						>
							<div class="flex items-start justify-between">
								<div class="flex-1">
									<div class="flex items-center mb-2">
										<h3 class="text-lg font-semibold text-gray-900 dark:text-white">{branch.name}</h3>
										<Badge color={getStatusColor(branch.status)} size="xs" class="ml-3">
											{branch.status}
										</Badge>
									</div>
									<p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{branch.location}</p>

									<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
										<div>
											<p class="text-xs text-gray-500 dark:text-gray-400">Tables</p>
											<p class="text-sm font-semibold text-gray-900 dark:text-white">{branch.activeTables}/{branch.totalTables}</p>
										</div>
										<div>
											<p class="text-xs text-gray-500 dark:text-gray-400">Today Revenue</p>
											<p class="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(branch.revenue)}</p>
										</div>
										<div>
											<p class="text-xs text-gray-500 dark:text-gray-400">Brand</p>
											<p class="text-sm font-semibold text-gray-900 dark:text-white">{branch.brand}</p>
										</div>
										<div>
											<p class="text-xs text-gray-500 dark:text-gray-400">Status</p>
											<p class="text-sm font-semibold capitalize text-gray-900 dark:text-white">{branch.status}</p>
										</div>
									</div>
								</div>

								{#if selectedBranch.id === branch.id}
									<div class="ml-4">
										<div class="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
											<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
											</svg>
										</div>
									</div>
								{/if}
							</div>
						</Card>
					{/each}
				</div>
			</div>

			<!-- Footer -->
			<div class="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
				<div class="flex items-center justify-between">
					<p class="text-sm text-gray-600 dark:text-gray-400">
						Currently selected: <span class="font-semibold text-gray-900 dark:text-white">{selectedBranch.name}</span>
					</p>
					<div class="space-x-3">
						<Button color="secondary" onclick={handleClose}>Cancel</Button>
						<Button color="cyan" onclick={() => handleBranchSelect(selectedBranch)}>
							Confirm Selection
						</Button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}