<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import directusAuth, { type DirectusUser } from '$lib/server/auth';
	import ThemeToggle from '$lib/components/theme/ThemeToggle.svelte';
	import Button from '$lib/components/flowbite/Button.svelte';
	import Card from '$lib/components/flowbite/Card.svelte';
	import Badge from '$lib/components/flowbite/Badge.svelte';
	import BranchSelector from '$lib/components/BranchSelector.svelte';

	let currentUser: DirectusUser | null = null;
	let isLoading = true;
	let showUserDropdown = false;
	let showBranchSelector = false;
	let currentBranch = {
		id: 'branch-1',
		name: 'SOL District 1',
		location: '123 Nguyen Hue Street, District 1',
		activeTables: 18,
		totalTables: 24,
		status: 'active',
		revenue: 45600000,
		brand: 'SOL Restaurant'
	};

	onMount(async () => {
		try {
			const user = await directusAuth.initAuth();
			if (!user) {
				// Not authenticated, redirect to login
				goto(`/auth/login?redirect=${encodeURIComponent($page.url.pathname)}`);
				return;
			}
			currentUser = user;
		} catch (error) {
			console.error('Auth check failed:', error);
			goto(`/auth/login?redirect=${encodeURIComponent($page.url.pathname)}`);
		} finally {
			isLoading = false;
		}
	});

	async function handleLogout() {
		try {
			await directusAuth.logout();
			goto('/auth/login');
		} catch (error) {
			console.error('Logout failed:', error);
			// Force logout even if API call fails
			goto('/auth/login');
		}
	}

	function getUserDisplayName(user: DirectusUser): string {
		if (user.first_name && user.last_name) {
			return `${user.first_name} ${user.last_name}`;
		}
		return user.email;
	}

	function getUserInitials(user: DirectusUser): string {
		if (user.first_name && user.last_name) {
			return user.first_name[0] + user.last_name[0];
		}
		return user.email.substring(0, 2).toUpperCase();
	}

	function getUserRole(user: DirectusUser): string {
		return user.role?.name || user.roles?.[0]?.name || 'Staff';
	}

	// Close dropdown when clicking outside
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as Element;
		if (!target.closest('.user-dropdown')) {
			showUserDropdown = false;
		}
		if (!target.closest('.branch-selector')) {
			showBranchSelector = false;
		}
	}

	function handleBranchChange(event: CustomEvent) {
		const { branch } = event.detail;
		currentBranch = branch;
		console.log('Switched to branch:', branch);
		// TODO: Save branch preference to user profile
		// TODO: Reload dashboard data for new branch
	}

	function handleBranchSelectorOpen() {
		showBranchSelector = true;
		showUserDropdown = false;
	}
</script>

<svelte:head>
	<title>Staff Hub - SOL Restaurant</title>
	<meta name="description" content="SOL Restaurant staff management portal" />
</svelte:head>

