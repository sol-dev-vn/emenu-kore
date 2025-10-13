import { render, RenderOptions } from '@testing-library/svelte';
import type { SvelteComponent } from 'svelte';

// Custom render function with additional options
export function renderWithSetup<T extends SvelteComponent>(
	Component: new (options: any) => T,
	options: RenderOptions<T> = {}
) {
	const { ...restOptions } = options;

	return render(Component, {
		...restOptions,
		props: {
			...restOptions.props
		}
	});
}

// Helper to wait for async operations
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

// Helper to create mock events
export const createMockEvent = (type: string, properties = {}) => ({
	type,
	preventDefault: vi.fn(),
	stopPropagation: vi.fn(),
	...properties
});

// Helper to mock localStorage
export const createMockLocalStorage = () => {
	let store: Record<string, string> = {};

	return {
		getItem: vi.fn((key: string) => store[key] || null),
		setItem: vi.fn((key: string, value: string) => {
			store[key] = value;
		}),
		removeItem: vi.fn((key: string) => {
			delete store[key];
		}),
		clear: vi.fn(() => {
			store = {};
		}),
		get length() {
			return Object.keys(store).length;
		},
		key: vi.fn((index: number) => Object.keys(store)[index] || null)
	};
};

// Helper to mock fetch
export const createMockFetch = (response: any, options = { status: 200 }) => {
	return vi.fn().mockResolvedValue({
		ok: options.status >= 200 && options.status < 300,
		status: options.status,
		json: async () => response,
		text: async () => JSON.stringify(response),
		headers: new Headers({
			'Content-Type': 'application/json'
		})
	});
};

// Helper to create mock WebSocket
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
		}
	};
};

// Helper to test accessibility
export const testAccessibility = async (container: HTMLElement) => {
	const images = container.querySelectorAll('img');
	images.forEach(img => {
		if (!img.alt && !img.getAttribute('aria-hidden')) {
			console.warn('Image missing alt text:', img);
		}
	});

	const buttons = container.querySelectorAll('button');
	buttons.forEach(button => {
		if (!button.textContent?.trim() && !button.getAttribute('aria-label')) {
			console.warn('Button missing accessible text:', button);
		}
	});

	const inputs = container.querySelectorAll('input');
	inputs.forEach(input => {
		if (!input.getAttribute('aria-label') && !document.querySelector(`label[for="${input.id}"]`)) {
			console.warn('Input missing label:', input);
		}
	});
};