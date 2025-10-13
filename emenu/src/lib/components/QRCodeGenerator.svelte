<script lang="ts">
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import Card from '$lib/components/flowbite/Card.svelte';
	import Button from '$lib/components/flowbite/Button.svelte';
	import Badge from '$lib/components/flowbite/Badge.svelte';

	export let tables: any[] = [];
	export let onGenerate: ((data: { tableId: string; qrCode: string; tableData: any }) => void) | null = null;
	export let onBulkGenerate: ((data: { results: any[] }) => void) | null = null;
	export let showBulkMode: boolean = false;
	export let allowDownload: boolean = true;

	let selectedTables: string[] = [];
	let generating: boolean = false;
	let generatedCodes: { tableId: string; qrCode: string; tableData: any }[] = [];
	let downloadFormat: 'png' | 'svg' | 'pdf' = 'png';
	let qrSize: 'small' | 'medium' | 'large' = 'medium';

	// Event dispatcher
	const dispatcher = createEventDispatcher();

	// QR code generation options
	const qrOptions = {
		small: { width: 128, height: 128, margin: 2 },
		medium: { width: 256, height: 256, margin: 4 },
		large: { width: 512, height: 512, margin: 8 }
	};

	onMount(() => {
		// Initialize tables if not provided
		if (tables.length === 0) {
			tables = generateMockTables();
		}
	});

	function generateMockTables() {
		const mockTables = [];
		const zones = ['Main Dining', 'Terrace', 'Private Room A', 'Private Room B', 'Bar'];

		for (let i = 1; i <= 20; i++) {
			mockTables.push({
				id: `table-${i}`,
				name: `Table ${i}`,
				number: i,
				zone: zones[Math.floor(Math.random() * zones.length)],
				capacity: Math.random() > 0.5 ? 4 : 6,
				status: Math.random() > 0.7 ? 'available' : Math.random() > 0.3 ? 'occupied' : 'reserved',
				qrCode: `https://sol-restaurant.com/menu/table-${i}`,
				lastGenerated: null
			});
		}
		return mockTables;
	}

	async function generateQRCode(tableId: string) {
		try {
			generating = true;
			const table = tables.find(t => t.id === tableId);

			if (!table) {
				throw new Error(`Table ${tableId} not found`);
			}

			// Simulate QR code generation
			await new Promise(resolve => setTimeout(resolve, 1000));

			const qrCode = {
				tableId: table.id,
				qrCode: `https://sol-restaurant.com/menu/table-${table.number}`,
				tableData: {
					...table,
					generatedAt: new Date(),
					generatedBy: 'staff-user'
				}
			};

			// Update table with generated code info
			table.qrCode = qrCode.qrCode;
			table.lastGenerated = qrCode.tableData.generatedAt;

			generatedCodes = [qrCode, ...generatedCodes];

			// Call onGenerate callback
			if (onGenerate) {
				onGenerate(qrCode);
			}

			// Dispatch event
			dispatcher('generated', qrCode);

		} catch (error) {
			console.error('Failed to generate QR code:', error);
			dispatcher('error', { error: error.message, tableId });
		} finally {
			generating = false;
		}
	}

	async function generateBulkQRCodes() {
		try {
			generating = true;
			const results = [];

			// Generate QR codes for selected tables
			for (const tableId of selectedTables) {
				const table = tables.find(t => t.id === tableId);
				if (table) {
					await new Promise(resolve => setTimeout(resolve, 500));

					const qrCode = {
						tableId: table.id,
						qrCode: `https://sol-restaurant.com/menu/table-${table.number}`,
						tableData: {
							...table,
							generatedAt: new Date(),
							generatedBy: 'bulk-operation'
						}
					};

					table.qrCode = qrCode.qrCode;
					table.lastGenerated = qrCode.tableData.generatedAt;
					results.push(qrCode);
				}
			}

			generatedCodes = [...results, ...generatedCodes];
			selectedTables = [];

			// Call onBulkGenerate callback
			if (onBulkGenerate) {
				onBulkGenerate({ results });
			}

			// Dispatch event
			dispatcher('bulkGenerated', { results });

		} catch (error) {
			console.error('Failed to generate bulk QR codes:', error);
			dispatcher('error', { error: error.message });
		} finally {
			generating = false;
		}
	}

	function downloadQRCode(qrCode: any) {
		if (!allowDownload) return;

		const size = qrOptions[qrSize];
		const dataUrl = generateMockQRDataURL(size, qrCode.qrCode);

		// Create download link
		const link = document.createElement('a');
		link.href = dataUrl;
		link.download = `qr-${qrCode.tableData.name}.${downloadFormat}`;
		link.click();
	}

	function generateMockQRDataURL(size: any, text: string): string {
		// In a real implementation, this would generate actual QR code images
		// For now, return a mock data URL
		const canvas = document.createElement('canvas');
		canvas.width = size.width;
		canvas.height = size.height;
		const ctx = canvas.getContext('2d');

		// Create mock QR code pattern
		const cellSize = size.width / 25;
		const margin = size.margin;

		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, size.width, size.height);

		ctx.fillStyle = '#000000';
		for (let row = 0; row < 25; row++) {
			for (let col = 0; col < 25; col++) {
				if ((row + col) % 2 === 0) {
					ctx.fillRect(
						margin + col * cellSize,
						margin + row * cellSize,
						cellSize,
						cellSize
					);
				}
			}
		}

		return canvas.toDataURL(`image/${downloadFormat}`);
	}

	function downloadAllQRCodes() {
		if (!allowDownload || generatedCodes.length === 0) return;

		// In a real implementation, this would create a ZIP file
		// For now, download the first code
		if (generatedCodes.length > 0) {
			downloadQRCode(generatedCodes[0]);
		}
	}

	function clearGeneratedCodes() {
		generatedCodes = [];
		selectedTables = [];
	}

	function toggleTableSelection(tableId: string) {
		const index = selectedTables.indexOf(tableId);
		if (index > -1) {
			selectedTables.splice(index, 1);
		} else {
			selectedTables = [...selectedTables, tableId];
		}
	}

	function selectAllTables() {
		selectedTables = tables.map(table => table.id);
	}

	function deselectAllTables() {
		selectedTables = [];
	}

	function getTableStatusColor(status: string): string {
		switch (status) {
			case 'available': return 'success';
			case 'occupied': return 'danger';
			case 'reserved': return 'warning';
			case 'cleaning': return 'info';
			default: return 'secondary';
		}
	}

	function formatFileSize(size: number): string {
		if (size < 1024) return `${size} bytes`;
		if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
		return `${(size / (1024 * 1024)).toFixed(1)} MB`;
	}

	function formatDate(date: Date): string {
		return date.toLocaleString();
	}

	$: hasSelectedTables = selectedTables.length > 0;
	$: canGenerateBulk = hasSelectedTables && !generating;
	$: hasGeneratedCodes = generatedCodes.length > 0;
