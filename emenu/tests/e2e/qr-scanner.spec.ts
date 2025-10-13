import { test, expect } from '@playwright/test';

test.describe('QR Scanner', () => {
	test.beforeEach(async ({ page }) => {
		// Mock camera API
		await page.addInitScript(() => {
			Object.defineProperty(navigator, 'mediaDevices', {
				writable: true,
				value: {
					getUserMedia: async (constraints) => {
						// Simulate successful camera access
						return {
							getTracks: () => [{ stop: () => {} }]
						};
					},
					enumerateDevices: async () => [
						{ deviceId: 'camera1', label: 'Back Camera', kind: 'videoinput' },
						{ deviceId: 'camera2', label: 'Front Camera', kind: 'videoinput' }
					]
				}
			});
		});
	});

	test('should show QR scanner interface', async ({ page }) => {
		await page.goto('/');

		// Click QR scanner button
		await page.getByRole('button', { name: /scan qr code/i }).click();

		// Should show scanner modal
		await expect(page.getByTestId('qr-scanner')).toBeVisible();
		await expect(page.getByText(/scan qr code/i)).toBeVisible();
		await expect(page.getByRole('button', { name: /close/i })).toBeVisible();
	});

	test('should request camera permissions', async ({ page }) => {
		await page.goto('/');

		await page.getByRole('button', { name: /scan qr code/i }).click();

		// Should initialize camera (mocked)
		await expect(page.getByText(/camera ready/i)).toBeVisible();
	});

	test('should handle camera permission denial', async ({ page }) => {
		// Mock permission denial
		await page.addInitScript(() => {
			Object.defineProperty(navigator, 'mediaDevices', {
				writable: true,
				value: {
					getUserMedia: async () => {
						throw new Error('Permission denied');
					}
				}
			});
		});

		await page.goto('/');
		await page.getByRole('button', { name: /scan qr code/i }).click();

		// Should show permission error
		await expect(page.getByText(/camera access required/i)).toBeVisible();
		await expect(page.getByText(/enter table code manually/i)).toBeVisible();
	});

	test('should allow manual table code entry', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: /scan qr code/i }).click();

		// Click manual entry
		await page.getByRole('button', { name: /manual entry/i }).click();

		// Should show manual input form
		await expect(page.getByLabel(/table code/i)).toBeVisible();
		await expect(page.getByRole('button', { name: /submit/i })).toBeVisible();

		// Enter table code
		await page.getByLabel(/table code/i).fill('TABLE123');
		await page.getByRole('button', { name: /submit/i }).click();

		// Should navigate to menu
		await expect(page).toHaveURL(/.*\/qr\/TABLE123/);
	});

	test('should simulate successful QR scan', async ({ page }) => {
		await page.goto('/');

		// Mock QR scan event
		await page.addInitScript(() => {
			// Simulate QR scan after 2 seconds
			setTimeout(() => {
				window.dispatchEvent(new CustomEvent('qr-scan', {
					detail: JSON.stringify({
						tableId: 'TABLE456',
						timestamp: Date.now(),
						restaurantId: 'REST123'
					})
				}));
			}, 2000);
		});

		await page.getByRole('button', { name: /scan qr code/i }).click();

		// Wait for scan to complete
		await expect(page).toHaveURL(/.*\/qr\/TABLE456/, { timeout: 5000 });
	});

	test('should handle invalid QR code format', async ({ page }) => {
		await page.goto('/');

		// Mock invalid QR scan
		await page.addInitScript(() => {
			setTimeout(() => {
				window.dispatchEvent(new CustomEvent('qr-scan', {
					detail: 'invalid-qr-content'
				}));
			}, 1000);
		});

		await page.getByRole('button', { name: /scan qr code/i }).click();

		// Should show error message
		await expect(page.getByText(/invalid qr code format/i)).toBeVisible();
		await expect(page.getByTestId('qr-scanner')).toBeVisible();
	});

	test('should handle expired QR code', async ({ page }) => {
		await page.goto('/');

		// Mock expired QR code
		await page.addInitScript(() => {
			setTimeout(() => {
				window.dispatchEvent(new CustomEvent('qr-scan', {
					detail: JSON.stringify({
						tableId: 'TABLE789',
						timestamp: Date.now() - 31 * 60 * 1000, // 31 minutes ago
						restaurantId: 'REST123'
					})
				}));
			}, 1000);
		});

		await page.getByRole('button', { name: /scan qr code/i }).click();

		// Should show expiration error
		await expect(page.getByText(/qr code has expired/i)).toBeVisible();
		await expect(page.getByTestId('qr-scanner')).toBeVisible();
	});

	test('should close scanner modal', async ({ page }) => {
		await page.goto('/');

		await page.getByRole('button', { name: /scan qr code/i }).click();
		await expect(page.getByTestId('qr-scanner')).toBeVisible();

		// Click close button
		await page.getByRole('button', { name: /close/i }).click();

		// Should close modal
		await expect(page.getByTestId('qr-scanner')).not.toBeVisible();
		await expect(page).toHaveURL(/.*\//);
	});

	test('should show flashlight toggle on supported devices', async ({ page }) => {
		// Mock device with torch support
		await page.addInitScript(() => {
			Object.defineProperty(navigator, 'mediaDevices', {
				writable: true,
				value: {
					getUserMedia: async (constraints) => {
						const stream = {
							getTracks: () => [{
								stop: () => {},
								getCapabilities: () => ({
									torch: true
								}),
								applyConstraints: async (constraints) => {
									if (constraints.advanced?.[0]?.torch !== undefined) {
										// Mock torch toggle
										return;
									}
								}
							}]
						};
						return stream;
					}
				}
			});
		});

		await page.goto('/');
		await page.getByRole('button', { name: /scan qr code/i }).click();

		// Should show flashlight toggle
		await expect(page.getByRole('button', { name: /toggle flashlight/i })).toBeVisible();
	});

	test('should allow camera switching', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: /scan qr code/i }).click();

		// Should show camera switch button
		await expect(page.getByRole('button', { name: /switch camera/i })).toBeVisible();

		// Click switch camera
		await page.getByRole('button', { name: /switch camera/i }).click();

		// Should still show scanner (camera switched)
		await expect(page.getByTestId('qr-scanner')).toBeVisible();
	});

	test('should handle QR scanner on mobile', async ({ page, isMobile }) => {
		test.skip(!isMobile, 'Mobile-only test');

		await page.goto('/');

		// Should show mobile-optimized scanner
		await page.getByRole('button', { name: /scan qr code/i }).click();

		// Should take full screen on mobile
		const scanner = page.getByTestId('qr-scanner');
		await expect(scanner).toHaveCSS('height', '100vh');
		await expect(scanner).toHaveCSS('width', '100vw');
	});

	test('should show loading state while initializing camera', async ({ page }) => {
		// Mock slow camera initialization
		await page.addInitScript(() => {
			Object.defineProperty(navigator, 'mediaDevices', {
				writable: true,
				value: {
					getUserMedia: async () => {
						await new Promise(resolve => setTimeout(resolve, 2000));
						return {
							getTracks: () => [{ stop: () => {} }]
						};
					}
				}
			});
		});

		await page.goto('/');
		await page.getByRole('button', { name: /scan qr code/i }).click();

		// Should show loading state
		await expect(page.getByText(/initializing camera/i)).toBeVisible();
		await expect(page.getByTestId('loading-spinner')).toBeVisible();

		// Should show scanner after initialization
		await expect(page.getByTestId('qr-scanner')).toBeVisible({ timeout: 3000 });
	});

	test('should be accessible', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: /scan qr code/i }).click();

		// Check semantic HTML
		await expect(page.getByRole('dialog', { name: /qr code scanner/i })).toBeVisible();

		// Check ARIA labels
		await expect(page.getByRole('button', { name: /close qr scanner/i })).toBeVisible();

		// Check keyboard navigation
		await page.keyboard.press('Tab');
		await expect(page.getByRole('button', { name: /close/i })).toBeFocused();

		await page.keyboard.press('Escape');
		await expect(page.getByTestId('qr-scanner')).not.toBeVisible();
	});

	test('should handle network errors gracefully', async ({ page }) => {
		// Mock network error during validation
		await page.route('**/api/tables/validate', route => {
			route.abort('failed');
		});

		await page.goto('/');

		// Mock QR scan
		await page.addInitScript(() => {
			setTimeout(() => {
				window.dispatchEvent(new CustomEvent('qr-scan', {
					detail: JSON.stringify({
						tableId: 'TABLE999',
						timestamp: Date.now(),
						restaurantId: 'REST123'
					})
				}));
			}, 1000);
		});

		await page.getByRole('button', { name: /scan qr code/i }).click();

		// Should show network error
		await expect(page.getByText(/connection failed/i)).toBeVisible();
		await expect(page.getByRole('button', { name: /try again/i })).toBeVisible();
	});
});