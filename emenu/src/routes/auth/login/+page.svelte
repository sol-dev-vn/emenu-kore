<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { type DirectusUser } from '$lib/server/auth';

	export let data;
	export let form;

	let loginMethod: 'email' | 'phone' = 'email';
	let isLoading = false;
	let showPassword = false;

	function formatPhoneNumber(event: Event) {
		const input = event.target as HTMLInputElement;
		let value = input.value.replace(/\D/g, '');

		// Add +84 prefix if not present
		if (!value.startsWith('84')) {
			value = '84' + value;
		}

		// Format as +84 XXX XXX XXX
		if (value.length > 2) {
			value = '+' + value.slice(0, 2) + ' ' + value.slice(2, 5) + ' ' + value.slice(5, 8) + ' ' + value.slice(8, 11);
		}

		input.value = value;
	}

	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}
</script>

<svelte:head>
	<title>Login - SOL Restaurant Hub</title>
	<meta name="description" content="Login to SOL Restaurant staff management portal" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-100 flex items-center justify-center p-4">
	<div class="max-w-md w-full space-y-8">
		<!-- Logo and Header -->
		<div class="text-center">
			<img
				src="/logos/logo_trim.png"
				alt="SOL Restaurant"
				class="mx-auto h-16 w-auto mb-4"
			/>
			<h2 class="text-3xl font-bold text-gray-900">Staff Hub Login</h2>
			<p class="mt-2 text-sm text-gray-600">Sign in to access the restaurant management system</p>
		</div>

		<!-- Login Form -->
		<div class="bg-white shadow-xl rounded-lg p-8">
			<!-- Error Display -->
			{#if form?.error}
				<div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
					<div class="flex">
						<div class="flex-shrink-0">
							<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
								<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
							</svg>
						</div>
						<div class="ml-3">
							<p class="text-sm text-red-800">{form.error}</p>
						</div>
					</div>
				</div>
			{/if}

			<!-- Login Method Toggle -->
			<div class="flex mb-6 bg-gray-100 rounded-lg p-1">
				<button
					class="flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors {loginMethod === 'email'
						? 'bg-white text-gray-900 shadow-sm'
						: 'text-gray-600 hover:text-gray-900'}"
					on:click={() => (loginMethod = 'email')}
				>
					Email
				</button>
				<button
					class="flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors {loginMethod === 'phone'
						? 'bg-white text-gray-900 shadow-sm'
						: 'text-gray-600 hover:text-gray-900'}"
					on:click={() => (loginMethod = 'phone')}
				>
					Phone
				</button>
			</div>

			<form
				method="POST"
				action="?"
				use:enhance={() => {
					isLoading = true;
					return async ({ result, form }) => {
						isLoading = false;
						if (result.type === 'success') {
							const redirectTo = $page.url.searchParams.get('returnTo') || '/hub';
							goto(redirectTo);
						} else if (result.type === 'failure') {
							// Error is handled by the template
							console.error('Login failed:', result.data?.error);
						}
					};
				}}
				class="space-y-6"
			>
				<!-- Email/Phone Input -->
				<div>
					<label for="identifier" class="block text-sm font-medium text-gray-700 mb-2">
						{loginMethod === 'email' ? 'Email Address' : 'Phone Number'}
					</label>
					{#if loginMethod === 'email'}
						<input
							id="identifier"
							name="email"
							type="email"
							placeholder="your.email@sol.com.vn"
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
							required
						/>
					{:else}
						<input
							id="identifier"
							name="phone"
							type="tel"
							placeholder="+84 XXX XXX XXX"
							on:input={formatPhoneNumber}
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
							required
						/>
					{/if}
				</div>

				<!-- Password Input -->
				<div>
					<label for="password" class="block text-sm font-medium text-gray-700 mb-2">
						Password
					</label>
					<div class="relative">
						<input
							id="password"
							name="password"
							type={showPassword ? 'text' : 'password'}
							placeholder="Enter your password"
							class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
							required
						/>
						<button
							type="button"
							on:click={togglePasswordVisibility}
							class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
						>
							{#if showPassword}
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
								</svg>
							{:else}
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
								</svg>
							{/if}
						</button>
					</div>
				</div>

	
				<!-- Submit Button -->
				<button
					type="submit"
					disabled={isLoading}
					class="w-full bg-cyan-600 text-white py-3 px-4 rounded-lg hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
				>
					{#if isLoading}
						<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Signing in...
					{:else}
						Sign In
					{/if}
				</button>
			</form>

			<!-- Forgot Password Link -->
			<div class="mt-6 text-center">
				<a href="/auth/forgot-password" class="text-sm text-cyan-600 hover:text-cyan-800 font-medium">
					Forgot your password?
				</a>
			</div>
		</div>

		<!-- Footer -->
		<div class="text-center text-sm text-gray-600">
			<p>&copy; 2025 SOL Restaurant. All rights reserved.</p>
			<p class="mt-1">Need help? Contact your system administrator</p>
		</div>
	</div>
</div>