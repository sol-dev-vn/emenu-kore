import { renderHook, act, waitFor } from '@testing-library/react'
import { useOptimizedData, usePaginatedData } from '../use-optimized-data'
import { CacheManager } from '@/lib/performance'

// Mock the performance module
jest.mock('@/lib/performance', () => ({
  ...jest.requireActual('@/lib/performance'),
  PerformanceMonitor: {
    startTimer: jest.fn(() => jest.fn())
  }
}))

describe('useOptimizedData', () => {
  const mockFetcher = jest.fn()
  const mockOnSuccess = jest.fn()
  const mockOnError = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    // Clear global cache
    const globalCache = new CacheManager()
    globalCache.clear()
  })

  it('should initialize with loading state', () => {
    mockFetcher.mockResolvedValue({ data: 'test' })

    const { result } = renderHook(() =>
      useOptimizedData({
        fetcher: mockFetcher,
        cacheKey: 'test-key'
      })
    )

    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBe(null)
    expect(result.current.error).toBe(null)
  })

  it('should fetch data successfully', async () => {
    const testData = { data: 'test' }
    mockFetcher.mockResolvedValue(testData)

    const { result } = renderHook(() =>
      useOptimizedData({
        fetcher: mockFetcher,
        cacheKey: 'test-key'
      })
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toEqual(testData)
    expect(result.current.error).toBe(null)
    expect(mockFetcher).toHaveBeenCalledTimes(1)
    expect(mockOnSuccess).not.toHaveBeenCalled()
  })

  it('should call onSuccess callback when data is fetched successfully', async () => {
    const testData = { data: 'test' }
    mockFetcher.mockResolvedValue(testData)

    renderHook(() =>
      useOptimizedData({
        fetcher: mockFetcher,
        cacheKey: 'test-key',
        onSuccess: mockOnSuccess
      })
    )

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith(testData)
    })
  })

  it('should handle fetch errors', async () => {
    const testError = new Error('Test error')
    mockFetcher.mockRejectedValue(testError)

    const { result } = renderHook(() =>
      useOptimizedData({
        fetcher: mockFetcher,
        cacheKey: 'test-key',
        onError: mockOnError
      })
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toBe(null)
    expect(result.current.error).toEqual(testError)
    expect(mockOnError).toHaveBeenCalledWith(testError)
  })

  it('should use cache when available', async () => {
    const testData = { data: 'cached' }
    const cache = new CacheManager()
    cache.set('test-key', testData)

    mockFetcher.mockResolvedValue({ data: 'fresh' })

    const { result } = renderHook(() =>
      useOptimizedData({
        fetcher: mockFetcher,
        cacheKey: 'test-key'
      })
    )

    // Should return cached data immediately
    expect(result.current.data).toEqual(testData)
    expect(result.current.loading).toBe(false)

    await waitFor(() => {
      // Should still fetch fresh data in background
      expect(mockFetcher).toHaveBeenCalledTimes(1)
    })
  })

  it('should refetch data when refetch is called', async () => {
    const testData1 = { data: 'test1' }
    const testData2 = { data: 'test2' }
    mockFetcher
      .mockResolvedValueOnce(testData1)
      .mockResolvedValueOnce(testData2)

    const { result } = renderHook(() =>
      useOptimizedData({
        fetcher: mockFetcher,
        cacheKey: 'test-key'
      })
    )

    await waitFor(() => {
      expect(result.current.data).toEqual(testData1)
    })

    act(() => {
      result.current.refetch()
    })

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.data).toEqual(testData2)
      expect(result.current.loading).toBe(false)
    })

    expect(mockFetcher).toHaveBeenCalledTimes(2)
  })

  it('should mutate data correctly', async () => {
    const testData = { data: 'test' }
    mockFetcher.mockResolvedValue(testData)

    const { result } = renderHook(() =>
      useOptimizedData({
        fetcher: mockFetcher,
        cacheKey: 'test-key'
      })
    )

    await waitFor(() => {
      expect(result.current.data).toEqual(testData)
    })

    const newData = { data: 'mutated' }
    act(() => {
      result.current.mutate(newData)
    })

    expect(result.current.data).toEqual(newData)
  })

  it('should mutate data with function updater', async () => {
    const testData = { count: 1 }
    mockFetcher.mockResolvedValue(testData)

    const { result } = renderHook(() =>
      useOptimizedData({
        fetcher: mockFetcher,
        cacheKey: 'test-key'
      })
    )

    await waitFor(() => {
      expect(result.current.data).toEqual(testData)
    })

    act(() => {
      result.current.mutate((prev: any) => ({ ...prev, count: prev.count + 1 }))
    })

    expect(result.current.data).toEqual({ count: 2 })
  })

  it('should refetch when dependencies change', async () => {
    const testData1 = { data: 'test1' }
    const testData2 = { data: 'test2' }
    mockFetcher
      .mockResolvedValueOnce(testData1)
      .mockResolvedValueOnce(testData2)

    const { rerender } = renderHook(
      ({ dependency }) =>
        useOptimizedData({
          fetcher: mockFetcher,
          cacheKey: 'test-key',
          dependencies: [dependency]
        }),
      { initialProps: { dependency: 'value1' } }
    )

    await waitFor(() => {
      expect(mockFetcher).toHaveBeenCalledTimes(1)
    })

    rerender({ dependency: 'value2' })

    await waitFor(() => {
      expect(mockFetcher).toHaveBeenCalledTimes(2)
    })
  })
})

