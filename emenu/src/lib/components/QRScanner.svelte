<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import Card from '$lib/components/flowbite/Card.svelte';
	import Button from '$lib/components/flowbite/Button.svelte';
	import Badge from '$lib/components/flowbite/Badge.svelte';

	export let onScan: ((data: string) => void) | null = null;
	export let onError: ((error: string) => void) | null = null;
	export let showInstructions: boolean = true;
	export let allowFileUpload: boolean = true;
	export let continuousScan: boolean = false;

	let videoElement: HTMLVideoElement;
	let canvasElement: HTMLCanvasElement;
	let scanningStream: MediaStream | null = null;
	let isScanning: boolean = false;
	let scanResult: string | null = null;
	let scanError: string | null = null;
	let lastScanTime: number = 0;
	let scanCount: number = 0;
	let selectedFile: File | null = null;
	let fileInput: HTMLInputElement;

	// Event dispatcher
	const dispatcher = createEventDispatcher();

	// QR code scanning library options
	let qrScanner: any = null;
	let scanInterval: NodeJS.Timeout | null = null;

	onMount(async () => {
		await initializeScanner();
	});

	onDestroy(() => {
		stopScanning();
	});

	async function initializeScanner() {
		try {
			// Load QR code scanning library
			// In a real implementation, this would load a library like qr-scanner or jsQR
			// For now, we'll simulate the functionality
			console.log('QR Scanner initialized');
		} catch (error) {
			console.error('Failed to initialize QR scanner:', error);
			setScanError('Failed to initialize QR scanner');
		}
	}

	async function startScanning() {
		try {
			isScanning = true;
			scanError = null;
			scanResult = null;

			// Request camera access
			const constraints = {
				video: {
					facingMode: 'environment',
					width: { ideal: 1280 },
					height: { ideal: 720 }
				}
			};

			scanningStream = await navigator.mediaDevices.getUserMedia(constraints);

			if (videoElement) {
				videoElement.srcObject = scanningStream;
				await videoElement.play();

				// Start scanning process
				startScanProcess();
			}
		} catch (error) {
			console.error('Failed to start scanning:', error);
			setScanError('Failed to access camera. Please check permissions.');
			isScanning = false;
		}
	}

	function startScanProcess() {
		if (scanInterval) {
			clearInterval(scanInterval);
		}

		scanInterval = setInterval(() => {
			if (videoElement && canvasElement && isScanning) {
				try {
					// Draw video frame to canvas
					const context = canvasElement.getContext('2d');
					if (context) {
						canvasElement.width = videoElement.videoWidth;
						canvasElement.height = videoElement.videoHeight;
						context.drawImage(videoElement, 0, 0);

						// Simulate QR code detection
						// In a real implementation, this would use a QR code detection library
						detectQRCode();
					}
				} catch (error) {
					console.error('Error during scan process:', error);
				}
			}
		}, 500); // Scan every 500ms
	}

	function detectQRCode() {
		// Simulate QR code detection
		// In a real implementation, this would use a library like jsQR
		const shouldDetect = Math.random() > 0.95; // 5% chance to detect a QR code for demo

		if (shouldDetect && !continuousScan && Date.now() - lastScanTime > 2000) {
			// Generate a mock QR code result
			const mockResults = [
				`https://sol-restaurant.com/menu/table-${Math.floor(Math.random() * 20) + 1}`,
				`https://sol-restaurant.com/qr/table-${Math.floor(Math.random() * 20) + 1}`,
				`https://sol-restaurant.com/order/table-${Math.floor(Math.random() * 20) + 1}`,
				`table-${Math.floor(Math.random() * 20) + 1}`
			];

			const result = mockResults[Math.floor(Math.random() * mockResults.length)];
			handleScanResult(result);
		}
	}

	function handleScanResult(result: string) {
		scanResult = result;
		lastScanTime = Date.now();
		scanCount++;

		// Vibrate device if supported
		if (navigator.vibrate) {
			navigator.vibrate(200);
		}

		// Call onScan callback
		if (onScan) {
			onScan(result);
		}

		// Dispatch custom event
		dispatcher('scan', { result, timestamp: new Date() });

		// Stop scanning if not continuous scan
		if (!continuousScan) {
			stopScanning();
		}
	}

	function stopScanning() {
		isScanning = false;

		if (scanInterval) {
			clearInterval(scanInterval);
			scanInterval = null;
		}

		if (scanningStream) {
			scanningStream.getTracks().forEach(track => track.stop());
			scanningStream = null;
		}

		if (videoElement) {
			videoElement.srcObject = null;
		}
	}

	function setScanError(error: string) {
		scanError = error;
		if (onError) {
			onError(error);
		}
		dispatcher('error', { error });
	}

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (file) {
			selectedFile = file;
			processFileQR(file);
		}
	}

	async function processFileQR(file: File) {
		try {
			scanError = null;

			// Create a FileReader to read the image
			const reader = new FileReader();

			reader.onload = async (e) => {
				const img = new Image();
				img.onload = () => {
					if (canvasElement) {
						const context = canvasElement.getContext('2d');
						if (context) {
							canvasElement.width = img.width;
							canvasElement.height = img.height;
							context.drawImage(img, 0, 0);

							// Simulate QR code detection from file
							// In a real implementation, this would use a QR code detection library
							setTimeout(() => {
								const mockResult = `https://sol-restaurant.com/menu/table-${Math.floor(Math.random() * 20) + 1}`;
								handleScanResult(mockResult);
							}, 1000);
						}
					}
				};
				img.src = e.target?.result as string;
			};

			reader.readAsDataURL(file);
		} catch (error) {
			console.error('Failed to process file:', error);
			setScanError('Failed to process image file');
		}
	}

	function clearResult() {
		scanResult = null;
		scanError = null;
		selectedFile = null;
		if (fileInput) {
			fileInput.value = '';
		}
	}

	function getDeviceCapabilities(): { camera: boolean; vibrate: boolean } {
		return {
			camera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
			vibrate: 'vibrate' in navigator
		};
	}

	$: capabilities = getDeviceCapabilities();

	// Format scan result for display
	function formatScanResult(result: string): string {
		// Extract table ID from URL if it's a URL
		const urlMatch = result.match(/\/(?:menu|qr|order)\/(?:table-)?(\d+)/i);
		if (urlMatch) {
			return `Table ${urlMatch[1]}`;
		}

		// Extract table ID if it's in format "table-X"
		const tableMatch = result.match(/table-(\d+)/i);
		if (tableMatch) {
			return `Table ${tableMatch[1]}`;
		}

		return result;
	}

	// Get scan duration
	function getScanDuration(): string {
		if (lastScanTime === 0) return '0s';
		const duration = Math.floor((Date.now() - lastScanTime) / 1000);
		return `${duration}s ago`;
	}
