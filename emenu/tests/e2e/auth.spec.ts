import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
	test.beforeEach(async ({ page }) => {
		// Clear cookies and local storage before each test
		await page.context().clearCookies();
		await page.evaluate(() => localStorage.clear());
	});

	test('should show login page for unauthenticated users', async ({ page }) => {
		await page.goto('/hub');

		// Should redirect to login
		await expect(page).toHaveURL(/.*\/auth\/login/);
		await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
	});

	test('should display login form elements', async ({ page }) => {
		await page.goto('/auth/login');

		// Check form elements are present
		await expect(page.getByLabel(/email/i)).toBeVisible();
		await expect(page.getByLabel(/password/i)).toBeVisible();
		await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
		await expect(page.getByText(/use phone/i)).toBeVisible();
	});

	test('should show validation errors for empty form', async ({ page }) => {
		await page.goto('/auth/login');

		// Submit empty form
		await page.getByRole('button', { name: /sign in/i }).click();

		// Should show validation errors
		await expect(page.getByText(/email is required/i)).toBeVisible();
		await expect(page.getByText(/password is required/i)).toBeVisible();
	});

	test('should validate email format', async ({ page }) => {
		await page.goto('/auth/login');

		await page.getByLabel(/email/i).fill('invalid-email');
		await page.getByLabel(/email/i).blur();

		await expect(page.getByText(/please enter a valid email/i)).toBeVisible();
	});

	test('should toggle between email and phone input', async ({ page }) => {
		await page.goto('/auth/login');

		// Initially shows email input
		await expect(page.getByLabel(/email/i)).toBeVisible();
		await expect(page.getByLabel(/phone number/i)).not.toBeVisible();

		// Toggle to phone
		await page.getByText(/use phone/i).click();

		await expect(page.getByLabel(/email/i)).not.toBeVisible();
		await expect(page.getByLabel(/phone number/i)).toBeVisible();
		await expect(page.getByDisplayValue(/\+84/)).toBeVisible(); // Vietnam default

		// Toggle back to email
		await page.getByText(/use email/i).click();

		await expect(page.getByLabel(/email/i)).toBeVisible();
		await expect(page.getByLabel(/phone number/i)).not.toBeVisible();
	});

	test('should handle successful login with email', async ({ page }) => {
		// Mock successful API response
		await page.route('**/auth/login', async route => {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({
					data: {
						access_token: 'mock-token',
						refresh_token: 'mock-refresh-token',
						expires: 3600,
						user: {
							id: 'user-1',
							email: 'test@example.com',
							first_name: 'Test',
							last_name: 'User',
							role: { name: 'server' }
						}
					}
				})
			});
		});

		await page.goto('/auth/login');

		// Fill in login form
		await page.getByLabel(/email/i).fill('test@example.com');
		await page.getByLabel(/password/i).fill('password123');

		// Submit form
		await page.getByRole('button', { name: /sign in/i }).click();

		// Should redirect to hub
		await expect(page).toHaveURL(/.*\/hub/);

		// Should show user info in sidebar
		await expect(page.getByText('Test User')).toBeVisible();
		await expect(page.getByText('server')).toBeVisible();
	});

	test('should handle login failure with invalid credentials', async ({ page }) => {
		// Mock failed login response
		await page.route('**/auth/login', async route => {
			await route.fulfill({
				status: 401,
				contentType: 'application/json',
				body: JSON.stringify({
					errors: [{ message: 'Invalid credentials' }]
				})
			});
		});

		await page.goto('/auth/login');

		await page.getByLabel(/email/i).fill('test@example.com');
		await page.getByLabel(/password/i).fill('wrongpassword');
		await page.getByRole('button', { name: /sign in/i }).click();

		// Should show error message
		await expect(page.getByText(/invalid email or password/i)).toBeVisible();

		// Should stay on login page
		await expect(page).toHaveURL(/.*\/auth\/login/);
	});

	test('should handle network errors gracefully', async ({ page }) => {
		// Mock network error
		await page.route('**/auth/login', route => {
			route.abort('failed');
		});

		await page.goto('/auth/login');

		await page.getByLabel(/email/i).fill('test@example.com');
		await page.getByLabel(/password/i).fill('password123');
		await page.getByRole('button', { name: /sign in/i }).click();

		// Should show connection error message
		await expect(page.getByText(/connection failed/i)).toBeVisible();
	});

	test('should show loading state during login', async ({ page }) => {
		// Mock delayed response
		await page.route('**/auth/login', async route => {
			await new Promise(resolve => setTimeout(resolve, 1000));
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({
					data: {
						access_token: 'mock-token',
						user: { id: 'user-1', email: 'test@example.com' }
					}
				})
			});
		});

		await page.goto('/auth/login');

		await page.getByLabel(/email/i).fill('test@example.com');
		await page.getByLabel(/password/i).fill('password123');
		await page.getByRole('button', { name: /sign in/i }).click();

		// Should show loading state
		await expect(page.getByRole('button', { name: /signing in/i })).toBeDisabled();
		await expect(page.getByText(/signing in/i)).toBeVisible();
	});

	test('should handle logout', async ({ page }) => {
		// First login
		await page.route('**/auth/login', async route => {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({
					data: {
						access_token: 'mock-token',
						user: { id: 'user-1', email: 'test@example.com' }
					}
				})
			});
		});

		// Mock logout
		await page.route('**/auth/logout', async route => {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ data: {} })
			});
		});

		await page.goto('/auth/login');
		await page.getByLabel(/email/i).fill('test@example.com');
		await page.getByLabel(/password/i).fill('password123');
		await page.getByRole('button', { name: /sign in/i }).click();

		// Wait for login to complete
		await expect(page).toHaveURL(/.*\/hub/);

		// Click user menu and logout
		await page.getByTestId('user-menu-button').click();
		await page.getByRole('menuitem', { name: /logout/i }).click();

		// Should redirect to login
		await expect(page).toHaveURL(/.*\/auth\/login/);
	});

	test('should handle session expiration', async ({ page }) => {
		// Mock expired token response
		await page.route('**/api/**', async route => {
			if (route.request().headers()['authorization']) {
				await route.fulfill({
					status: 401,
					contentType: 'application/json',
					body: JSON.stringify({ error: 'Token expired' })
				});
			}
		});

		// Set up expired session in localStorage
		await page.addInitScript(() => {
			localStorage.setItem('auth_token', 'expired-token');
		});

		await page.goto('/hub');

		// Should redirect to login due to expired token
		await expect(page).toHaveURL(/.*\/auth\/login/);

		// Should show session expired message
		await expect(page.getByText(/session has expired/i)).toBeVisible();
	});

	test('should implement rate limiting', async ({ page }) => {
		// Mock rate limiting response
		let requestCount = 0;
		await page.route('**/auth/login', async route => {
			requestCount++;
			if (requestCount > 5) {
				await route.fulfill({
					status: 429,
					contentType: 'application/json',
					body: JSON.stringify({
						error: 'Too many attempts. Please try again later.'
					})
				});
			} else {
				await route.fulfill({
					status: 401,
					contentType: 'application/json',
					body: JSON.stringify({
						errors: [{ message: 'Invalid credentials' }]
					})
				});
			}
		});

		await page.goto('/auth/login');

		// Make multiple failed attempts
		for (let i = 0; i < 6; i++) {
			await page.getByLabel(/email/i).fill('test@example.com');
			await page.getByLabel(/password/i).fill('wrongpassword');
			await page.getByRole('button', { name: /sign in/i }).click();
			await page.waitForTimeout(100);
		}

		// Should show rate limiting message
		await expect(page.getByText(/too many attempts/i)).toBeVisible();
		await expect(page.getByRole('button', { name: /sign in/i })).toBeDisabled();
	});

	test('should be accessible', async ({ page }) => {
		await page.goto('/auth/login');

		// Check semantic HTML
		await expect(page.getByRole('main')).toBeVisible();
		await expect(page.getByRole('form')).toBeVisible();

		// Check ARIA labels
		await expect(page.getByLabel(/email/i)).toBeVisible();
		await expect(page.getByLabel(/password/i)).toBeVisible();

		// Check keyboard navigation
		await page.keyboard.press('Tab');
		await expect(page.getByLabel(/email/i)).toBeFocused();

		await page.keyboard.press('Tab');
		await expect(page.getByLabel(/password/i)).toBeFocused();

		await page.keyboard.press('Tab');
		await expect(page.getByRole('button', { name: /sign in/i })).toBeFocused();
	});

	test('should remember login preference', async ({ page }) => {
		await page.goto('/auth/login');

		// Switch to phone input
		await page.getByText(/use phone/i).click();

		// Refresh page
		await page.reload();

		// Should remember phone preference
		await expect(page.getByLabel(/phone number/i)).toBeVisible();
		await expect(page.getByLabel(/email/i)).not.toBeVisible();
	});
});