{#if isLoading}
	<!-- Loading State -->
	<div class="min-h-screen bg-gray-50 flex items-center justify-center">
		<div class="text-center">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
			<p class="text-gray-600">Loading hub...</p>
		</div>
	</div>
{:else if currentUser}
	<div class="min-h-screen bg-gray-50" onclick={handleClickOutside}>
		<!-- Top Navigation -->
		<nav class="bg-white shadow-sm border-b">
			<div class="px-4 sm:px-6 lg:px-8">
				<div class="flex justify-between h-16">
					<div class="flex items-center">
						<!-- Logo -->
						<div class="flex items-center">
							<img
								src="/logos/logo_trim.png"
								alt="SOL"
								class="h-8 w-auto mr-3"
							/>
							<div>
								<h1 class="text-xl font-semibold text-gray-900">Staff Hub</h1>
								<p class="text-sm text-gray-600">Welcome back, {getUserDisplayName(currentUser)}</p>
							</div>
						</div>
					</div>

					<!-- Right side buttons -->
					<div class="flex items-center space-x-4">
						<!-- Theme Toggle -->
						<ThemeToggle />

						<!-- Notifications -->
						<button class="p-2 text-gray-600 hover:text-gray-900 relative">
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
							</svg>
							<span class="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
						</button>

						<!-- User Dropdown -->
						<div class="relative user-dropdown">
							<button
								onclick={() => (showUserDropdown = !showUserDropdown)}
								class="flex items-center space-x-3 text-gray-700 hover:text-gray-900 focus:outline-none"
							>
								<div class="text-right hidden md:block">
									<p class="text-sm font-medium text-gray-900">{getUserDisplayName(currentUser)}</p>
									<p class="text-xs text-gray-600">{getUserRole(currentUser)}</p>
								</div>
								<div class="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center text-white font-semibold">
									{getUserInitials(currentUser)}
								</div>
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
								</svg>
							</button>

							{#if showUserDropdown}
								<div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
									<div class="py-1">
										<a
											href="/hub/profile"
											class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
										>
											Profile
										</a>
										<a
											href="/hub/settings"
											class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
										>
											Settings
										</a>
										<hr class="my-1" />
										<button
											onclick={handleLogout}
											class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
										>
											Sign Out
										</button>
									</div>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</nav>

		<!-- Main Content -->
		<div class="flex h-[calc(100vh-4rem)]">
			<!-- Enhanced Sidebar -->
			<aside class="w-64 bg-white dark:bg-gray-800 shadow-sm border-r dark:border-gray-700 overflow-y-auto">
				<div class="p-4">
					<!-- Branch Selector -->
					<div class="mb-6">
						<h2 class="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">Current Location</h2>
						<div class="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg p-3 branch-selector">
							<div class="flex items-center justify-between mb-2">
								<span class="text-xs font-medium text-cyan-700 dark:text-cyan-300">Branch</span>
								<button
									class="text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-200 transition-colors"
									onclick={handleBranchSelectorOpen}
									title="Switch branch"
								>
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
									</svg>
								</button>
							</div>
							<p class="font-semibold text-cyan-900 dark:text-cyan-100">{currentBranch.name}</p>
							<p class="text-xs text-cyan-700 dark:text-cyan-300 mt-1">{currentBranch.activeTables} active tables</p>
						</div>
					</div>

					<!-- Quick Actions -->
					<div class="mb-6">
						<h2 class="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">Quick Actions</h2>
						<div class="grid grid-cols-2 gap-2">
							<Button color="cyan" size="sm" class="w-full">
								<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"></path>
								</svg>
								Add Table
							</Button>
							<Button color="cyan" size="sm" class="w-full" outline={true}>
								<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
								</svg>
								QR Code
							</Button>
						</div>
					</div>

					<!-- Navigation -->
					<h2 class="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-4">Navigation</h2>
					<nav class="space-y-2">
						<a
							href="/hub"
							class="flex items-center px-3 py-2.5 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 rounded-lg transition-all duration-200 hover:bg-cyan-100 dark:hover:bg-cyan-900/30"
						>
							<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
							</svg>
							<span class="font-medium">Dashboard</span>
							<Badge color="cyan" size="xs" class="ml-auto">4</Badge>
						</a>
						<a
							href="/hub/tables"
							class="flex items-center px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
						>
							<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"></path>
							</svg>
							<span class="font-medium">Tables</span>
							<Badge color="secondary" size="xs" class="ml-auto">18</Badge>
						</a>
						<a
							href="/hub/qr-codes"
							class="flex items-center px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
						>
							<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
							</svg>
							<span class="font-medium">QR Codes</span>
						</a>
						<a
							href="/hub/menu"
							class="flex items-center px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
						>
							<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
							</svg>
							<span class="font-medium">Menu</span>
						</a>
						<a
							href="/hub/reports"
							class="flex items-center px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
						>
							<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
							</svg>
							<span class="font-medium">Reports</span>
						</a>
					</nav>

					<!-- User Info Widget (Bottom of Sidebar) -->
					<div class="absolute bottom-0 left-0 right-0 p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
						<Card class="text-center p-4">
							<div class="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-semibold mx-auto mb-3 shadow-lg">
								{getUserInitials(currentUser)}
							</div>
							<p class="text-sm font-medium text-gray-900 dark:text-white">{getUserDisplayName(currentUser)}</p>
							<p class="text-xs text-gray-600 dark:text-gray-400">{getUserRole(currentUser)}</p>
							<div class="mt-3 flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
								<span class="flex items-center">
									<div class="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
									Online
								</span>
								<span>•</span>
								<span>Active</span>
							</div>
						</Card>
					</div>
				</div>
			</aside>

			<!-- Page Content -->
			<main class="flex-1 overflow-y-auto">
				<slot />
			</main>
		</div>
	</div>

	<!-- Branch Selector Modal -->
	<BranchSelector
		bind:isOpen={showBranchSelector}
		on:branch-change={handleBranchChange}
	/>
{/if}