import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		exclude: [
			'node_modules/',
			'src/test/',
			'**/*.d.ts',
			'**/*.config.*',
			'**/coverage/**',
			'src/routes/page.svelte.spec.ts' // Exclude browser-specific test
		],
		environment: 'jsdom',
		setupFiles: ['./src/test/setup.ts'],
		globals: true,
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			exclude: [
				'node_modules/',
				'src/test/',
				'**/*.d.ts',
				'**/*.config.*',
				'**/coverage/**'
			]
		},
		environmentOptions: {
			jsdom: {
				resources: 'usable'
			}
		}
	}
});