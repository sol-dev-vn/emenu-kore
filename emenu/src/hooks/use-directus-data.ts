import { useState, useEffect } from 'react';
import { useDirectus } from '@/lib/directus/directus';

// Directus data interfaces
export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  brand_color?: string;
  is_active: boolean;
  sort: number;
}

export interface BrandMenu {
  id: string;
  name: string;
  description?: string;
  default_currency: string;
  tax_rate: number;
  service_rate: number;
  is_active: boolean;
  sort: number;
  brand: string;
  date_created: string;
  date_updated: string;
  // Related data
  brandName?: string;
  brandColor?: string;
  items?: number;
  categories?: number;
  lastUpdated?: string;
}

export interface MenuItem {
  id: number;
  name: string;
  code: string;
  description?: string;
  price: number;
  category_name?: string;
  category_code?: string;
  is_active: boolean;
  is_available: boolean;
  image_url?: string;
  thumbnail?: string;
  sort: number;
  brand_menu?: string;
  category_id?: number;
  preparation_time?: number;
  spice_level?: number;
  dietary_info?: string[];
  allergen_info?: string[];
}

export interface Category {
  id: number;
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
  sort: number;
  brand_menu?: string;
  color?: string;
}

export function useDirectusBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { directus, readItems, createItem, updateItem, deleteItem } = useDirectus();

  useEffect(() => {
    const fetchBrands = async () => {
      if (!directus) return;

      setLoading(true);
      setError(null);

      try {
        const response = await directus.request(
          readItems('brands', {
            fields: ['id', 'name', 'slug', 'description', 'logo', 'brand_color', 'is_active', 'sort'],
            filter: {
              is_active: { _eq: true }
            },
            sort: ['sort']
          })
        );

        setBrands(response || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load brands');
        console.error('Error fetching brands:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [directus]);

  const refetch = () => {
    fetchBrands();
  };

  return {
    brands,
    loading,
    error,
    refetch,
  };
}

export function useDirectusBrandMenus() {
  const [brandMenus, setBrandMenus] = useState<BrandMenu[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { directus, readItems, createItem, updateItem, deleteItem } = useDirectus();

  useEffect(() => {
    const fetchBrandMenus = async () => {
      if (!directus) return;

      setLoading(true);
      setError(null);

      try {
        const response = await directus.request(
          readItems('brand_menus', {
            fields: [
              'id',
              'name',
              'description',
              'default_currency',
              'tax_rate',
              'service_rate',
              'is_active',
              'sort',
              'date_created',
              'date_updated',
              'brand.id',
              'brand.name',
              'brand.brand_color'
            ],
            filter: {
              is_active: { _eq: true }
            },
            sort: ['sort']
          })
        );

        // Transform the data to include computed fields
        const transformedMenus = response?.map((menu: any) => ({
          id: menu.id,
          name: menu.name,
          description: menu.description,
          default_currency: menu.default_currency,
          tax_rate: menu.tax_rate,
          service_rate: menu.service_rate,
          is_active: menu.is_active,
          sort: menu.sort,
          date_created: menu.date_created,
          date_updated: menu.date_updated,
          brand: menu.brand?.id,
          brandName: menu.brand?.name,
          brandColor: menu.brand?.brand_color,
          lastUpdated: menu.date_updated ?
            new Date(menu.date_updated).toLocaleDateString() :
            new Date().toLocaleDateString()
        })) || [];

        setBrandMenus(transformedMenus);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load brand menus');
        console.error('Error fetching brand menus:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandMenus();
  }, [directus]);

  const refetch = () => {
    fetchBrandMenus();
  };

  return {
    brandMenus,
    loading,
    error,
    refetch,
  };
}

export function useDirectusMenuItems(brandMenuId: string | null) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { directus, readItems, createItem, updateItem, deleteItem } = useDirectus();

  useEffect(() => {
    const fetchMenuData = async () => {
      if (!directus || !brandMenuId) {
        setMenuItems([]);
        setCategories([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch both menu items and categories in parallel
        const [itemsResponse, categoriesResponse] = await Promise.all([
          directus.request(
            readItems('menu_items', {
              fields: [
                'id',
                'name',
                'code',
                'description',
                'price',
                'is_active',
                'is_available',
                'sort',
                'preparation_time',
                'spice_level',
                'image_url',
                'category_name',
                'category_code',
                'brand_menu',
                'category_id.id',
                'category_id.name',
                'category_id.code',
                'thumbnail.id',
                'thumbnail.filename_download',
                'dietary_info',
                'allergens'
              ],
              filter: {
                brand_menu: { _eq: brandMenuId },
                is_active: { _eq: true }
              },
              sort: ['category_id.sort', 'sort']
            })
          ),
          directus.request(
            readItems('categories', {
              fields: [
                'id',
                'name',
                'code',
                'description',
                'is_active',
                'sort',
                'color',
                'brand_menu'
              ],
              filter: {
                brand_menu: { _eq: brandMenuId },
                is_active: { _eq: true }
              },
              sort: ['sort']
            })
          )
        ]);

        // Transform menu items
        const transformedItems = itemsResponse.data?.map((item: any) => ({
          id: item.id,
          name: item.name,
          code: item.code,
          description: item.description,
          price: item.price,
          category_name: item.category_id?.name || item.category_name,
          category_code: item.category_id?.code || item.category_code,
          is_active: item.is_active,
          is_available: item.is_available,
          image_url: item.thumbnail?.filename_download || item.image_url,
          sort: item.sort,
          brand_menu: item.brand_menu,
          category_id: item.category_id?.id,
          preparation_time: item.preparation_time,
          spice_level: item.spice_level,
          dietary_info: item.dietary_info || [],
          allergen_info: item.allergens ? Object.keys(item.allergens) : []
        })) || [];

        // Transform categories
        const transformedCategories = categoriesResponse.data?.map((category: any) => ({
          id: category.id,
          name: category.name,
          code: category.code,
          description: category.description,
          is_active: category.is_active,
          sort: category.sort,
          color: category.color || '#9B1D20',
          brand_menu: category.brand_menu
        })) || [];

        setMenuItems(transformedItems);
        setCategories(transformedCategories);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load menu data');
        console.error('Error fetching menu data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, [directus, brandMenuId]);

  const refetch = () => {
    fetchMenuData();
  };

  const createMenuItem = async (itemData: Partial<MenuItem>) => {
    if (!directus) throw new Error('Directus client not available');

    try {
      const response = await directus.request(
        createItem('menu_items', {
          ...itemData,
          brand_menu: brandMenuId,
        })
      );

      await refetch(); // Refresh the list
      return response;
    } catch (err) {
      console.error('Error creating menu item:', err);
      throw err;
    }
  };

  const updateMenuItem = async (id: number, updates: Partial<MenuItem>) => {
    if (!directus) throw new Error('Directus client not available');

    try {
      const response = await directus.request(
        updateItem('menu_items', id, updates)
      );
      await refetch(); // Refresh the list
      return response;
    } catch (err) {
      console.error('Error updating menu item:', err);
      throw err;
    }
  };

  const deleteMenuItem = async (id: number) => {
    if (!directus) throw new Error('Directus client not available');

    try {
      await directus.request(
        deleteItem('menu_items', id)
      );
      await refetch(); // Refresh the list
    } catch (err) {
      console.error('Error deleting menu item:', err);
      throw err;
    }
  };

  const getItemsByCategory = (categoryId?: number) => {
    if (!categoryId) return menuItems;
    return menuItems.filter(item => item.category_id === categoryId);
  };

  const searchItems = (query: string) => {
    if (!query) return menuItems;
    const lowercaseQuery = query.toLowerCase();
    return menuItems.filter(item =>
      item.name.toLowerCase().includes(lowercaseQuery) ||
      item.description?.toLowerCase().includes(lowercaseQuery) ||
      item.category_name?.toLowerCase().includes(lowercaseQuery) ||
      item.code.toLowerCase().includes(lowercaseQuery)
    );
  };

  return {
    menuItems,
    categories,
    loading,
    error,
    refetch,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getItemsByCategory,
    searchItems,
  };
}