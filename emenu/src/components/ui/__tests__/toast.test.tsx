import React from 'react'
import { screen, fireEvent, waitFor } from '@/test-utils'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '../toast'

// Test component that uses the toast hook
function TestComponent() {
  const { toast } = useToast()

  return (
    <div>
      <button
        onClick={() => toast({ title: 'Success message', description: 'This is a success' })}
        data-testid="success-toast"
      >
        Show Success
      </button>
      <button
        onClick={() => toast({
          title: 'Error message',
          description: 'This is an error',
          variant: 'destructive'
        })}
        data-testid="error-toast"
      >
        Show Error
      </button>
      <button
        onClick={() => toast({
          title: 'Loading message',
          description: 'This is loading',
          variant: 'default'
        })}
        data-testid="loading-toast"
      >
        Show Loading
      </button>
    </div>
  )
}

describe('Toast', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders a success toast correctly', async () => {
    render(
      <>
        <TestComponent />
        <Toaster />
      </>
    )

    const successButton = screen.getByTestId('success-toast')
    fireEvent.click(successButton)

    await waitFor(() => {
      expect(screen.getByText('Success message')).toBeInTheDocument()
      expect(screen.getByText('This is a success')).toBeInTheDocument()
    })

    // Check for success icon (checkmark)
    const successIcon = document.querySelector('[data-testid="toast-success-icon"]')
    expect(successIcon).toBeInTheDocument()
  })

  it('renders an error toast correctly', async () => {
    render(
      <>
        <TestComponent />
        <Toaster />
      </>
    )

    const errorButton = screen.getByTestId('error-toast')
    fireEvent.click(errorButton)

    await waitFor(() => {
      expect(screen.getByText('Error message')).toBeInTheDocument()
      expect(screen.getByText('This is an error')).toBeInTheDocument()
    })

    // Check for error icon (X)
    const errorIcon = document.querySelector('[data-testid="toast-error-icon"]')
    expect(errorIcon).toBeInTheDocument()
  })

  it('renders a loading toast correctly', async () => {
    render(
      <>
        <TestComponent />
        <Toaster />
      </>
    )

    const loadingButton = screen.getByTestId('loading-toast')
    fireEvent.click(loadingButton)

    await waitFor(() => {
      expect(screen.getByText('Loading message')).toBeInTheDocument()
      expect(screen.getByText('This is loading')).toBeInTheDocument()
    })

    // Check for loading icon
    const loadingIcon = document.querySelector('[data-testid="toast-loading-icon"]')
    expect(loadingIcon).toBeInTheDocument()
  })

  it('automatically dismisses toast after duration', async () => {
    render(
      <>
        <TestComponent />
        <Toaster />
      </>
    )

    const successButton = screen.getByTestId('success-toast')
    fireEvent.click(successButton)

    await waitFor(() => {
      expect(screen.getByText('Success message')).toBeInTheDocument()
    })

    // Fast-forward time beyond the default duration
    jest.advanceTimersByTime(5000)

    await waitFor(() => {
      expect(screen.queryByText('Success message')).not.toBeInTheDocument()
    })
  })

  it('allows manual dismissal of toast', async () => {
    render(
      <>
        <TestComponent />
        <Toaster />
      </>
    )

    const successButton = screen.getByTestId('success-toast')
    fireEvent.click(successButton)

    await waitFor(() => {
      expect(screen.getByText('Success message')).toBeInTheDocument()
    })

    // Find and click the dismiss button
    const dismissButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(dismissButton)

    await waitFor(() => {
      expect(screen.queryByText('Success message')).not.toBeInTheDocument()
    })
  })

  it('renders multiple toasts correctly', async () => {
    render(
      <>
        <TestComponent />
        <Toaster />
      </>
    )

    const successButton = screen.getByTestId('success-toast')
    const errorButton = screen.getByTestId('error-toast')

    fireEvent.click(successButton)
    fireEvent.click(errorButton)

    await waitFor(() => {
      expect(screen.getByText('Success message')).toBeInTheDocument()
      expect(screen.getByText('Error message')).toBeInTheDocument()
    })

    // Check that both toasts are rendered
    const toastElements = document.querySelectorAll('[data-testid="toast"]')
    expect(toastElements).toHaveLength(2)
  })

  it('dismisses toast when dismiss function is called', async () => {
    function TestComponentWithDismiss() {
      const { toast, dismiss } = useToast()

      return (
        <div>
          <button
            onClick={() => {
              const id = toast({ title: 'Test message' })
              // Dismiss immediately
              setTimeout(() => dismiss(id), 100)
            }}
            data-testid="toast-with-dismiss"
          >
            Show and Dismiss
          </button>
        </div>
      )
    }

    render(
      <>
        <TestComponentWithDismiss />
        <Toaster />
      </>
    )

    const button = screen.getByTestId('toast-with-dismiss')
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('Test message')).toBeInTheDocument()
    })

    // Fast-forward the dismiss timeout
    jest.advanceTimersByTime(100)

    await waitFor(() => {
      expect(screen.queryByText('Test message')).not.toBeInTheDocument()
    })
  })

  it('handles accessibility attributes correctly', async () => {
    render(
      <>
        <TestComponent />
        <Toaster />
      </>
    )

    const successButton = screen.getByTestId('success-toast')
    fireEvent.click(successButton)

    await waitFor(() => {
      const toastElement = document.querySelector('[data-testid="toast"]')
      expect(toastElement).toHaveAttribute('role', 'alert')
      expect(toastElement).toHaveAttribute('aria-live', 'polite')
    })
  })

  it('applies correct variant styles', async () => {
    render(
      <>
        <TestComponent />
        <Toaster />
      </>
    )

    const successButton = screen.getByTestId('success-toast')
    const errorButton = screen.getByTestId('error-toast')

    fireEvent.click(successButton)
    fireEvent.click(errorButton)

    await waitFor(() => {
      // Check success variant has success classes
      const successToast = screen.getByText('Success message').closest('[data-testid="toast"]')
      expect(successToast).toHaveClass('border-green-200', 'bg-green-50')

      // Check error variant has error classes
      const errorToast = screen.getByText('Error message').closest('[data-testid="toast"]')
      expect(errorToast).toHaveClass('border-red-200', 'bg-red-50')
    })
  })
})