import { test, expect } from '@playwright/test';

test.describe('Hub Table Management', () => {
	test.beforeEach(async ({ page }) => {
		// Mock authentication
		await page.addInitScript(() => {
			localStorage.setItem('auth_token', 'mock-token');
			localStorage.setItem('user', JSON.stringify({
				id: 'user-1',
				email: 'test@example.com',
				role: { name: 'manager' }
			}));
		});

		// Mock API responses
		await page.route('**/api/tables', async route => {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({
					success: true,
					data: [
						{
							id: '1',
							name: 'Table 1',
							status: 'available',
							capacity: 4,
							zone: 'Main Dining',
							position: { x: 100, y: 100 }
						},
						{
							id: '2',
							name: 'Table 2',
							status: 'occupied',
							capacity: 2,
							zone: 'Main Dining',
							position: { x: 200, y: 100 },
							currentSession: {
								id: 'session-1',
								guests: 2,
								startTime: new Date().toISOString()
							}
						},
						{
							id: '3',
							name: 'Table 3',
							status: 'reserved',
							capacity: 6,
							zone: 'Patio',
							position: { x: 100, y: 200 }
						}
					],
					meta: { total: 3 }
				})
			});
		});
	});

	test('should display tables in hub', async ({ page }) => {
		await page.goto('/hub/tables');

		// Should show table grid
		await expect(page.getByTestId('table-grid')).toBeVisible();

		// Should show all tables
		await expect(page.getByText('Table 1')).toBeVisible();
		await expect(page.getByText('Table 2')).toBeVisible();
		await expect(page.getByText('Table 3')).toBeVisible();

		// Should show status indicators
		await expect(page.getByTestId('table-1')).toHaveClass(/available/);
		await expect(page.getByTestId('table-2')).toHaveClass(/occupied/);
		await expect(page.getByTestId('table-3')).toHaveClass(/reserved/);
	});

	test('should show table details on click', async ({ page }) => {
		await page.goto('/hub/tables');

		// Click on a table
		await page.getByTestId('table-1').click();

		// Should show table details modal
		await expect(page.getByTestId('table-details')).toBeVisible();
		await expect(page.getByText('Table 1')).toBeVisible();
		await expect(page.getByText('Main Dining')).toBeVisible();
		await expect(page.getByText('4 guests')).toBeVisible();
	});

	test('should allow table status changes', async ({ page }) => {
		await page.route('**/api/tables/1', async route => {
			if (route.request().method() === 'PUT') {
				await route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify({
						success: true,
						data: {
							id: '1',
							name: 'Table 1',
							status: 'occupied',
							capacity: 4,
							zone: 'Main Dining'
						}
					})
				});
			}
		});

		await page.goto('/hub/tables');

		// Right-click on table to open context menu
		await page.getByTestId('table-1').click({ button: 'right' });

		// Should show context menu
		await expect(page.getByRole('menu')).toBeVisible();
		await expect(page.getByText('Mark as Occupied')).toBeVisible();
		await expect(page.getByText('Mark as Reserved')).toBeVisible();
		await expect(page.getByText('Mark for Cleaning')).toBeVisible();

		// Change status to occupied
		await page.getByText('Mark as Occupied').click();

		// Should update table status
		await expect(page.getByTestId('table-1')).toHaveClass(/occupied/);
	});

	test('should filter tables by status', async ({ page }) => {
		await page.goto('/hub/tables');

		// Apply status filter
		await page.getByLabel(/filter by status/i).selectOption('available');

		// Should only show available tables
		await expect(page.getByTestId('table-1')).toBeVisible();
		await expect(page.getByTestId('table-2')).not.toBeVisible();
		await expect(page.getByTestId('table-3')).not.toBeVisible();

		// Change filter
		await page.getByLabel(/filter by status/i).selectOption('occupied');

		// Should only show occupied tables
		await expect(page.getByTestId('table-1')).not.toBeVisible();
		await expect(page.getByTestId('table-2')).toBeVisible();
		await expect(page.getByTestId('table-3')).not.toBeVisible();
	});

	test('should search tables by name', async ({ page }) => {
		await page.goto('/hub/tables');

		// Search for specific table
		await page.getByLabel(/search tables/i).fill('Table 1');

		// Should only show matching tables
		await expect(page.getByTestId('table-1')).toBeVisible();
		await expect(page.getByTestId('table-2')).not.toBeVisible();
		await expect(page.getByTestId('table-3')).not.toBeVisible();
	});

	test('should group tables by zone', async ({ page }) => {
		await page.goto('/hub/tables');

		// Enable zone grouping
		await page.getByLabel(/group by zone/i).check();

		// Should show zone headers
		await expect(page.getByText('Main Dining')).toBeVisible();
		await expect(page.getByText('Patio')).toBeVisible();

		// Tables should be grouped under correct zones
		const mainDiningSection = page.getByText('Main Dining').locator('..');
		await expect(mainDiningSection.getByText('Table 1')).toBeVisible();
		await expect(mainDiningSection.getByText('Table 2')).toBeVisible();

		const patioSection = page.getByText('Patio').locator('..');
		await expect(patioSection.getByText('Table 3')).toBeVisible();
	});

	test('should show table performance metrics', async ({ page }) => {
		// Mock metrics data
		await page.route('**/api/tables/1', async route => {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({
					success: true,
					data: {
						id: '1',
						name: 'Table 1',
						status: 'available',
						capacity: 4,
						metrics: {
							turnoverTime: 45,
							revenue: 2500000,
							occupancyRate: 0.85
						}
					}
				})
			});
		});

		await page.goto('/hub/tables');

		// Enable metrics view
		await page.getByLabel(/show metrics/i).check();

		// Click on table to see details
		await page.getByTestId('table-1').click();

		// Should show performance metrics
		await expect(page.getByText('45m')).toBeVisible(); // turnover time
		await expect(page.getByText('2.5M')).toBeVisible(); // revenue
		await expect(page.getByText('85%')).toBeVisible(); // occupancy rate
	});

	test('should handle real-time updates', async ({ page }) => {
		await page.goto('/hub/tables');

		// Initial state
		await expect(page.getByTestId('table-1')).toHaveClass(/available/);

		// Simulate real-time update
		await page.addInitScript(() => {
			setTimeout(() => {
				window.dispatchEvent(new CustomEvent('table-update', {
					detail: {
						id: '1',
						status: 'occupied',
						currentSession: {
							id: 'session-2',
							guests: 4
						}
					}
				}));
			}, 2000);
		});

		// Should update table status
		await expect(page.getByTestId('table-1')).toHaveClass(/occupied/, { timeout: 5000 });
	});

	test('should allow table repositioning', async ({ page }) => {
		await page.goto('/hub/tables');

		// Enable repositioning mode
		await page.getByLabel(/reposition tables/i).check();

		// Drag table to new position
		const table = page.getByTestId('table-1');
		await table.dragTo(page.locator('#table-grid').getByPosition({ x: 300, y: 300 }));

		// Should save new position
		await expect(page.getByText(/table position updated/i)).toBeVisible();
	});

	test('should handle bulk operations', async ({ page }) => {
		await page.goto('/hub/tables');

		// Select multiple tables
		await page.getByTestId('table-1').click();
		await page.keyboard.down('Shift');
		await page.getByTestId('table-3').click();
		await page.keyboard.up('Shift');

		// Should show bulk actions
		await expect(page.getByRole('button', { name: /bulk actions/i })).toBeVisible();

		// Perform bulk status change
		await page.getByRole('button', { name: /bulk actions/i }).click();
		await page.getByText('Mark as Cleaning').click();

		// Should update all selected tables
		await expect(page.getByTestId('table-1')).toHaveClass(/cleaning/);
		await expect(page.getByTestId('table-3')).toHaveClass(/cleaning/);
	});

	test('should show empty state when no tables', async ({ page }) => {
		// Mock empty response
		await page.route('**/api/tables', async route => {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({
					success: true,
					data: [],
					meta: { total: 0 }
				})
			});
		});

		await page.goto('/hub/tables');

		// Should show empty state
		await expect(page.getByText(/no tables found/i)).toBeVisible();
		await expect(page.getByRole('button', { name: /add table/i })).toBeVisible();
	});

	test('should handle error states gracefully', async ({ page }) => {
		// Mock API error
		await page.route('**/api/tables', async route => {
			await route.fulfill({
				status: 500,
				contentType: 'application/json',
				body: JSON.stringify({
					success: false,
					error: 'Failed to load tables'
				})
			});
		});

		await page.goto('/hub/tables');

		// Should show error state
		await expect(page.getByText(/failed to load tables/i)).toBeVisible();
		await expect(page.getByRole('button', { name: /retry/i })).toBeVisible();
	});

	test('should be accessible', async ({ page }) => {
		await page.goto('/hub/tables');

		// Check semantic HTML
		await expect(page.getByRole('main')).toBeVisible();
		await expect(page.getByRole('grid', { name: /tables/i })).toBeVisible();

		// Check ARIA labels
		await expect(page.getByLabel(/filter by status/i)).toBeVisible();
		await expect(page.getByLabel(/search tables/i)).toBeVisible();

		// Check keyboard navigation
		await page.keyboard.press('Tab');
		await expect(page.getByLabel(/search tables/i)).toBeFocused();

		// Navigate to tables
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await expect(page.getByTestId('table-1')).toBeFocused();

		// Activate table with Enter
		await page.keyboard.press('Enter');
		await expect(page.getByTestId('table-details')).toBeVisible();
	});

	test('should work on mobile devices', async ({ page, isMobile }) => {
		test.skip(!isMobile, 'Mobile-only test');

		await page.goto('/hub/tables');

		// Should show mobile-optimized layout
		await expect(page.getByTestId('table-grid')).toHaveCSS('grid-template-columns', 'repeat(2, 1fr)');

		// Touch interactions should work
		await page.tap(page.getByTestId('table-1'));
		await expect(page.getByTestId('table-details')).toBeVisible();

		// Swipe gestures for table repositioning
		await page.getByTestId('table-1').dragTo(page.locator('#table-grid').getByPosition({ x: 150, y: 250 }));
		await expect(page.getByText(/table position updated/i)).toBeVisible();
	});
});