import React from 'react'
import { screen, fireEvent, waitFor } from '@/test-utils'
import BranchCard from '../BranchCard'

describe('BranchCard', () => {
  const mockBranch = {
    id: 'branch-1',
    name: 'Test Restaurant',
    address: '123 Test Street, Test City',
    phone: '+1234567890',
    status: 'active',
    tables_count: 10,
    opening_hours: '9:00-22:00',
    brand: {
      id: 'brand-1',
      name: 'Test Brand',
      logo: 'test-logo.png'
    },
    manager: {
      id: 'user-1',
      name: 'Test Manager',
      email: 'manager@test.com'
    },
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  }

  const defaultProps = {
    branch: mockBranch,
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onManageTables: jest.fn(),
    onManageMenu: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders branch information correctly', () => {
    render(<BranchCard {...defaultProps} />)

    expect(screen.getByText('Test Restaurant')).toBeInTheDocument()
    expect(screen.getByText('123 Test Street, Test City')).toBeInTheDocument()
    expect(screen.getByText('+1234567890')).toBeInTheDocument()
    expect(screen.getByText('10 Tables')).toBeInTheDocument()
    expect(screen.getByText('9:00-22:00')).toBeInTheDocument()
    expect(screen.getByText('Test Brand')).toBeInTheDocument()
  })

  it('displays active status correctly', () => {
    render(<BranchCard {...defaultProps} />)

    const statusBadge = screen.getByText('Active')
    expect(statusBadge).toBeInTheDocument()
    expect(statusBadge).toHaveClass('bg-green-100', 'text-green-800')
  })

  it('displays inactive status correctly', () => {
    const inactiveBranch = { ...mockBranch, status: 'inactive' }
    render(<BranchCard {...defaultProps} branch={inactiveBranch} />)

    const statusBadge = screen.getByText('Inactive')
    expect(statusBadge).toBeInTheDocument()
    expect(statusBadge).toHaveClass('bg-gray-100', 'text-gray-800')
  })

  it('calls onEdit when edit button is clicked', () => {
    render(<BranchCard {...defaultProps} />)

    const editButton = screen.getByRole('button', { name: /edit/i })
    fireEvent.click(editButton)

    expect(defaultProps.onEdit).toHaveBeenCalledWith(mockBranch)
  })

  it('calls onDelete when delete button is clicked', async () => {
    const onDelete = jest.fn()
    render(<BranchCard {...defaultProps} onDelete={onDelete} />)

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)

    // Confirmation dialog should appear
    await waitFor(() => {
      expect(screen.getByText(/are you sure/i)).toBeInTheDocument()
    })

    const confirmButton = screen.getByRole('button', { name: /confirm/i })
    fireEvent.click(confirmButton)

    expect(onDelete).toHaveBeenCalledWith(mockBranch)
  })

  it('calls onManageTables when manage tables button is clicked', () => {
    render(<BranchCard {...defaultProps} />)

    const manageTablesButton = screen.getByRole('button', { name: /manage tables/i })
    fireEvent.click(manageTablesButton)

    expect(defaultProps.onManageTables).toHaveBeenCalledWith(mockBranch)
  })

  it('calls onManageMenu when manage menu button is clicked', () => {
    render(<BranchCard {...defaultProps} />)

    const manageMenuButton = screen.getByRole('button', { name: /manage menu/i })
    fireEvent.click(manageMenuButton)

    expect(defaultProps.onManageMenu).toHaveBeenCalledWith(mockBranch)
  })

  it('displays manager information', () => {
    render(<BranchCard {...defaultProps} />)

    expect(screen.getByText('Test Manager')).toBeInTheDocument()
    expect(screen.getByText('manager@test.com')).toBeInTheDocument()
  })

  it('handles missing manager gracefully', () => {
    const branchWithoutManager = { ...mockBranch, manager: null }
    render(<BranchCard {...defaultProps} branch={branchWithoutManager} />)

    expect(screen.queryByText('Test Manager')).not.toBeInTheDocument()
    expect(screen.queryByText('manager@test.com')).not.toBeInTheDocument()
  })

  it('applies correct styling for hover effects', () => {
    render(<BranchCard {...defaultProps} />)

    const card = screen.getByTestId('branch-card')
    expect(card).toHaveClass('hover:shadow-md', 'transition-shadow')
  })

  it('displays brand logo when available', () => {
    render(<BranchCard {...defaultProps} />)

    const logo = screen.getByRole('img', { name: 'Test Brand' })
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', 'test-logo.png')
  })

  it('handles missing brand logo gracefully', () => {
    const branchWithoutBrandLogo = {
      ...mockBranch,
      brand: { ...mockBranch.brand, logo: null }
    }
    render(<BranchCard {...defaultProps} branch={branchWithoutBrandLogo} />)

    const logo = screen.queryByRole('img', { name: 'Test Brand' })
    expect(logo).not.toBeInTheDocument()
  })
})