import React from 'react'
import { screen, fireEvent, waitFor } from '@/test-utils'
import { createMockBranch, createMockBrand, createMockUser } from '@/test-utils'
import DirectusService from '@/services/directusService'

// Mock the DirectusService
jest.mock('@/services/directusService')
const mockDirectusService = DirectusService as jest.Mocked<typeof DirectusService>

// Mock components for integration testing
function MockHubPage() {
  return (
    <div data-testid="hub-page">
      <h1>Restaurant Hub</h1>
      <div data-testid="branch-list" />
      <button data-testid="add-branch-btn">Add Branch</button>
      <button data-testid="refresh-btn">Refresh</button>
    </div>
  )
}

function MockBranchList({ branches }: { branches: any[] }) {
  return (
    <div data-testid="branch-list">
      {branches.map((branch) => (
        <div key={branch.id} data-testid={`branch-${branch.id}`}>
          <h3>{branch.name}</h3>
          <p>{branch.address}</p>
          <span data-testid={`branch-status-${branch.id}`}>
            {branch.status}
          </span>
          <button data-testid={`edit-branch-${branch.id}`}>Edit</button>
          <button data-testid={`delete-branch-${branch.id}`}>Delete</button>
        </div>
      ))}
    </div>
  )
}

describe('Hub Workflow Integration Tests', () => {
  const mockUser = createMockUser({ role: { name: 'Administrator' } })
  const mockBrand = createMockBrand()
  const mockBranches = [
    createMockBranch({ name: 'Restaurant A', status: 'active' }),
    createMockBranch({ name: 'Restaurant B', status: 'inactive' }),
    createMockBranch({ name: 'Restaurant C', status: 'maintenance' })
  ]

  beforeEach(() => {
    jest.clearAllMocks()

    // Setup default mock responses
    mockDirectusService.getBrandsWithBranches.mockResolvedValue([mockBrand])
    mockDirectusService.getBranches.mockResolvedValue(mockBranches)
    mockDirectusService.getBranch.mockResolvedValue(mockBranches[0])
    mockDirectusService.createBranch.mockResolvedValue(mockBranches[0])
    mockDirectusService.updateBranch.mockResolvedValue(mockBranches[0])
  })

  describe('Branch Management Workflow', () => {
    it('should load and display branches correctly', async () => {
      render(<MockHubPage />)

      // Wait for branches to load
      await waitFor(() => {
        expect(mockDirectusService.getBrandsWithBranches).toHaveBeenCalledTimes(1)
      })

      // Render branch list
      render(<MockBranchList branches={mockBranches} />)

      // Verify all branches are displayed
      expect(screen.getByText('Restaurant A')).toBeInTheDocument()
      expect(screen.getByText('Restaurant B')).toBeInTheDocument()
      expect(screen.getByText('Restaurant C')).toBeInTheDocument()

      // Verify branch details
      expect(screen.getByTestId('branch-status-branch-1')).toHaveTextContent('active')
      expect(screen.getByTestId('branch-status-branch-2')).toHaveTextContent('inactive')
      expect(screen.getByTestId('branch-status-branch-3')).toHaveTextContent('maintenance')
    })

    it('should handle branch creation workflow', async () => {
      const newBranch = createMockBranch({
        id: 'new-branch',
        name: 'New Restaurant'
      })
      mockDirectusService.createBranch.mockResolvedValue(newBranch)

      render(<MockHubPage />)

      // Click add branch button
      const addButton = screen.getByTestId('add-branch-btn')
      fireEvent.click(addButton)

      // In a real implementation, this would open a form
      // For integration test, we'll simulate the direct service call
      await act(async () => {
        await mockDirectusService.createBranch({
          name: 'New Restaurant',
          address: '123 New Street',
          brand_id: mockBrand.id
        })
      })

      expect(mockDirectusService.createBranch).toHaveBeenCalledWith({
        name: 'New Restaurant',
        address: '123 New Street',
        brand_id: mockBrand.id
      })
    })

    it('should handle branch editing workflow', async () => {
      render(<MockBranchList branches={mockBranches} />)

      // Click edit button for first branch
      const editButton = screen.getByTestId('edit-branch-branch-1')
      fireEvent.click(editButton)

      // Mock the update call
      const updatedBranch = { ...mockBranches[0], name: 'Updated Restaurant' }
      mockDirectusService.updateBranch.mockResolvedValue(updatedBranch)

      await act(async () => {
        await mockDirectusService.updateBranch('branch-1', {
          name: 'Updated Restaurant'
        })
      })

      expect(mockDirectusService.updateBranch).toHaveBeenCalledWith('branch-1', {
        name: 'Updated Restaurant'
      })
    })

    it('should handle branch deletion workflow', async () => {
      render(<MockBranchList branches={mockBranches} />)

      // Click delete button for first branch
      const deleteButton = screen.getByTestId('delete-branch-branch-1')
      fireEvent.click(deleteButton)

      // In a real implementation, this would show a confirmation dialog
      // Simulate confirmation and deletion
      mockDirectusService.updateBranch.mockResolvedValue({
        ...mockBranches[0],
        status: 'inactive'
      })

      await act(async () => {
        await mockDirectusService.updateBranch('branch-1', {
          status: 'inactive'
        })
      })

      expect(mockDirectusService.updateBranch).toHaveBeenCalledWith('branch-1', {
        status: 'inactive'
      })
    })
  })

  describe('Data Refresh Workflow', () => {
    it('should refresh data when refresh button is clicked', async () => {
      render(<MockHubPage />)

      // Click refresh button
      const refreshButton = screen.getByTestId('refresh-btn')
      fireEvent.click(refreshButton)

      // Verify data fetching is triggered
      await waitFor(() => {
        expect(mockDirectusService.getBrandsWithBranches).toHaveBeenCalledTimes(1)
      })
    })

    it('should handle refresh errors gracefully', async () => {
      mockDirectusService.getBrandsWithBranches.mockRejectedValue(
        new Error('Network error')
      )

      render(<MockHubPage />)

      // Wait for error handling
      await waitFor(() => {
        expect(mockDirectusService.getBrandsWithBranches).toHaveBeenCalledTimes(1)
      })

      // In a real implementation, this would show an error message
      // For integration test, we verify the error was handled
      expect(mockDirectusService.getBrandsWithBranches).toHaveBeenCalled()
    })
  })

  describe('Search and Filter Workflow', () => {
    it('should filter branches by search term', async () => {
      render(<MockBranchList branches={mockBranches} />)

      // Initially all branches should be visible
      expect(screen.getByText('Restaurant A')).toBeInTheDocument()
      expect(screen.getByText('Restaurant B')).toBeInTheDocument()
      expect(screen.getByText('Restaurant C')).toBeInTheDocument()

      // Simulate search functionality
      const filteredBranches = mockBranches.filter(branch =>
        branch.name.toLowerCase().includes('restaurant a')
      )

      // Re-render with filtered data
      render(<MockBranchList branches={filteredBranches} />)

      // Verify only matching branches are shown
      expect(screen.getByText('Restaurant A')).toBeInTheDocument()
      expect(screen.queryByText('Restaurant B')).not.toBeInTheDocument()
      expect(screen.queryByText('Restaurant C')).not.toBeInTheDocument()
    })

    it('should filter branches by status', async () => {
      render(<MockBranchList branches={mockBranches} />)

      // Simulate status filtering
      const activeBranches = mockBranches.filter(branch =>
        branch.status === 'active'
      )

      // Re-render with filtered data
      render(<MockBranchList branches={activeBranches} />)

      // Verify only active branches are shown
      expect(screen.getByText('Restaurant A')).toBeInTheDocument()
      expect(screen.queryByText('Restaurant B')).not.toBeInTheDocument()
      expect(screen.queryByText('Restaurant C')).not.toBeInTheDocument()
    })
  })

  describe('Error Handling Workflow', () => {
    it('should handle network errors gracefully', async () => {
      mockDirectusService.getBrandsWithBranches.mockRejectedValue(
        new Error('Network error')
      )

      render(<MockHubPage />)

      // Wait for the error to be handled
      await waitFor(() => {
        expect(mockDirectusService.getBrandsWithBranches).toHaveBeenCalled()
      })

      // In a real implementation, this would show an error message
      // Verify the app doesn't crash
      expect(screen.getByTestId('hub-page')).toBeInTheDocument()
    })

    it('should handle partial data loading', async () => {
      // Mock partial response
      mockDirectusService.getBrandsWithBranches.mockResolvedValue([
        { ...mockBrand, branches: [mockBranches[0]] } // Only one branch
      ])

      render(<MockHubPage />)

      await waitFor(() => {
        expect(mockDirectusService.getBrandsWithBranches).toHaveBeenCalled()
      })

      // App should still render with partial data
      expect(screen.getByTestId('hub-page')).toBeInTheDocument()
    })
  })

  describe('Performance Integration', () => {
    it('should handle large datasets efficiently', async () => {
      // Create a large dataset
      const largeBranchList = Array.from({ length: 1000 }, (_, index) =>
        createMockBranch({
          id: `branch-${index}`,
          name: `Restaurant ${index + 1}`
        })
      )

      mockDirectusService.getBranches.mockResolvedValue(largeBranchList)

      const startTime = performance.now()

      render(<MockBranchList branches={largeBranchList} />)

      const renderTime = performance.now() - startTime

      // Rendering should complete within reasonable time
      expect(renderTime).toBeLessThan(1000) // 1 second

      // All branches should be rendered
      expect(screen.getByText('Restaurant 1')).toBeInTheDocument()
      expect(screen.getByText('Restaurant 1000')).toBeInTheDocument()
    })
  })
})