describe('usePaginatedData', () => {
  const mockPaginatedFetcher = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should handle paginated data correctly', async () => {
    const mockResponse = {
      data: ['item1', 'item2'],
      total: 10
    }
    mockPaginatedFetcher.mockResolvedValue(mockResponse)

    const { result } = renderHook(() =>
      usePaginatedData({
        fetcher: mockPaginatedFetcher,
        pageSize: 5,
        cacheKey: 'paginated-test'
      })
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toEqual(['item1', 'item2'])
    expect(result.current.total).toBe(10)
    expect(result.current.currentPage).toBe(1)
    expect(result.current.hasMore).toBe(true)
    expect(mockPaginatedFetcher).toHaveBeenCalledWith(1, 5)
  })

  it('should load more data correctly', async () => {
    const firstPage = {
      data: ['item1', 'item2'],
      total: 6
    }
    const secondPage = {
      data: ['item3', 'item4'],
      total: 6
    }
    mockPaginatedFetcher
      .mockResolvedValueOnce(firstPage)
      .mockResolvedValueOnce(secondPage)

    const { result } = renderHook(() =>
      usePaginatedData({
        fetcher: mockPaginatedFetcher,
        pageSize: 2,
        cacheKey: 'paginated-test'
      })
    )

    await waitFor(() => {
      expect(result.current.data).toEqual(['item1', 'item2'])
      expect(result.current.hasMore).toBe(true)
    })

    act(() => {
      result.current.loadMore()
    })

    await waitFor(() => {
      expect(result.current.data).toEqual(['item1', 'item2', 'item3', 'item4'])
      expect(result.current.currentPage).toBe(2)
    })

    expect(mockPaginatedFetcher).toHaveBeenCalledTimes(2)
    expect(mockPaginatedFetcher).toHaveBeenNthCalledWith(1, 1, 2)
    expect(mockPaginatedFetcher).toHaveBeenNthCalledWith(2, 2, 2)
  })

  it('should reset correctly', async () => {
    const firstPage = {
      data: ['item1', 'item2'],
      total: 6
    }
    const secondPage = {
      data: ['item3', 'item4'],
      total: 6
    }
    mockPaginatedFetcher
      .mockResolvedValueOnce(firstPage)
      .mockResolvedValueOnce(secondPage)

    const { result } = renderHook(() =>
      usePaginatedData({
        fetcher: mockPaginatedFetcher,
        pageSize: 2,
        cacheKey: 'paginated-test'
      })
    )

    await waitFor(() => {
      expect(result.current.data).toEqual(['item1', 'item2'])
    })

    act(() => {
      result.current.loadMore()
    })

    await waitFor(() => {
      expect(result.current.data).toEqual(['item1', 'item2', 'item3', 'item4'])
    })

    act(() => {
      result.current.reset()
    })

    expect(result.current.data).toEqual([])
    expect(result.current.currentPage).toBe(1)
  })

  it('should not load more when no more data is available', async () => {
    const mockResponse = {
      data: ['item1', 'item2'],
      total: 2
    }
    mockPaginatedFetcher.mockResolvedValue(mockResponse)

    const { result } = renderHook(() =>
      usePaginatedData({
        fetcher: mockPaginatedFetcher,
        pageSize: 5,
        cacheKey: 'paginated-test'
      })
    )

    await waitFor(() => {
      expect(result.current.hasMore).toBe(false)
    })

    act(() => {
      result.current.loadMore()
    })

    // Should not call fetcher again
    expect(mockPaginatedFetcher).toHaveBeenCalledTimes(1)
  })
})