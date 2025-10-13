<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import Card from '$lib/components/flowbite/Card.svelte';
	import Badge from '$lib/components/flowbite/Badge.svelte';
	import Button from '$lib/components/flowbite/Button.svelte';
	import type { RecentActivity } from '$lib/server/dashboard';

	export let activities: RecentActivity[] = [];
	export let maxItems: number = 10;
	export let showFilters: boolean = true;
	export let realTimeUpdates: boolean = true;
	export let onUpdate: ((activities: RecentActivity[]) => void) | null = null;

	let updateInterval: NodeJS.Timeout | null = null;
	let isUpdating = false;
	let filterType: string = 'all';
	let searchQuery: string = '';
	let showNotifications: boolean = false;
	let notificationCount: number = 0;
	let unreadActivities: string[] = [];

	// Event dispatcher for real-time updates
	const dispatcher = createEventDispatcher();

	// Filter options
	const activityTypes = [
		{ value: 'all', label: 'All Activity', icon: '📋' },
		{ value: 'order', label: 'Orders', icon: '📋' },
		{ value: 'staff', label: 'Staff', icon: '👤' },
		{ value: 'table', label: 'Tables', icon: '🪑' },
		{ value: 'payment', label: 'Payments', icon: '💰' },
		{ value: 'reservation', label: 'Reservations', icon: '📅' },
		{ value: 'cleaning', label: 'Cleaning', icon: '🧹' },
		{ value: 'session', label: 'Sessions', icon: '🍽️' }
	];

	onMount(() => {
		if (realTimeUpdates) {
			startRealTimeUpdates();
		}
		loadUnreadActivities();
	});

	onDestroy(() => {
		if (updateInterval) {
			clearInterval(updateInterval);
		}
	});

	function startRealTimeUpdates() {
		// Update activity feed every 15 seconds
		updateInterval = setInterval(() => {
			updateActivities();
		}, 15000);

		// Listen for custom updates from parent components
		dispatcher.on('updateActivities', handleManualUpdate);
	}

	async function updateActivities() {
		if (isUpdating) return;

		isUpdating = true;

		try {
			// Simulate real-time activity updates
			// In a real implementation, this would fetch from WebSocket or API
			const newActivities = generateMockActivities();

			// Merge new activities with existing ones
			activities = [...newActivities, ...activities].slice(0, 50); // Keep max 50 items

			// Update notification count for unread activities
			updateNotificationCount();

			// Notify parent component of updates
			if (onUpdate) {
				onUpdate(activities);
			}
		} catch (error) {
			console.error('Failed to update activities:', error);
		} finally {
			isUpdating = false;
		}
	}

	function handleManualUpdate(event: CustomEvent) {
		const { newActivities } = event.detail;
		if (newActivities) {
			activities = [...newActivities, ...activities].slice(0, 50);
			updateNotificationCount();
		}
	}

	function generateMockActivities(): RecentActivity[] {
		const types: RecentActivity['type'][] = ['order', 'staff', 'table', 'payment', 'reservation', 'cleaning', 'session'];
		const messages = {
			order: [
				'New order placed at Table {table}',
				'Order updated for {customer}',
				'Order completed - Table {table}',
				'Special order request received'
			],
			staff: [
				'{staff} logged in',
				'{staff} logged out',
				'{staff} started shift',
				'{staff} completed training'
			],
			table: [
				'Table {table} is now available',
				'Table {table} requested cleaning',
				'Table {table} reserved for {customer}',
				'Table {table} merged with Table {table2}'
			],
			payment: [
				'Payment received: {amount}',
				'Payment method updated',
				'Refund processed for order #{order}',
				'Tip added to payment'
			],
			reservation: [
				'New reservation for {party}',
				'Reservation modified',
				'Reservation cancelled',
				'Walk-in party seated'
			],
			cleaning: [
				'Cleaning requested for Table {table}',
				'Table {table} cleaning completed',
				'Emergency cleaning needed',
				'Cleaning supplies restocked'
			],
			session: [
				'Session started at Table {table}',
				'Session ended - Total: {amount}',
				'Long running session at Table {table}',
				'Session paused'
			]
		};

		const newActivities: RecentActivity[] = [];
		const numActivities = Math.floor(Math.random() * 3) + 1; // 1-3 new activities

		for (let i = 0; i < numActivities; i++) {
			const type = types[Math.floor(Math.random() * types.length)];
			const typeMessages = messages[type];
			const message = typeMessages[Math.floor(Math.random() * typeMessages.length)];

			// Replace placeholders
			const processedMessage = message
				.replace('{table}', String(Math.floor(Math.random() * 20) + 1))
				.replace('{table2}', String(Math.floor(Math.random() * 20) + 1))
				.replace('{customer}', `Customer ${Math.floor(Math.random() * 100) + 1}`)
				.replace('{staff}', `Staff ${Math.floor(Math.random() * 20) + 1}`)
				.replace('{party}', `${Math.floor(Math.random() * 6) + 2} guests`)
				.replace('{order}', String(Math.floor(Math.random() * 999) + 1))
				.replace('{amount}', `₫${(Math.random() * 1000000 + 100000).toFixed(0)}`);

			const priority: RecentActivity['priority'] =
				Math.random() > 0.8 ? 'high' :
				Math.random() > 0.6 ? 'medium' : 'low';

			newActivities.push({
				id: `activity-${Date.now()}-${i}`,
				type,
				message: processedMessage,
				time: 'Just now',
				user: ['System', 'Customer', 'Staff', 'Manager'][Math.floor(Math.random() * 4)],
				timestamp: new Date(),
				priority
			});
		}

		return newActivities;
	}

	function loadUnreadActivities() {
		// Load unread activities from localStorage
		const stored = localStorage.getItem('unreadActivities');
		if (stored) {
			unreadActivities = JSON.parse(stored);
		}
		updateNotificationCount();
	}

	function updateNotificationCount() {
		const recentUnread = activities.filter(activity =>
			unreadActivities.includes(activity.id) ||
			!activities.some(a => a.id === activity.id)
		);

		notificationCount = recentUnread.length;
	}

	function markAsRead(activityId: string) {
		unreadActivities = unreadActivities.filter(id => id !== activityId);
		localStorage.setItem('unreadActivities', JSON.stringify(unreadActivities));
		updateNotificationCount();
	}

	function markAllAsRead() {
		unreadActivities = [];
		localStorage.setItem('unreadActivities', JSON.stringify(unreadActivities));
		notificationCount = 0;
	}

	$: filteredActivities = (() => {
		let filtered = [...activities];

		// Apply type filter
		if (filterType !== 'all') {
			filtered = filtered.filter(activity => activity.type === filterType);
		}

		// Apply search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(activity =>
				activity.message.toLowerCase().includes(query) ||
				activity.user.toLowerCase().includes(query) ||
				activity.type.toLowerCase().includes(query)
			);
		}

		// Limit to max items
		return filtered.slice(0, maxItems);
	})();

	function formatActivityTime(activity: RecentActivity): string {
		if (activity.timestamp) {
			const now = new Date();
			const diffMs = now.getTime() - activity.timestamp.getTime();
			const diffMins = Math.floor(diffMs / (1000 * 60));
			const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

			if (diffMins < 1) return 'Just now';
			if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
			if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
			return activity.timestamp.toLocaleDateString();
		}
		return activity.time;
	}

	function getActivityIcon(type: string): string {
		switch (type) {
			case 'order': return '📋';
			case 'staff': return '👤';
			case 'table': return '🪑';
			case 'payment': return '💰';
			case 'reservation': return '📅';
			case 'cleaning': return '🧹';
			case 'session': return '🍽️';
			default: return '📌';
		}
	}

	function getPriorityColor(priority: string): string {
		switch (priority) {
			case 'high': return 'danger';
			case 'medium': return 'warning';
			case 'low': return 'success';
			default: return 'secondary';
		}
	}

	function getTypeColor(type: string): string {
		switch (type) {
			case 'order': return 'blue';
			case 'staff': return 'green';
			case 'table': return 'orange';
			case 'payment': return 'purple';
			case 'reservation': return 'indigo';
			case 'cleaning': return 'cyan';
			case 'session': return 'pink';
			default: return 'gray';
		}
	}

	function handleActivityClick(activity: RecentActivity) {
		// Mark as read
		markAsRead(activity.id);

		// Could trigger navigation to related item
		console.log('Activity clicked:', activity);
	}
