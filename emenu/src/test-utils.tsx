import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { I18nProvider } from '@/contexts/I18nContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/components/ui/ThemeProvider'

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <I18nProvider>
          {children}
        </I18nProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything from testing-library
export * from '@testing-library/react'
export { customRender as render }

// Mock data generators
export const createMockBrand = (overrides = {}) => ({
  id: 'brand-1',
  name: 'Test Brand',
  description: 'Test Brand Description',
  logo: 'test-logo.png',
  status: 'active',
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
  ...overrides,
})

export const createMockBranch = (overrides = {}) => ({
  id: 'branch-1',
  name: 'Test Branch',
  address: '123 Test Street',
  phone: '+1234567890',
  status: 'active',
  tables_count: 10,
  opening_hours: '9:00-22:00',
  brand_id: 'brand-1',
  manager: {
    id: 'user-1',
    name: 'Test Manager',
    email: 'manager@test.com',
    phone: '+1234567890',
  },
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
  ...overrides,
})

export const createMockUser = (overrides = {}) => ({
  id: 'user-1',
  first_name: 'Test',
  last_name: 'User',
  email: 'test@example.com',
  role: {
    id: 'role-1',
    name: 'Administrator',
    description: 'System Administrator',
  },
  avatar: 'test-avatar.png',
  ...overrides,
})

export const createMockMenuItem = (overrides = {}) => ({
  id: 'menu-1',
  name: 'Test Menu Item',
  description: 'Test Description',
  category: 'Test Category',
  price: 10.99,
  image: 'test-image.png',
  status: 'active',
  dietary_info: ['vegetarian', 'gluten-free'],
  prep_time: '15 mins',
  rating: 4.5,
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
  ...overrides,
})

export const createMockQRCode = (overrides = {}) => ({
  id: 'qr-1',
  table_id: 'table-1',
  branch_id: 'branch-1',
  qr_code_data: 'test-qr-data',
  status: 'generated',
  download_url: 'test-download-url',
  created_at: '2023-01-01T00:00:00Z',
  ...overrides,
})

// Mock handlers
export const createMockHandlers = {
  onClick: jest.fn(),
  onChange: jest.fn(),
  onSubmit: jest.fn(),
  onLoad: jest.fn(),
  onError: jest.fn(),
}

// Mock promises
export const createMockPromise = <T>(data: T, delay = 0): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay)
  })
}

export const createMockRejectedPromise = <T>(error: Error, delay = 0): Promise<T> => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(error), delay)
  })
}

// Wait for component to update
export const waitFor = (condition: () => boolean, timeout = 5000): Promise<void> => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()
    const check = () => {
      if (condition()) {
        resolve()
      } else if (Date.now() - startTime > timeout) {
        reject(new Error('Timeout waiting for condition'))
      } else {
        setTimeout(check, 50)
      }
    }
    check()
  })
}

// Mock ResizeObserver for tests that need it
export const setupResizeObserverMock = () => {
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }))
}

// Mock IntersectionObserver for tests that need it
export const setupIntersectionObserverMock = () => {
  global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }))
}

export default customRender