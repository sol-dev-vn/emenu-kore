// Data service for branch management with caching and optimization
import { useState, useEffect } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class BranchService {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  // Cache management
  private setCache<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl
    });
  }

  private getCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  private clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  // API wrapper with retry logic
  private async fetchWithRetry<T>(
    url: string,
    options: RequestInit = {},
    retries: number = 3
  ): Promise<T> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (4 - retries)));
        return this.fetchWithRetry(url, options, retries - 1);
      }
      throw error;
    }
  }

  // Brand operations
  async getBrands(forceRefresh: boolean = false): Promise<any[]> {
    const cacheKey = 'brands';

    if (!forceRefresh) {
      const cached = this.getCache<any[]>(cacheKey);
      if (cached) return cached;
    }

    try {
      console.log('🏪 [SERVER] Fetching brands from Directus API...');
      // Use Directus API instead of mock data
      const { DirectusService } = await import('./directusService');

      const brands = await DirectusService.getBrands();

      console.log('🏪 [SERVER] Brands fetched from Directus:', brands.length, 'brands');
      console.log('🏪 [SERVER] Brands data:', brands);
      this.setCache(cacheKey, brands);
      return brands;
    } catch (error) {
      console.error('Failed to fetch brands:', error);
      throw error;
    }
  }

  // Branch operations
  async getBranches(brandId?: string, forceRefresh: boolean = false): Promise<any[]> {
    const cacheKey = `branches${brandId ? `_${brandId}` : ''}`;

    if (!forceRefresh) {
      const cached = this.getCache<any[]>(cacheKey);
      if (cached) return cached;
    }

    try {
      console.log('🏢 [SERVER] Fetching branches from Directus API...', brandId ? `for brand: ${brandId}` : 'for all brands');
      // Use Directus API instead of mock data
      const { DirectusService } = await import('./directusService');

      const branches = await DirectusService.getBranches(brandId);

      console.log('🏢 [SERVER] Branches fetched from Directus:', branches.length, 'branches');
      console.log('🏢 [SERVER] Branches data:', branches);
      if (brandId) {
        console.log('🏢 [SERVER] Branches for brand', brandId, ':', branches.length, 'branches');
      }
      this.setCache(cacheKey, branches);
      return branches;
    } catch (error) {
      console.error('Failed to fetch branches:', error);
      throw error;
    }
  }

  // Get brand with branches
  async getBrandsWithBranches(forceRefresh: boolean = false): Promise<any[]> {
    const cacheKey = 'brands_with_branches';

    if (!forceRefresh) {
      const cached = this.getCache<any[]>(cacheKey);
      if (cached) return cached;
    }

    try {
      const brands = await this.getBrands(forceRefresh);
      const branches = await this.getBranches(undefined, forceRefresh);

      const brandsWithBranches = brands.map(brand => ({
        ...brand,
        branches: branches.filter(branch => branch.brand_id === brand.id)
      }));

      this.setCache(cacheKey, brandsWithBranches, 10 * 60 * 1000); // 10 minutes
      return brandsWithBranches;
    } catch (error) {
      console.error('Failed to fetch brands with branches:', error);
      throw error;
    }
  }

  // Branch detail
  async getBranch(branchId: string, forceRefresh: boolean = false): Promise<any> {
    const cacheKey = `branch_${branchId}`;

    if (!forceRefresh) {
      const cached = this.getCache<any>(cacheKey);
      if (cached) return cached;
    }

    try {
      // Mock data - replace with actual API call
      const branch = {
        id: branchId,
        name: 'SOL Pizza - District 1',
        address: '123 Nguyễn Huệ Street, District 1, Ho Chi Minh City',
        phone: '+84 28 3821 1234',
        status: 'active',
        tables_count: 24,
        opening_hours: '10:00 - 22:00',
        manager: {
          name: 'John Smith',
          email: 'john.smith@solpizza.com',
          phone: '+84 90 123 4567'
        },
        brand: {
          id: '1',
          name: 'SOL Pizza',
          logo: '/images/brands/sol-pizza.png'
        },
        created_at: '2023-01-15',
        layouts: [
          {
            id: 'layout-1',
            name: 'Main Floor',
            description: 'Primary dining area',
            tables_count: 24
          }
        ],
        menu_items: 85,
        active_menu_items: 78
      };

      this.setCache(cacheKey, branch);
      return branch;
    } catch (error) {
      console.error('Failed to fetch branch:', error);
      throw error;
    }
  }

  // Table layouts
  async getTableLayouts(branchId: string, forceRefresh: boolean = false): Promise<any[]> {
    const cacheKey = `layouts_${branchId}`;

    if (!forceRefresh) {
      const cached = this.getCache<any[]>(cacheKey);
      if (cached) return cached;
    }

    try {
      // Mock data - replace with actual API call
      const layouts = [
        {
          id: 'layout-1',
          name: 'Main Floor',
          description: 'Primary dining area',
          tables_count: 24,
          tables: Array.from({ length: 24 }, (_, i) => ({
            id: `table-${i + 1}`,
            number: i + 1,
            status: ['available', 'occupied', 'reserved'][Math.floor(Math.random() * 3)],
            capacity: [2, 4, 6][Math.floor(Math.random() * 3)],
            position: { x: (i % 6) * 100, y: Math.floor(i / 6) * 80 },
            zone: ['Main', 'VIP', 'Outdoor'][Math.floor(Math.random() * 3)]
          }))
        }
      ];

      this.setCache(cacheKey, layouts, 2 * 60 * 1000); // 2 minutes
      return layouts;
    } catch (error) {
      console.error('Failed to fetch table layouts:', error);
      throw error;
    }
  }

  // Menu items
  async getMenuItems(brandId: string, branchId?: string, forceRefresh: boolean = false): Promise<any[]> {
    const cacheKey = `menu_items_${brandId}${branchId ? `_branch_${branchId}` : ''}`;

    if (!forceRefresh) {
      const cached = this.getCache<any[]>(cacheKey);
      if (cached) return cached;
    }

    try {
      // Mock data - replace with actual API call
      const menuItems = [
        {
          id: '1',
          name: 'Margherita Pizza',
          description: 'Classic Italian pizza with fresh mozzarella, tomatoes, and basil',
          category: 'mains',
          price: 250000,
          image: '/images/menu/margherita.jpg',
          status: 'active',
          is_available_at_branch: true,
          branch_price: 250000,
          dietary_info: ['vegetarian'],
          prep_time: '15-20 min',
          rating: 4.5
        }
      ];

      this.setCache(cacheKey, menuItems, 15 * 60 * 1000); // 15 minutes
      return menuItems;
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
      throw error;
    }
  }

  // Update operations
  async updateBranch(branchId: string, data: Partial<any>): Promise<any> {
    try {
      // Mock API call - replace with actual API call
      console.log('Updating branch:', branchId, data);

      // Clear cache for this branch
      this.clearCache(`branch_${branchId}`);
      this.clearCache('branches');
      this.clearCache('brands_with_branches');

      return { success: true, data };
    } catch (error) {
      console.error('Failed to update branch:', error);
      throw error;
    }
  }

  async updateMenuItemAvailability(
    branchId: string,
    itemId: string,
    isAvailable: boolean
  ): Promise<any> {
    try {
      // Mock API call - replace with actual API call
      console.log('Updating menu item availability:', branchId, itemId, isAvailable);

      // Clear relevant cache
      this.clearCache(`menu_items_`);

      return { success: true };
    } catch (error) {
      console.error('Failed to update menu item availability:', error);
      throw error;
    }
  }
}

// Singleton instance
export const branchService = new BranchService();

// React hooks for using the service

export function useBranches(brandId?: string) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await branchService.getBranches(brandId);
        if (isMounted) setData(result);
      } catch (err) {
        if (isMounted) setError(err as Error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [brandId]);

  return { data, loading, error, refetch: () => branchService.getBranches(brandId, true) };
}

export function useBranch(branchId: string) {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!branchId) return;

    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await branchService.getBranch(branchId);
        if (isMounted) setData(result);
      } catch (err) {
        if (isMounted) setError(err as Error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [branchId]);

  return { data, loading, error, refetch: () => branchService.getBranch(branchId, true) };
}