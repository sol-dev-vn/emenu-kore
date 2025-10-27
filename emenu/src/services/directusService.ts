// Directus API integration service
import { createDirectus, rest, readItems, createItem, updateItem, deleteItem } from '@directus/sdk';

// Initialize Directus client
const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://sol-kore.alphabits.team';
const publicToken = process.env.DIRECTUS_PUBLIC_TOKEN;

const directus = createDirectus(directusUrl)
  .with(rest())
  .with(authentication('static', { accessToken: publicToken }));

// Types
export interface Brand {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone?: string;
  status: 'active' | 'inactive' | 'maintenance';
  tables_count: number;
  opening_hours?: string;
  brand_id: string;
  manager?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Layout {
  id: string;
  name: string;
  description?: string;
  branch_id: string;
  tables: Table[];
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Table {
  id: string;
  number: number;
  position: {
    x: number;
    y: number;
  };
  status: 'available' | 'occupied' | 'reserved';
  capacity: number;
  zone?: string;
  layout_id: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image?: string;
  status: 'active' | 'inactive';
  dietary_info: string[];
  prep_time: string;
  rating?: number;
  created_at: string;
  updated_at: string;
}

export interface QRCode {
  id: string;
  table_id: string;
  branch_id: string;
  qr_code_data: string;
  status: 'generated' | 'processing' | 'failed';
  download_url?: string;
  created_at: string;
}

// API Service Class
export class DirectusService {
  // Authentication
  static async login(email: string, password: string) {
    try {
      const result = await directus.login(email, password);
      return result;
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid credentials');
    }
  }

  static async logout() {
    try {
      await directus.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  static async getCurrentUser() {
    try {
      const user = await directus.request(
        readItems('directus_users', {
          me: true,
          fields: ['*', 'role.*']
        })
      );
      return user;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  // Brands
  static async getBrands(): Promise<Brand[]> {
    try {
      const brands = await directus.request(
        readItems('brands', {
          fields: ['*'],
          sort: ['name']
        })
      );
      return brands;
    } catch (error) {
      console.error('Failed to fetch brands:', error);
      throw new Error('Failed to fetch brands');
    }
  }

  static async getBrand(id: string): Promise<Brand> {
    try {
      const brand = await directus.request(
        readItems('brands', {
          filter: { id: { _eq: id } }
        })
      );
      return brand[0];
    } catch (error) {
      console.error('Failed to fetch brand:', error);
      throw new Error('Failed to fetch brand');
    }
  }

  static async createBrand(data: Partial<Brand>): Promise<Brand> {
    try {
      const result = await directus.request(
        createItem('brands', data)
      );
      return result;
    } catch (error) {
      console.error('Failed to create brand:', error);
      throw new Error('Failed to create brand');
    }
  }

  static async updateBrand(id: string, data: Partial<Brand>): Promise<Brand> {
    try {
      const result = await directus.request(
        updateItem('brands', id, data)
      );
      return result;
    } catch (error) {
      console.error('Failed to update brand:', error);
      throw new Error('Failed to update brand');
    }
  }

  // Branches
  static async getBrandsWithBranches(): Promise<Brand[]> {
    try {
      const brands = await directus.request(
        readItems('brands', {
          fields: ['*', { branches: ['*'] }],
          deep: { branches: { _filter: { status: { _eq: 'active' } } } }
        })
      );
      return brands;
    } catch (error) {
      console.error('Failed to fetch brands with branches:', error);
      throw new Error('Failed to fetch brands with branches');
    }
  }

  static async getBranches(brandId?: string): Promise<Branch[]> {
    try {
      const filter = brandId ? { brand_id: { _eq: brandId } } : {};
      const branches = await directus.request(
        readItems('branches', {
          fields: ['*', { brand: ['*'] }],
          filter,
          sort: ['name']
        })
      );
      return branches;
    } catch (error) {
      console.error('Failed to fetch branches:', error);
      throw new Error('Failed to fetch branches');
    }
  }

  static async getBranch(id: string): Promise<Branch> {
    try {
      const branches = await directus.request(
        readItems('branches', {
          fields: ['*', { brand: ['*'] }],
          filter: { id: { _eq: id } }
        })
      );
      return branches[0];
    } catch (error) {
      console.error('Failed to fetch branch:', error);
      throw new Error('Failed to fetch branch');
    }
  }

  static async createBranch(data: Partial<Branch>): Promise<Branch> {
    try {
      const result = await directus.request(
        createItem('branches', data)
      );
      return result;
    } catch (error) {
      console.error('Failed to create branch:', error);
      throw new Error('Failed to create branch');
    }
  }

  static async updateBranch(id: string, data: Partial<Branch>): Promise<Branch> {
    try {
      const result = await directus.request(
        updateItem('branches', id, data)
      );
      return result;
    } catch (error) {
      console.error('Failed to update branch:', error);
      throw new Error('Failed to update branch');
    }
  }

  // Layouts
  static async getLayouts(branchId: string): Promise<Layout[]> {
    try {
      const layouts = await directus.request(
        readItems('layouts', {
          fields: ['*', { tables: ['*'] }],
          filter: { branch_id: { _eq: branchId } },
          sort: ['name']
        })
      );
      return layouts;
    } catch (error) {
      console.error('Failed to fetch layouts:', error);
      throw new Error('Failed to fetch layouts');
    }
  }

  static async getLayout(id: string): Promise<Layout> {
    try {
      const layouts = await directus.request(
        readItems('layouts', {
          fields: ['*', { tables: ['*'] }],
          filter: { id: { _eq: id } }
        })
      );
      return layouts[0];
    } catch (error) {
      console.error('Failed to fetch layout:', error);
      throw new Error('Failed to fetch layout');
    }
  }

  static async createLayout(data: Partial<Layout>): Promise<Layout> {
    try {
      const result = await directus.request(
        createItem('layouts', data)
      );
      return result;
    } catch (error) {
      console.error('Failed to create layout:', error);
      throw new Error('Failed to create layout');
    }
  }

  // Menu Items
  static async getMenuItems(brandId?: string, branchId?: string): Promise<MenuItem[]> {
    try {
      // This would need to be adjusted based on actual data structure
      let filter = {};

      if (brandId) {
        filter = { brand_id: { _eq: brandId } };
      }

      const menuItems = await directus.request(
        readItems('menu_items', {
          fields: ['*'],
          filter,
          sort: ['category', 'name']
        })
      );
      return menuItems;
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
      throw new Error('Failed to fetch menu items');
    }
  }

  static async getMenuItem(id: string): Promise<MenuItem> {
    try {
      const menuItems = await directus.request(
        readItems('menu_items', {
          filter: { id: { _eq: id } }
        })
      );
      return menuItems[0];
    } catch (error) {
      console.error('Failed to fetch menu item:', error);
      throw new Error('Failed to fetch menu item');
    }
  }

  static async createMenuItem(data: Partial<MenuItem>): Promise<MenuItem> {
    try {
      const result = await directus.request(
        createItem('menu_items', data)
      );
      return result;
    } catch (error) {
      console.error('Failed to create menu item:', error);
      throw new Error('Failed to create menu item');
    }
  }

  static async updateMenuItem(id: string, data: Partial<MenuItem>): Promise<MenuItem> {
    try {
      const result = await directus.request(
        updateItem('menu_items', id, data)
      );
      return result;
    } catch (error) {
      console.error('Failed to update menu item:', error);
      throw new Error('Failed to update menu item');
    }
  }

  // QR Codes
  static async getQRCodes(branchId?: string): Promise<QRCode[]> {
    try {
      const filter = branchId ? { branch_id: { _eq: branchId } } : {};
      const qrCodes = await directus.request(
        readItems('qr_codes', {
          fields: ['*'],
          filter,
          sort: ['-created_at']
        })
      );
      return qrCodes;
    } catch (error) {
      console.error('Failed to fetch QR codes:', error);
      throw new Error('Failed to fetch QR codes');
    }
  }

  static async createQRCode(data: Partial<QRCode>): Promise<QRCode> {
    try {
      const result = await directus.request(
        createItem('qr_codes', data)
      );
      return result;
    } catch (error) {
      console.error('Failed to create QR code:', error);
      throw new Error('Failed to create QR code');
    }
  }

  static async deleteQRCode(id: string): Promise<void> {
    try {
      await directus.request(
        deleteItem('qr_codes', id)
      );
    } catch (error) {
      console.error('Failed to delete QR code:', error);
      throw new Error('Failed to delete QR code');
    }
  }

  // Statistics and Analytics
  static async getDashboardStats() {
    try {
      const [brandsCount, branchesCount, menuItemsCount] = await Promise.all([
        directus.request(readItems('brands', { aggregate: { count: '*' } })),
        directus.request(readItems('branches', { aggregate: { count: '*' } })),
        directus.request(readItems('menu_items', { aggregate: { count: '*' } }))
      ]);

      return {
        brands: brandsCount[0]?.count || 0,
        branches: branchesCount[0]?.count || 0,
        menuItems: menuItemsCount[0]?.count || 0
      };
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      throw new Error('Failed to fetch dashboard stats');
    }
  }

  // Helper method to set authentication token
  static setAuthToken(token: string) {
    directus.setToken(token);
  }

  // Helper method to check if user is authenticated
  static isAuthenticated(): boolean {
    return !!directus.getToken();
  }
}

export default DirectusService;