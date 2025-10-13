import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import TableGrid from './TableGrid.svelte';
import { createMockTable } from '../../test/setup';

describe('TableGrid Component', () => {
	const mockTables = [
		createMockTable({ id: 'table-1', name: 'Table 1', status: 'available', capacity: 4 }),
		createMockTable({ id: 'table-2', name: 'Table 2', status: 'occupied', capacity: 2 }),
		createMockTable({ id: 'table-3', name: 'Table 3', status: 'reserved', capacity: 6 }),
		createMockTable({ id: 'table-4', name: 'Table 4', status: 'cleaning', capacity: 4 })
	];

	const mockOnTableSelect = vi.fn();
	const mockOnTableStatusChange = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should render grid of tables', () => {
		render(TableGrid, {
			props: {
				tables: mockTables,
				onTableSelect: mockOnTableSelect,
				onTableStatusChange: mockOnTableStatusChange
			}
		});

		expect(screen.getByText('Table 1')).toBeInTheDocument();
		expect(screen.getByText('Table 2')).toBeInTheDocument();
		expect(screen.getByText('Table 3')).toBeInTheDocument();
		expect(screen.getByText('Table 4')).toBeInTheDocument();
	});

	it('should display correct status colors for each table', () => {
		render(TableGrid, {
			props: {
				tables: mockTables,
				onTableSelect: mockOnTableSelect,
				onTableStatusChange: mockOnTableStatusChange
			}
		});

		const table1 = screen.getByTestId('table-table-1');
		const table2 = screen.getByTestId('table-table-2');
		const table3 = screen.getByTestId('table-table-3');
		const table4 = screen.getByTestId('table-table-4');

		expect(table1).toHaveClass('bg-green-100'); // available
		expect(table2).toHaveClass('bg-red-100'); // occupied
		expect(table3).toHaveClass('bg-yellow-100'); // reserved
		expect(table4).toHaveClass('bg-blue-100'); // cleaning
	});

	it('should show table capacity and current occupancy', () => {
		const tablesWithSession = [
			...mockTables.slice(0, 3),
			createMockTable({
				id: 'table-5',
				name: 'Table 5',
				status: 'occupied',
				capacity: 4,
				currentSession: {
					id: 'session-1',
					guests: 3,
					startTime: new Date().toISOString()
				}
			})
		];

		render(TableGrid, {
			props: {
				tables: tablesWithSession,
				onTableSelect: mockOnTableSelect,
				onTableStatusChange: mockOnTableStatusChange
			}
		});

		expect(screen.getByText('4 guests')).toBeInTheDocument();
		expect(screen.getByText('3/4')).toBeInTheDocument();
	});

	it('should handle table selection', async () => {
		render(TableGrid, {
			props: {
				tables: mockTables,
				onTableSelect: mockOnTableSelect,
				onTableStatusChange: mockOnTableStatusChange
			}
		});

		const table1 = screen.getByTestId('table-table-1');
		fireEvent.click(table1);

		await waitFor(() => {
			expect(mockOnTableSelect).toHaveBeenCalledWith(mockTables[0]);
		});
	});

	it('should allow status changes via context menu', async () => {
		render(TableGrid, {
			props: {
				tables: mockTables,
				onTableSelect: mockOnTableSelect,
				onTableStatusChange: mockOnTableStatusChange
			}
		});

		const table1 = screen.getByTestId('table-table-1');
		fireEvent.contextMenu(table1);

		await waitFor(() => {
			expect(screen.getByText('Mark as Occupied')).toBeInTheDocument();
			expect(screen.getByText('Mark as Reserved')).toBeInTheDocument();
			expect(screen.getByText('Mark for Cleaning')).toBeInTheDocument();
		});

		const markOccupied = screen.getByText('Mark as Occupied');
		fireEvent.click(markOccupied);

		await waitFor(() => {
			expect(mockOnTableStatusChange).toHaveBeenCalledWith('table-1', 'occupied');
		});
	});

	it('should filter tables by status', async () => {
		render(TableGrid, {
			props: {
				tables: mockTables,
				onTableSelect: mockOnTableSelect,
				onTableStatusChange: mockOnTableStatusChange,
				statusFilter: 'available'
			}
		});

		expect(screen.getByText('Table 1')).toBeInTheDocument();
		expect(screen.queryByText('Table 2')).not.toBeInTheDocument();
		expect(screen.queryByText('Table 3')).not.toBeInTheDocument();
		expect(screen.queryByText('Table 4')).not.toBeInTheDocument();
	});

	it('should search tables by name', async () => {
		render(TableGrid, {
			props: {
				tables: mockTables,
				onTableSelect: mockOnTableSelect,
				onTableStatusChange: mockOnTableStatusChange,
				searchQuery: 'Table 1'
			}
		});

		expect(screen.getByText('Table 1')).toBeInTheDocument();
		expect(screen.queryByText('Table 2')).not.toBeInTheDocument();
		expect(screen.queryByText('Table 3')).not.toBeInTheDocument();
		expect(screen.queryByText('Table 4')).not.toBeInTheDocument();
	});

	it('should group tables by zone', async () => {
		const tablesWithZones = [
			createMockTable({ id: 'table-1', name: 'Table 1', zone: 'Main Dining' }),
			createMockTable({ id: 'table-2', name: 'Table 2', zone: 'Main Dining' }),
			createMockTable({ id: 'table-3', name: 'Table 3', zone: 'Patio' }),
			createMockTable({ id: 'table-4', name: 'Table 4', zone: 'Patio' })
		];

		render(TableGrid, {
			props: {
				tables: tablesWithZones,
				onTableSelect: mockOnTableSelect,
				onTableStatusChange: mockOnTableStatusChange,
				groupByZone: true
			}
		});

		expect(screen.getByText('Main Dining')).toBeInTheDocument();
		expect(screen.getByText('Patio')).toBeInTheDocument();
		expect(screen.getByText('Table 1')).toBeInTheDocument();
		expect(screen.getByText('Table 3')).toBeInTheDocument();
	});

	it('should show loading skeleton', () => {
		render(TableGrid, {
			props: {
				tables: [],
				loading: true,
				onTableSelect: mockOnTableSelect,
				onTableStatusChange: mockOnTableStatusChange
			}
		});

		expect(screen.getAllByTestId('table-skeleton')).toHaveLength(8); // Default skeleton count
	});

	it('should show empty state when no tables', () => {
		render(TableGrid, {
			props: {
				tables: [],
				loading: false,
				onTableSelect: mockOnTableSelect,
				onTableStatusChange: mockOnTableStatusChange
			}
		});

		expect(screen.getByText(/no tables found/i)).toBeInTheDocument();
	});

	it('should handle drag and drop for table repositioning', async () => {
		render(TableGrid, {
			props: {
				tables: mockTables,
				onTableSelect: mockOnTableSelect,
				onTableStatusChange: mockOnTableStatusChange,
				allowRepositioning: true
			}
		});

		const table1 = screen.getByTestId('table-table-1');
		const mockOnTableReposition = vi.fn();

		// Mock drag events
		fireEvent.dragStart(table1, {
			dataTransfer: {
				setData: vi.fn(),
				getData: vi.fn(() => 'table-1')
			}
		});

		// This would need to be implemented based on the actual drag and drop library used
		// For now, we verify the component renders with repositioning enabled
		expect(table1).toHaveAttribute('draggable');
	});

	it('should display table performance metrics', () => {
		const tablesWithMetrics = [
			createMockTable({
				id: 'table-1',
				name: 'Table 1',
				metrics: {
					turnoverTime: 45, // minutes
					revenue: 2500000, // VND
					occupancyRate: 0.85
				}
			})
		];

		render(TableGrid, {
			props: {
				tables: tablesWithMetrics,
				onTableSelect: mockOnTableSelect,
				onTableStatusChange: mockOnTableStatusChange,
				showMetrics: true
			}
		});

		expect(screen.getByText('45m')).toBeInTheDocument(); // turnover time
		expect(screen.getByText('2.5M')).toBeInTheDocument(); // revenue
		expect(screen.getByText('85%')).toBeInTheDocument(); // occupancy rate
	});

	it('should be accessible', () => {
		render(TableGrid, {
			props: {
				tables: mockTables,
				onTableSelect: mockOnTableSelect,
				onTableStatusChange: mockOnTableStatusChange
			}
		});

		// Check for proper ARIA labels
		const table1 = screen.getByTestId('table-table-1');
		expect(table1).toHaveAttribute('aria-label', 'Table 1, available, 4 guests');

		// Check for keyboard navigation
		expect(table1).toHaveAttribute('tabindex', '0');
	});
});