</script>

<!-- Activity Feed Header -->
<div class="space-y-4">
	<!-- Header with Notifications -->
	<div class="flex items-center justify-between">
		<div class="flex items-center space-x-3">
			<h2 class="text-xl font-bold text-gray-900 dark:text-white">Activity Feed</h2>
			<div class="flex items-center space-x-2">
				<div class={`w-2 h-2 rounded-full ${isUpdating ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
				<span class="text-sm text-gray-600 dark:text-gray-400">
					{isUpdating ? 'Updating...' : 'Live'}
				</span>
			</div>
			{#if notificationCount > 0}
				<button
					onclick={() => showNotifications = !showNotifications}
					class="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
					</svg>
					<span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
						{notificationCount > 9 ? '9+' : notificationCount}
					</span>
				</button>
			{/if}
		</div>
		<div class="flex items-center space-x-2">
			{#if notificationCount > 0}
				<Button color="cyan" size="sm" onclick={markAllAsRead}>
					Mark All Read
				</Button>
			{/if}
			<Button color="secondary" size="sm" onclick={updateActivities} disabled={isUpdating}>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
				</svg>
				Refresh
			</Button>
		</div>
	</div>

	<!-- Filters -->
	{#if showFilters}
		<Card class="p-4">
			<div class="flex flex-col sm:flex-row gap-4">
				<!-- Type Filter -->
				<div class="flex-1">
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by Type</label>
					<div class="flex flex-wrap gap-2">
						{#each activityTypes as type}
							<button
								class={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
									filterType === type.value
										? 'bg-cyan-600 text-white'
										: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
								}`}
								onclick={() => filterType = type.value}
							>
								<span class="mr-1">{type.icon}</span>
								{type.label}
							</button>
						{/each}
					</div>
				</div>

				<!-- Search -->
				<div class="flex-1">
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search</label>
					<div class="relative">
						<input
							type="text"
							placeholder="Search activities..."
							bind:value={searchQuery}
							class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
						/>
						<svg class="w-4 h-4 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
						</svg>
					</div>
				</div>
			</div>
		</Card>
	{/if}

	<!-- Activity List -->
	<Card>
		<div class="p-6">
			<div class="space-y-4">
				{#each filteredActivities as activity}
					<div
						class="flex items-start space-x-3 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
						onclick={() => handleActivityClick(activity)}
					>
						<!-- Activity Icon -->
						<div class="text-2xl mt-1 group-hover:scale-110 transition-transform">
							{getActivityIcon(activity.type)}
						</div>

						<!-- Activity Content -->
						<div class="flex-1 min-w-0">
							<div class="flex items-start justify-between">
								<div class="flex-1">
									<p class="text-sm font-medium text-gray-900 dark:text-white mb-1">
										{activity.message}
									</p>
									<div class="flex items-center space-x-3">
										<span class="text-xs text-gray-500 dark:text-gray-400">
											{formatActivityTime(activity)}
										</span>
										<span class="text-xs text-gray-500 dark:text-gray-400">
											• {activity.user}
										</span>
										<Badge color={getTypeColor(activity.type)} size="xs">
											{activity.type}
										</Badge>
										{#if activity.priority}
											<Badge color={getPriorityColor(activity.priority)} size="xs">
												{activity.priority}
											</Badge>
										{/if}
									</div>
								</div>

								<!-- Unread Indicator -->
								{#if unreadActivities.includes(activity.id)}
									<div class="w-2 h-2 bg-cyan-600 rounded-full ml-2"></div>
								{/if}
							</div>
						</div>
					</div>
				{:else}
					<div class="text-center py-8">
						<div class="text-gray-400 dark:text-gray-600 mb-2">
							<svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
							</svg>
						</div>
						<p class="text-gray-600 dark:text-gray-400">No recent activity</p>
						<p class="text-sm text-gray-500 dark:text-gray-500">Activities will appear here as they happen</p>
					</div>
				{/each}
			</div>

			<!-- Load More -->
			{#if filteredActivities.length >= maxItems}
				<div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
					<Button color="secondary" class="w-full" outline={true}>
						Load More Activities
						<svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
						</svg>
					</Button>
				</div>
			{/if}
		</div>
	</Card>
</div>

<!-- Notification Dropdown -->
{#if showNotifications}
	<div class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
		<div class="p-4 border-b border-gray-200 dark:border-gray-700">
			<div class="flex items-center justify-between">
				<h3 class="font-semibold text-gray-900 dark:text-white">Notifications</h3>
				<button
					onclick={() => showNotifications = false}
					class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</button>
			</div>
		</div>
		<div class="max-h-96 overflow-y-auto">
			{#each activities.filter(a => unreadActivities.includes(a.id)).slice(0, 5) as activity}
				<div
					class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700"
					onclick={() => { markAsRead(activity.id); showNotifications = false; }}
				>
					<div class="flex items-start space-x-3">
						<span class="text-lg">{getActivityIcon(activity.type)}</span>
						<div class="flex-1">
							<p class="text-sm text-gray-900 dark:text-white">{activity.message}</p>
							<p class="text-xs text-gray-500 dark:text-gray-400">{formatActivityTime(activity)}</p>
						</div>
					</div>
				</div>
			{:else}
				<div class="p-4 text-center text-gray-500 dark:text-gray-400">
					<p>No new notifications</p>
				</div>
			{/each}
		</div>
		<div class="p-4 border-t border-gray-200 dark:border-gray-700">
			<Button color="cyan" size="sm" class="w-full" outline={true}>
				View All Notifications
			</Button>
		</div>
	</div>
{/if}