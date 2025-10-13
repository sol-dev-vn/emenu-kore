import { vi, expect } from 'vitest';
import { readable } from 'svelte/store';
import '@testing-library/jest-dom';

// Extend expect with jest-dom matchers
expect.extend({});

// Mock SvelteKit navigation
vi.mock('$app/navigation', () => ({
	goto: vi.fn(),
	invalidate: vi.fn(),
	invalidateAll: vi.fn()
}));

// Mock SvelteKit stores
vi.mock('$app/stores', () => ({
	page: readable({
		url: new URL('http://localhost:3000'),
		params: {},
		route: { id: null },
		status: 200,
		error: null,
		data: {},
		form: null
	}),
	navigating: readable(null),
	updated: readable(false)
}));

// Mock Directus SDK
vi.mock('$lib/directus', () => ({
	directus: {
		auth: {
			login: vi.fn(),
			logout: vi.fn(),
			refresh: vi.fn()
		},
		request: vi.fn(),
		items: {
			readByQuery: vi.fn(),
			readOne: vi.fn(),
			createOne: vi.fn(),
			updateOne: vi.fn(),
			deleteOne: vi.fn()
		}
	}
}));

// Mock environment variables
process.env.PUBLIC_DIRECTUS_URL = 'http://localhost:8055';

// Global test utilities
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation(query => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(), // deprecated
		removeListener: vi.fn(), // deprecated
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

// Mock ResizeObserver
Object.defineProperty(window, 'ResizeObserver', {
	writable: true,
	value: vi.fn().mockImplementation(() => ({
		observe: vi.fn(),
		unobserve: vi.fn(),
		disconnect: vi.fn(),
	})),
});

// Mock IntersectionObserver
Object.defineProperty(window, 'IntersectionObserver', {
	writable: true,
	value: vi.fn().mockImplementation(() => ({
		observe: vi.fn(),
		unobserve: vi.fn(),
		disconnect: vi.fn(),
	})),
});

// Mock File and FileReader
global.File = class File {
	constructor(public chunks: any[], public name: string, public options: any) {}
} as any;

global.FileReader = class FileReader {
	result: string | null = null;
	onload: ((event: any) => void) | null = null;
	onerror: ((event: any) => void) | null = null;

	readAsDataURL() {
		setTimeout(() => {
			this.result = 'data:image/png;base64,mock-image-data';
			if (this.onload) this.onload({ target: this } as any);
		}, 0);
	}
} as any;

// Setup test helpers
export const createMockTable = (overrides = {}) => ({
	id: 'table-1',
	name: 'Table 1',
	status: 'available',
	capacity: 4,
	zone: 'Main Dining',
	position: { x: 0, y: 0 },
	currentSession: null,
	...overrides
});

export const createMockMenuItem = (overrides = {}) => ({
	id: 'item-1',
	name: 'Test Item',
	description: 'Test description',
	price: 100000,
	category: 'appetizers',
	available: true,
	image: null,
	tags: ['popular'],
	spiceLevel: 1,
	prepTime: '15-20 min',
	ingredients: ['ingredient1', 'ingredient2'],
	nutritional: {
		calories: 250,
		protein: 12,
		carbs: 30,
		fat: 8
	},
	dietary: {
		vegetarian: false,
		vegan: false,
		glutenFree: true,
		dairyFree: false,
		nutFree: true
	},
	...overrides
});

export const createMockUser = (overrides = {}) => ({
	id: 'user-1',
	email: 'test@example.com',
	first_name: 'Test',
	last_name: 'User',
	role: {
		name: 'server',
		description: 'Restaurant Server'
	},
	...overrides
});