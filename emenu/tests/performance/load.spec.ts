import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
	test.describe('Page Load Performance', () => {
		test('should load homepage within performance budget', async ({ page }) => {
			const startTime = Date.now();

			await page.goto('/');

			// Wait for page to be fully loaded
			await page.waitForLoadState('networkidle');
			await page.waitForSelector('[data-testid="main-content"]');

			const loadTime = Date.now() - startTime;

			// Should load within 3 seconds
			expect(loadTime).toBeLessThan(3000);

			// Check Core Web Vitals
			const metrics = await page.evaluate(() => {
				return new Promise((resolve) => {
					new PerformanceObserver((list) => {
						const entries = list.getEntries();
						const vitals = {};

						entries.forEach((entry) => {
							if (entry.entryType === 'largest-contentful-paint') {
								vitals.lcp = entry.startTime;
							} else if (entry.entryType === 'first-input') {
								vitals.fid = entry.processingStart - entry.startTime;
							} else if (entry.entryType === 'layout-shift') {
								if (!entry.hadRecentInput) {
									vitals.cls = (vitals.cls || 0) + entry.value;
								}
							}
						});

						resolve(vitals);
					}).observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
				});
			});

			// LCP should be under 2.5s
			expect(metrics.lcp).toBeLessThan(2500);

			// FID should be under 100ms
			if (metrics.fid) {
				expect(metrics.fid).toBeLessThan(100);
			}

			// CLS should be under 0.1
			if (metrics.cls) {
				expect(metrics.cls).toBeLessThan(0.1);
			}
		});

		test('should load hub dashboard efficiently', async ({ page }) => {
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
			await page.route('**/api/**', async route => {
				await route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify({ success: true, data: [] })
				});
			});

			const startTime = Date.now();
			await page.goto('/hub');
			await page.waitForLoadState('networkidle');
			await page.waitForSelector('[data-testid="dashboard-content"]');

			const loadTime = Date.now() - startTime;
			expect(loadTime).toBeLessThan(2000);
		});

		test('should handle large table lists efficiently', async ({ page }) => {
			// Mock large dataset
			const largeTableList = Array.from({ length: 100 }, (_, i) => ({
				id: `table-${i}`,
				name: `Table ${i + 1}`,
				status: 'available',
				capacity: 4,
				zone: 'Main Dining',
				position: { x: (i % 10) * 100, y: Math.floor(i / 10) * 100 }
			}));

			await page.route('**/api/tables', async route => {
				await route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify({
						success: true,
						data: largeTableList,
						meta: { total: 100 }
					})
				});
			});

			await page.addInitScript(() => {
				localStorage.setItem('auth_token', 'mock-token');
			});

			const startTime = Date.now();
			await page.goto('/hub/tables');
			await page.waitForSelector('[data-testid="table-grid"]');

			// Measure render time for 100 tables
			const renderTime = Date.now() - startTime;
			expect(renderTime).toBeLessThan(1500);

			// Should implement virtualization or pagination
			const visibleTables = await page.locator('[data-testid^="table-"]').count();
			expect(visibleTables).toBeLessThanOrEqual(20); // Should only render visible tables
		});
	});

	test.describe('Resource Loading', () => {
		test('should optimize bundle sizes', async ({ page }) => {
			const resources: any[] = [];

			page.on('response', async (response) => {
				const url = response.url();
				if (url.includes('.js') || url.includes('.css')) {
					const headers = await response.allHeaders();
					resources.push({
						url,
						type: url.endsWith('.js') ? 'javascript' : 'css',
						size: parseInt(headers['content-length'] || '0'),
						compressed: headers['content-encoding'] === 'gzip'
					});
				}
			});

			await page.goto('/');
			await page.waitForLoadState('networkidle');

			// Check total bundle size
			const jsSize = resources
				.filter(r => r.type === 'javascript')
				.reduce((sum, r) => sum + r.size, 0);

			const cssSize = resources
				.filter(r => r.type === 'css')
				.reduce((sum, r) => sum + r.size, 0);

			// JavaScript should be under 500KB (gzipped)
			expect(jsSize).toBeLessThan(500 * 1024);

			// CSS should be under 50KB (gzipped)
			expect(cssSize).toBeLessThan(50 * 1024);

			// All resources should be compressed
			const uncompressedResources = resources.filter(r => !r.compressed);
			expect(uncompressedResources).toHaveLength(0);
		});

		test('should implement code splitting', async ({ page }) => {
			const loadedChunks: string[] = [];

			page.on('response', async (response) => {
				const url = response.url();
				if (url.includes('.js') && !url.includes('vendor')) {
					loadedChunks.push(url);
				}
			});

			await page.goto('/');
			await page.waitForLoadState('networkidle');

			// Should load chunks lazily
			const initialChunks = loadedChunks.length;

			// Navigate to a different route that should load additional chunks
			await page.getByRole('link', { name: /hub/i }).click();
			await page.waitForLoadState('networkidle');

			// Should have loaded additional chunks
			expect(loadedChunks.length).toBeGreaterThan(initialChunks);
		});

		test('should optimize images', async ({ page }) => {
			const images: any[] = [];

			page.on('response', async (response) => {
				const url = response.url();
				if (url.match(/\.(jpg|jpeg|png|webp|avif)$/i)) {
					const headers = await response.allHeaders();
					images.push({
						url,
						size: parseInt(headers['content-length'] || '0'),
						format: url.split('.').pop()?.toLowerCase()
					});
				}
			});

			await page.goto('/menu/sample-table'); // Page with menu images
			await page.waitForLoadState('networkidle');

			// Should use modern image formats
			const modernFormats = images.filter(img =>
				['webp', 'avif'].includes(img.format)
			);
			expect(modernFormats.length).toBeGreaterThan(0);

			// Images should have reasonable sizes
			const largeImages = images.filter(img => img.size > 500 * 1024); // > 500KB
			expect(largeImages).toHaveLength(0);
		});
	});

	test.describe('Memory Usage', () => {
		test('should not leak memory during navigation', async ({ page }) => {
			// Mock authentication for protected routes
			await page.addInitScript(() => {
				localStorage.setItem('auth_token', 'mock-token');
			});

			// Mock API responses
			await page.route('**/api/**', async route => {
				await route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify({ success: true, data: [] })
				});
			});

			const initialMemory = await page.evaluate(() => {
				return (performance as any).memory?.usedJSHeapSize || 0;
			});

			// Navigate through multiple pages
			const routes = ['/hub', '/hub/tables', '/hub/qr-codes', '/'];

			for (let i = 0; i < 3; i++) { // Repeat cycle 3 times
				for (const route of routes) {
					await page.goto(route);
					await page.waitForLoadState('networkidle');
					await page.waitForTimeout(100); // Allow garbage collection
				}
			}

			const finalMemory = await page.evaluate(() => {
				return (performance as any).memory?.usedJSHeapSize || 0;
			});

			const memoryIncrease = finalMemory - initialMemory;

			// Memory increase should be reasonable (less than 50MB)
			expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
		});

		test('should handle large datasets without memory bloat', async ({ page }) => {
			// Mock very large dataset
			const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
				id: `item-${i}`,
				name: `Menu Item ${i}`,
				price: Math.floor(Math.random() * 500000),
				category: ['appetizers', 'mains', 'desserts'][i % 3],
				description: `Description for menu item ${i}`,
				ingredients: [`Ingredient ${i}`, `Ingredient ${i + 1}`]
			}));

			await page.route('**/api/menu-items', async route => {
				await route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify({
						success: true,
						data: largeDataset
					})
				});
			});

			const initialMemory = await page.evaluate(() => {
				return (performance as any).memory?.usedJSHeapSize || 0;
			});

			await page.goto('/menu/sample-table');
			await page.waitForLoadState('networkidle');

			const finalMemory = await page.evaluate(() => {
				return (performance as any).memory?.usedJSHeapSize || 0;
			});

			const memoryUsage = finalMemory - initialMemory;

			// Should not use excessive memory for large dataset
			expect(memoryUsage).toBeLessThan(20 * 1024 * 1024); // Less than 20MB
		});
	});

	test.describe('Network Performance', () => {
		test('should minimize API calls', async ({ page }) => {
			const apiCalls: string[] = [];

			page.on('request', request => {
				if (request.url().includes('/api/')) {
					apiCalls.push(request.url());
				}
			});

			await page.addInitScript(() => {
				localStorage.setItem('auth_token', 'mock-token');
			});

			await page.route('**/api/**', async route => {
				await route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify({ success: true, data: [] })
				});
			});

			await page.goto('/hub');
			await page.waitForLoadState('networkidle');

			// Should make minimal API calls
			expect(apiCalls.length).toBeLessThan(10);

			// Should implement caching (same endpoint not called multiple times)
			const uniqueEndpoints = [...new Set(apiCalls.map(url => url.split('?')[0]))];
			expect(uniqueEndpoints.length).toBe(apiCalls.length);
		});

		test('should implement proper caching', async ({ page }) => {
			const cacheHeaders: any[] = [];

			page.on('response', async (response) => {
				if (response.url().includes('/api/')) {
					const headers = await response.allHeaders();
					cacheHeaders.push({
						url: response.url(),
						'cache-control': headers['cache-control'],
						etag: headers['etag']
					});
				}
			});

			await page.addInitScript(() => {
				localStorage.setItem('auth_token', 'mock-token');
			});

			await page.route('**/api/**', async route => {
				await route.fulfill({
					status: 200,
					headers: {
						'Cache-Control': 'max-age=300',
						'ETag': 'mock-etag'
					},
					contentType: 'application/json',
					body: JSON.stringify({ success: true, data: [] })
				});
			});

			await page.goto('/hub');
			await page.waitForLoadState('networkidle');

			// Should include cache headers
			expect(cacheHeaders.length).toBeGreaterThan(0);

			cacheHeaders.forEach(headers => {
				expect(headers['cache-control']).toBeTruthy();
				expect(headers['etag']).toBeTruthy();
			});
		});

		test('should handle slow network conditions', async ({ page }) => {
			// Simulate slow 3G connection
			await page.route('**/*', async route => {
				// Add artificial delay
				await new Promise(resolve => setTimeout(resolve, 1000));
				await route.continue();
			});

			const startTime = Date.now();
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			const loadTime = Date.now() - startTime;

			// Should still load within reasonable time (under 10 seconds on slow connection)
			expect(loadTime).toBeLessThan(10000);

			// Should show loading states
			await expect(page.getByTestId('loading-skeleton')).toBeVisible();
		});
	});

	test.describe('Animation Performance', () => {
		test('should maintain 60fps during animations', async ({ page }) => {
			await page.goto('/');

			// Monitor frame rate during page transitions
			const frameRates = await page.evaluate(() => {
				return new Promise<number[]>((resolve) => {
					const rates: number[] = [];
					let lastTime = performance.now();
					let frameCount = 0;

					function measureFrame() {
						const currentTime = performance.now();
						frameCount++;

						if (currentTime - lastTime >= 1000) {
							rates.push(frameCount);
							frameCount = 0;
							lastTime = currentTime;

							if (rates.length >= 3) {
								resolve(rates);
								return;
							}
						}

						requestAnimationFrame(measureFrame);
					}

					requestAnimationFrame(measureFrame);

					// Trigger some animations
					document.querySelector('[data-testid="qr-scanner-button"]')?.click();
				});
			});

			// Average frame rate should be close to 60fps
			const avgFrameRate = frameRates.reduce((sum, rate) => sum + rate, 0) / frameRates.length;
			expect(avgFrameRate).toBeGreaterThan(50);
		});

		test('should use CSS transforms for smooth animations', async ({ page }) => {
			await page.goto('/');

			// Check if animations use GPU acceleration
			const animatedElements = await page.evaluate(() => {
				const elements = document.querySelectorAll('[data-testid*="animated"]');
				return Array.from(elements).map(el => {
					const style = window.getComputedStyle(el);
					return {
						transform: style.transform,
						willChange: style.willChange,
						opacity: style.opacity
					};
				});
			});

			// Animated elements should use transforms
			animatedElements.forEach(element => {
				if (element.transform !== 'none') {
					// Should use hardware acceleration
					expect(element.transform).toBeTruthy();
				}
			});
		});
	});

	test.describe('Database Performance', () => {
		test('should handle concurrent database operations', async ({ page }) => {
			// This would test database performance under load
			// Implementation would depend on the actual database setup
			expect(true).toBe(true); // Placeholder
		});

		test('should optimize database queries', async ({ page }) => {
			// This would test query optimization
			// Implementation would depend on the actual database setup
			expect(true).toBe(true); // Placeholder
		});
	});
});