</script>

<!-- QR Code Generator Component -->
<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div class="flex items-center space-x-3">
			<h2 class="text-xl font-bold text-gray-900 dark:text-white">QR Code Generator</h2>
			{#if generating}
				<div class="flex items-center space-x-2">
					<div class="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
					<span class="text-sm text-gray-600 dark:text-gray-400">Generating...</span>
				</div>
			{:else if hasGeneratedCodes}
				<Badge color="success" size="sm">{generatedCodes.length} codes</Badge>
			{:else}
				<Badge color="secondary" size="sm">Ready</Badge>
			{/if}
		</div>
		<div class="flex items-center space-x-2">
			<Button color="secondary" size="sm" onclick={() => showBulkMode = !showBulkMode}>
				<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
				</svg>
				{showBulkMode ? 'Single Mode' : 'Bulk Mode'}
			</Button>
			{#if allowDownload}
				<div class="flex items-center space-x-2">
					<select bind:value={downloadFormat} class="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1">
						<option value="png">PNG</option>
						<option value="svg">SVG</option>
						<option value="pdf">PDF</option>
					</select>
					<select bind:value={qrSize} class="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1">
						<option value="small">Small</option>
						<option value="medium">Medium</option>
						<option value="large">Large</option>
					</select>
				</div>
			{/if}
		</div>
	</div>

	<!-- Bulk Mode -->
	{#if showBulkMode}
		<Card class="p-6">
			<div class="flex items-center justify-between mb-4">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Bulk Generation</h3>
				<div class="flex items-center space-x-2">
					<Button color="secondary" size="sm" onclick={selectAllTables} disabled={generating}>
						Select All
					</Button>
					<Button color="secondary" size="sm" onclick={deselectAllTables} disabled={generating}>
						Deselect All
					</Button>
					<Badge color="cyan" size="sm">
						{selectedTables.length} selected
					</Badge>
				</div>
			</div>

			<!-- Table Selection Grid -->
			<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-64 overflow-y-auto">
				{#each tables as table}
					<div class="relative">
						<input
							type="checkbox"
							checked={selectedTables.includes(table.id)}
							onchange={() => toggleTableSelection(table.id)}
							class="sr-only"
							id="table-{table.id}"
						/>
						<label
							for="table-{table.id}"
							class={`block p-3 border-2 rounded-lg cursor-pointer transition-colors ${
								selectedTables.includes(table.id)
									? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20'
									: 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
							}`}
						>
							<div class="text-center">
								<p class="font-medium text-gray-900 dark:text-white text-sm">{table.name}</p>
								<div class="flex items-center justify-center space-x-1 mt-1">
									<Badge color={getTableStatusColor(table.status)} size="xs">
										{table.status}
									</Badge>
									<span class="text-xs text-gray-500 dark:text-gray-400">
										{table.capacity} seats
									</span>
								</div>
							</div>
						</label>
					</div>
				{/each}
			</div>

			<!-- Bulk Actions -->
			<div class="flex items-center justify-between mt-4">
				<p class="text-sm text-gray-600 dark:text-gray-400">
					{hasSelectedTables ? `${selectedTables.length} tables selected` : 'No tables selected'}
				</p>
				<div class="flex items-center space-x-2">
					<Button
						color="cyan"
						onclick={generateBulkQRCodes}
						disabled={!canGenerate}
					>
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
						</svg>
						Generate {selectedTables.length} Codes
					</Button>
				</div>
			</div>
		</Card>
	{/if}

	<!-- Single Mode - Table Selection -->
	{#if !showBulkMode}
		<Card class="p-6">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Select Table</h3>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each tables as table}
					<div
						class={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
							table.qrCode
								? 'border-green-500 bg-green-50 dark:bg-green-900/20'
								: 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
						}`}
						onclick={() => generateQRCode(table.id)}
					>
						<div class="flex items-start justify-between">
							<div>
								<p class="font-medium text-gray-900 dark:text-white">{table.name}</p>
								<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
									{table.zone} • {table.capacity} seats
								</p>
							</div>
							<div class="flex flex-col space-y-2">
								<Badge color={getTableStatusColor(table.status)} size="sm">
									{table.status}
								</Badge>
								{#if table.qrCode}
									<Badge color="success" size="xs">QR Ready</Badge>
								{:else}
									<Badge color="secondary" size="xs">No QR</Badge>
								{/if}
							</div>
						</div>
						{#if table.qrCode && table.lastGenerated}
							<div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
								<p class="text-xs text-gray-500 dark:text-gray-400">
									Generated: {formatDate(table.lastGenerated)}
								</p>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</Card>
	{/if}

	<!-- Generated Codes -->
	{#if hasGeneratedCodes}
		<Card class="p-6">
			<div class="flex items-center justify-between mb-4">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Generated QR Codes</h3>
				<div class="flex items-center space-x-2">
					{#if allowDownload}
						<Button color="cyan" size="sm" onclick={downloadAllQRCodes}>
							<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.707.293H19a2 2 0 012 2v8a2 2 0 01-2 2h-5.586a1 1 0 01-.707-.293l-5.414-5.414a1 1 0 01-.707-.293z"></path>
							</svg>
							Download All
						</Button>
					{/if}
					<Button color="secondary" size="sm" onclick={clearGeneratedCodes}>
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m0 0V5a2 2 0 012-2h10a2 2 0 012 2v6"></path>
						</svg>
						Clear All
					</Button>
				</div>
			</div>

			<!-- Generated Codes Grid -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
				{#each generatedCodes as qrCode}
					<div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
						<div class="flex items-start justify-between">
							<div>
								<p class="font-medium text-gray-900 dark:text-white">{qrCode.tableData.name}</p>
								<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
									{qrCode.tableData.zone} • {qrCode.tableData.capacity} seats
								</p>
								<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
									Generated: {formatDate(qrCode.tableData.generatedAt)}
								</p>
								<p class="text-xs text-cyan-600 dark:text-cyan-400 mt-1 font-mono">
									{qrCode.qrCode}
								</p>
							</div>
							{#if allowDownload}
								<Button
									color="secondary"
									size="sm"
									onclick={() => downloadQRCode(qrCode)}
								>
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.707.293H19a2 2 0 012 2v8a2 2 0 01-2 2h-5.586a1 1 0 01-.707-.293l-5.414-5.414a1 1 0 01-.707-.293z"></path>
									</svg>
								</Button>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</Card>
	{/if}

	<!-- Statistics -->
	<Card class="p-6">
		<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Generation Statistics</h3>
		<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
			<div class="text-center">
				<p class="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{tables.length}</p>
				<p class="text-sm text-gray-600 dark:text-gray-400">Total Tables</p>
			</div>
			<div class="text-center">
				<p class="text-2xl font-bold text-green-600 dark:text-green-400">{generatedCodes.length}</p>
				<p class="text-sm text-gray-600 dark:text-gray-400">Codes Generated</p>
			</div>
			<div class="text-center">
				<p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{tables.filter(t => t.qrCode).length}</p>
				<p class="text-sm text-gray-600 dark:text-gray-400">Tables with QR</p>
			</div>
			<div class="text-center">
				<p class="text-2xl font-bold text-orange-600 dark:text-orange-400">
					{tables.filter(t => t.status === 'available').length}
				</p>
				<p class="text-sm text-gray-600 dark:text-gray-400">Available Tables</p>
			</div>
		</div>
	</Card>
</div>