</script>

<!-- QR Scanner Component -->
<div class="space-y-6">
	<!-- Scanner Header -->
	<div class="flex items-center justify-between">
		<div class="flex items-center space-x-3">
			<h2 class="text-xl font-bold text-gray-900 dark:text-white">QR Code Scanner</h2>
			{#if scanCount > 0}
				<Badge color="success" size="sm">{scanCount} scans</Badge>
			{/if}
		</div>
		<div class="flex items-center space-x-2">
			{#if isScanning}
				<div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
				<span class="text-sm text-gray-600 dark:text-gray-400">Scanning...</span>
			{:else}
				<div class="w-2 h-2 bg-gray-400 rounded-full"></div>
				<span class="text-sm text-gray-600 dark:text-gray-400">Ready</span>
			{/if}
		</div>
	</div>

	<!-- Instructions -->
	{#if showInstructions && !scanResult}
		<Card class="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
			<div class="flex items-start space-x-3">
				<svg class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
				</svg>
				<div>
					<h3 class="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">How to scan QR codes</h3>
					<ul class="text-sm text-blue-700 dark:text-blue-300 space-y-1">
						<li>• Position the QR code within the camera frame</li>
						<li>• Ensure good lighting and focus</li>
						<li>• Hold steady until the code is detected</li>
						{#if allowFileUpload}
						<li>• Or upload an image containing a QR code</li>
						{/if}
					</ul>
				</div>
			</div>
		</Card>
	{/if}

	<!-- Scan Result -->
	{#if scanResult}
		<Card class="p-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
			<div class="flex items-start space-x-4">
				<div class="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg">
					<svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
				</div>
				<div class="flex-1">
					<h3 class="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">QR Code Scanned!</h3>
					<p class="text-sm text-green-700 dark:text-green-300 mb-1">
						<strong>Detected:</strong> {formatScanResult(scanResult)}
					</p>
					<p class="text-xs text-green-600 dark:text-green-400">
						Scanned {getScanDuration()} • Total scans: {scanCount}
					</p>
					<div class="mt-3">
						<code class="text-xs bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 px-2 py-1 rounded">
							{scanResult}
						</code>
					</div>
				</div>
				<Button color="secondary" size="sm" onclick={clearResult}>
					Scan Again
				</Button>
			</div>
		</Card>
	{/if}

	<!-- Error Display -->
	{#if scanError}
		<Card class="p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
			<div class="flex items-start space-x-4">
				<div class="p-3 bg-red-100 dark:bg-red-900/50 rounded-lg">
					<svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
				</div>
				<div class="flex-1">
					<h3 class="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">Scanning Error</h3>
					<p class="text-sm text-red-700 dark:text-red-300">{scanError}</p>
				</div>
				<Button color="secondary" size="sm" onclick={() => { scanError = null; }}>
					Try Again
				</Button>
			</div>
		</Card>
	{/if}

	<!-- Scanner Interface -->
	{#if !scanResult}
		<Card class="overflow-hidden">
			<div class="relative">
				<!-- Video Preview -->
				<div class="relative bg-black">
					<video
						bind:this={videoElement}
						class="w-full h-64 object-cover"
						autoplay
						muted
						playsinline
					></video>

					<!-- Scanning Overlay -->
					{#if isScanning}
						<div class="absolute inset-0 pointer-events-none">
							<div class="absolute inset-0 bg-cyan-500 opacity-10"></div>
							<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
								<div class="w-48 h-48 border-2 border-cyan-500 rounded-lg relative">
									<div class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-cyan-500 rounded-tl-lg"></div>
									<div class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-cyan-500 rounded-tr-lg"></div>
									<div class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-cyan-500 rounded-bl-lg"></div>
									<div class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-cyan-500 rounded-br-lg"></div>
								</div>
							</div>
							<div class="absolute bottom-4 left-1/2 transform -translate-x-1/2">
								<div class="bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm">
									Scanning...
								</div>
							</div>
						</div>
					{:else}
						<div class="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
							<div class="text-center">
								<svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
								</svg>
								<p class="text-gray-400 text-sm">Camera preview will appear here</p>
							</div>
						</div>
					{/if}
				</div>

				<!-- Hidden Canvas for QR Processing -->
				<canvas bind:this={canvasElement} class="hidden"></canvas>

				<!-- Controls -->
				<div class="p-4 bg-gray-50 dark:bg-gray-800">
					<div class="flex items-center justify-between">
						<div class="flex items-center space-x-2">
							{#if capabilities.camera}
								{#if isScanning}
									<Button color="danger" onclick={stopScanning}>
										<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"></path>
										</svg>
										Stop Scanning
									</Button>
								{:else}
									<Button color="cyan" onclick={startScanning}>
										<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
										</svg>
										Start Scanning
									</Button>
								{/if}
							{:else}
								<Badge color="danger" size="sm">Camera not available</Badge>
							{/if}

							{#if continuousScan}
								<Badge color="warning" size="sm">Continuous Mode</Badge>
							{/if}
						</div>

						{#if allowFileUpload}
							<div class="flex items-center space-x-2">
								<input
									bind:this={fileInput}
									type="file"
									accept="image/*"
									onchange={handleFileSelect}
									class="hidden"
								/>
								<Button color="secondary" size="sm" onclick={() => fileInput?.click()}>
									<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
									</svg>
									Upload Image
								</Button>
							</div>
						{/if}
					</div>

					<!-- Device Capabilities -->
					<div class="mt-4 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
						{#if capabilities.camera}
							<div class="flex items-center space-x-1">
								<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
								</svg>
								<span>Camera available</span>
							</div>
						{:else}
							<div class="flex items-center space-x-1">
								<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
								</svg>
								<span>No camera access</span>
							</div>
						{/if}

						{#if capabilities.vibrate}
							<div class="flex items-center space-x-1">
								<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
								</svg>
								<span>Haptic feedback</span>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</Card>
	{/if}

	<!-- Tips -->
	<Card class="p-4">
		<h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Tips for better scanning</h3>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
			<div class="flex items-start space-x-2">
				<svg class="w-4 h-4 text-cyan-600 dark:text-cyan-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
				</svg>
				<span class="text-xs text-gray-600 dark:text-gray-400">Ensure the QR code is clean and undamaged</span>
			</div>
			<div class="flex items-start space-x-2">
				<svg class="w-4 h-4 text-cyan-600 dark:text-cyan-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
				</svg>
				<span class="text-xs text-gray-600 dark:text-gray-400">Keep your hand steady while scanning</span>
			</div>
			<div class="flex items-start space-x-2">
				<svg class="w-4 h-4 text-cyan-600 dark:text-cyan-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
				</svg>
				<span class="text-xs text-gray-600 dark:text-gray-400">Avoid glare and reflections</span>
			</div>
			<div class="flex items-start space-x-2">
				<svg class="w-4 h-4 text-cyan-600 dark:text-cyan-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
				</svg>
				<span class="text-xs text-gray-600 dark:text-gray-400">Hold the device 6-12 inches away</span>
			</div>
		</div>
	</Card>
</div>