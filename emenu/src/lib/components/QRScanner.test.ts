import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import QRScanner from './QRScanner.svelte';

// Mock the QR scanner library
vi.mock('@yudiel/react-qr-scanner', () => ({
	default: vi.fn().mockImplementation(({ onDecode }) => {
		// Mock component that calls onDecode when a QR code is "scanned"
		return {
			$on: vi.fn(),
			destroy: vi.fn()
		};
	})
}));

describe('QRScanner Component', () => {
	const mockOnScan = vi.fn();
	const mockOnError = vi.fn();
	const mockOnClose = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		// Mock getUserMedia for camera access
		Object.defineProperty(navigator, 'mediaDevices', {
			writable: true,
			value: {
				getUserMedia: vi.fn().mockResolvedValue({
					getTracks: () => [{ stop: vi.fn() }]
				})
			}
		});
	});

	it('should render scanner interface', () => {
		render(QRScanner, {
			props: {
				onScan: mockOnScan,
				onError: mockOnError,
				onClose: mockOnClose
			}
		});

		expect(screen.getByTestId('qr-scanner')).toBeInTheDocument();
		expect(screen.getByText(/scan qr code/i)).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
	});

	it('should request camera permissions on mount', async () => {
		render(QRScanner, {
			props: {
				onScan: mockOnScan,
				onError: mockOnError,
				onClose: mockOnClose
			}
		});

		await waitFor(() => {
			expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
				video: { facingMode: 'environment' }
			});
		});
	});

	it('should handle successful QR code scan', async () => {
		const mockQRData = JSON.stringify({
			tableId: 'table-123',
			timestamp: Date.now(),
			restaurantId: 'restaurant-456'
		});

		render(QRScanner, {
			props: {
				onScan: mockOnScan,
				onError: mockOnError,
				onClose: mockOnClose
			}
		});

		// Simulate QR code scan
		const scanner = screen.getByTestId('qr-scanner');
		fireEvent(scanner, new CustomEvent('decode', { detail: mockQRData }));

		await waitFor(() => {
			expect(mockOnScan).toHaveBeenCalledWith({
				tableId: 'table-123',
				timestamp: expect.any(Number),
				restaurantId: 'restaurant-456'
			});
		});
	});

	it('should validate QR code format', async () => {
		const invalidQRData = 'invalid-qr-content';

		render(QRScanner, {
			props: {
				onScan: mockOnScan,
				onError: mockOnError,
				onClose: mockOnClose
			}
		});

		const scanner = screen.getByTestId('qr-scanner');
		fireEvent(scanner, new CustomEvent('decode', { detail: invalidQRData }));

		await waitFor(() => {
			expect(mockOnScan).not.toHaveBeenCalled();
			expect(mockOnError).toHaveBeenCalledWith('Invalid QR code format');
			expect(screen.getByText(/invalid qr code/i)).toBeInTheDocument();
		});
	});

	it('should check QR code expiration', async () => {
		const expiredQRData = JSON.stringify({
			tableId: 'table-123',
			timestamp: Date.now() - 31 * 60 * 1000, // 31 minutes ago
			restaurantId: 'restaurant-456'
		});

		render(QRScanner, {
			props: {
				onScan: mockOnScan,
				onError: mockOnError,
				onClose: mockOnClose
			}
		});

		const scanner = screen.getByTestId('qr-scanner');
		fireEvent(scanner, new CustomEvent('decode', { detail: expiredQRData }));

		await waitFor(() => {
			expect(mockOnScan).not.toHaveBeenCalled();
			expect(mockOnError).toHaveBeenCalledWith('QR code has expired');
		});
	});

	it('should handle camera permission denial', async () => {
		const getUserMediaMock = vi.fn().mockRejectedValue(new Error('Permission denied'));
		Object.defineProperty(navigator, 'mediaDevices', {
			writable: true,
			value: {
				getUserMedia: getUserMediaMock
			}
		});

		render(QRScanner, {
			props: {
				onScan: mockOnScan,
				onError: mockOnError,
				onClose: mockOnClose
			}
		});

		await waitFor(() => {
			expect(mockOnError).toHaveBeenCalledWith('Camera access denied');
			expect(screen.getByText(/camera access required/i)).toBeInTheDocument();
		});
	});

	it('should provide fallback option for manual entry', async () => {
		const getUserMediaMock = vi.fn().mockRejectedValue(new Error('Permission denied'));
		Object.defineProperty(navigator, 'mediaDevices', {
			writable: true,
			value: {
				getUserMedia: getUserMediaMock
			}
		});

		render(QRScanner, {
			props: {
				onScan: mockOnScan,
				onError: mockOnError,
				onClose: mockOnClose
			}
		});

		await waitFor(() => {
			expect(screen.getByText(/enter table code manually/i)).toBeInTheDocument();
			expect(screen.getByRole('button', { name: /manual entry/i })).toBeInTheDocument();
		});

		const manualEntryButton = screen.getByRole('button', { name: /manual entry/i });
		fireEvent.click(manualEntryButton);

		expect(screen.getByLabelText(/table code/i)).toBeInTheDocument();
	});

	it('should handle manual table code entry', async () => {
		render(QRScanner, {
			props: {
				onScan: mockOnScan,
				onError: mockOnError,
				onClose: mockOnClose
			}
		});

		// Enable manual entry mode
		const manualEntryButton = screen.getByRole('button', { name: /manual entry/i });
		fireEvent.click(manualEntryButton);

		const codeInput = screen.getByLabelText(/table code/i);
		const submitButton = screen.getByRole('button', { name: /submit/i });

		fireEvent.input(codeInput, { target: { value: 'TABLE123' } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(mockOnScan).toHaveBeenCalledWith({
				tableId: 'TABLE123',
				manualEntry: true
			});
		});
	});

	it('should handle close action', () => {
		render(QRScanner, {
			props: {
				onScan: mockOnScan,
				onError: mockOnError,
				onClose: mockOnClose
			}
		});

		const closeButton = screen.getByRole('button', { name: /close/i });
		fireEvent.click(closeButton);

		expect(mockOnClose).toHaveBeenCalled();
	});

	it('should show loading state while initializing', () => {
		render(QRScanner, {
			props: {
				onScan: mockOnScan,
				onError: mockOnError,
				onClose: mockOnClose,
				loading: true
			}
		});

		expect(screen.getByText(/initializing camera/i)).toBeInTheDocument();
		expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
	});

	it('should show torch toggle for supported devices', () => {
		render(QRScanner, {
			props: {
				onScan: mockOnScan,
				onError: mockOnError,
				onClose: mockOnClose,
				supportsTorch: true
			}
		});

		expect(screen.getByRole('button', { name: /toggle flashlight/i })).toBeInTheDocument();
	});

	it('should handle torch toggle', () => {
		const mockSetTorch = vi.fn();
		render(QRScanner, {
			props: {
				onScan: mockOnScan,
				onError: mockOnError,
				onClose: mockOnClose,
				supportsTorch: true,
				onTorchToggle: mockSetTorch
			}
		});

		const torchButton = screen.getByRole('button', { name: /toggle flashlight/i });
		fireEvent.click(torchButton);

		expect(mockSetTorch).toHaveBeenCalledWith(true);
	});

	it('should be accessible', () => {
		render(QRScanner, {
			props: {
				onScan: mockOnScan,
				onError: mockOnError,
				onClose: mockOnClose
			}
		});

		// Check for proper ARIA labels
		const scanner = screen.getByTestId('qr-scanner');
		expect(scanner).toHaveAttribute('aria-label', 'QR Code Scanner');
		expect(scanner).toHaveAttribute('role', 'application');

		// Check for keyboard navigation
		const closeButton = screen.getByRole('button', { name: /close/i });
		expect(closeButton).toHaveAttribute('aria-label', 'Close QR scanner');
	});

	it('should handle different camera devices', async () => {
		const mockDevices = [
			{ deviceId: 'camera1', label: 'Back Camera' },
			{ deviceId: 'camera2', label: 'Front Camera' }
		];

		Object.defineProperty(navigator, 'mediaDevices', {
			writable: true,
			value: {
				getUserMedia: vi.fn().mockResolvedValue({
					getTracks: () => [{ stop: vi.fn() }]
				}),
				enumerateDevices: vi.fn().mockResolvedValue(mockDevices)
			}
		});

		render(QRScanner, {
			props: {
				onScan: mockOnScan,
				onError: mockOnError,
				onClose: mockOnClose,
				showCameraSwitch: true
			}
		});

		await waitFor(() => {
			expect(screen.getByRole('button', { name: /switch camera/i })).toBeInTheDocument();
		});

		const switchButton = screen.getByRole('button', { name: /switch camera/i });
		fireEvent.click(switchButton);

		// Verify camera switching logic would be called
	});
});