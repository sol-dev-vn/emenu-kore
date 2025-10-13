export const testConfig = {
	// Test timeout in milliseconds
	timeout: 5000,

	// Test coverage thresholds
	coverage: {
		thresholds: {
			global: {
				branches: 70,
				functions: 70,
				lines: 70,
				statements: 70
			}
		}
	},

	// Mock data generators
	generators: {
		menuItem: (overrides = {}) => ({
			id: `item-${Math.random().toString(36).substr(2, 9)}`,
			name: 'Test Menu Item',
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
		}),

		table: (overrides = {}) => ({
			id: `table-${Math.random().toString(36).substr(2, 9)}`,
			name: 'Table 1',
			status: 'available',
			capacity: 4,
			zone: 'Main Dining',
			position: { x: 0, y: 0 },
			currentSession: null,
			...overrides
		}),

		user: (overrides = {}) => ({
			id: `user-${Math.random().toString(36).substr(2, 9)}`,
			email: 'test@example.com',
			first_name: 'Test',
			last_name: 'User',
			role: {
				name: 'server',
				description: 'Restaurant Server'
			},
			...overrides
		})
	}
};

// Test helpers
export const createTestEnvironment = () => {
	// Clear all mocks
	vi.clearAllMocks();

	// Reset localStorage
	localStorage.clear();

	// Reset DOM
	document.body.innerHTML = '';

	// Setup test environment variables
	process.env.NODE_ENV = 'test';
	process.env.PUBLIC_DIRECTUS_URL = 'http://localhost:8055';
};

export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const createMockEvent = (type: string, properties = {}) => ({
	type,
	preventDefault: vi.fn(),
	stopPropagation: vi.fn(),
	target: { value: '' },
	...properties
});

export const createMockWebSocket = () => {
	const callbacks: Record<string, Function[]> = {};

	return {
		addEventListener: vi.fn((event: string, callback: Function) => {
			if (!callbacks[event]) callbacks[event] = [];
			callbacks[event].push(callback);
		}),
		removeEventListener: vi.fn((event: string, callback: Function) => {
			if (callbacks[event]) {
				callbacks[event] = callbacks[event].filter(cb => cb !== callback);
			}
		}),
		send: vi.fn(),
		close: vi.fn(),
		readyState: 1, // OPEN
		// Helper to simulate receiving messages
		_simulateMessage: (data: any) => {
			if (callbacks.message) {
				callbacks.message.forEach(callback => {
					callback({ data: JSON.stringify(data) });
				});
			}
		},
		// Helper to simulate connection close
		_simulateClose: () => {
			if (callbacks.close) {
				callbacks.close.forEach(callback => callback());
			}
		}
	};
};