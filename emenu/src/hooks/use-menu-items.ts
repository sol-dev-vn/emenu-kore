import { useState, useEffect } from 'react';
import { MenuItem as BaseMenuItem, Category } from './use-brand-menus';

export interface MenuItem extends BaseMenuItem {
  currency: string;
  imageUrl?: string;
  images?: string[];
  dietaryInfo?: string[];
  allergenInfo?: string[];
  prepTime?: number;
  spiceLevel?: number;
}

export function useMenuItems(brandMenuId: string | null) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuData = async () => {
      if (!brandMenuId) {
        setMenuItems([]);
        setCategories([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch both menu items and categories from Directus API
        const [itemsResponse, categoriesResponse] = await Promise.all([
          fetch(`/api/directus/menu-items?brand_menu=${brandMenuId}`),
          fetch(`/api/directus/categories?brand_menu=${brandMenuId}`)
        ]);

        if (!itemsResponse.ok || !categoriesResponse.ok) {
          throw new Error('Failed to fetch menu data');
        }

        const itemsData: MenuItem[] = await itemsResponse.json();
        const categoriesData: Category[] = await categoriesResponse.json();

        // Transform menu items to match our interface
        const transformedItems = itemsData.map(item => ({
          ...item,
          currency: 'VND', // This should come from brand menu config
          imageUrl: item.image_url,
          isAvailable: item.is_available,
          dietaryInfo: item.dietary_info ? Object.keys(item.dietary_info) : [],
          allergenInfo: item.allergens ? Object.keys(item.allergens) : [],
          prepTime: item.preparation_time,
          spiceLevel: item.spice_level
        }));

        setMenuItems(transformedItems);
        setCategories(categoriesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load menu data');
        console.error('Error fetching menu data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, [brandMenuId]);

  const refetch = () => {
    fetchMenuData();
  };

  const createMenuItem = async (itemData: Partial<MenuItem>) => {
    try {
      const response = await fetch('/api/directus/menu-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...itemData,
          brand_menu: brandMenuId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create menu item');
      }

      await refetch(); // Refresh the list
      return await response.json();
    } catch (err) {
      console.error('Error creating menu item:', err);
      throw err;
    }
  };

  const updateMenuItem = async (id: number, updates: Partial<MenuItem>) => {
    try {
      const response = await fetch(`/api/directus/menu-items/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update menu item');
      }

      await refetch(); // Refresh the list
      return await response.json();
    } catch (err) {
      console.error('Error updating menu item:', err);
      throw err;
    }
  };

  const deleteMenuItem = async (id: number) => {
    try {
      const response = await fetch(`/api/directus/menu-items/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete menu item');
      }

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
      item.category_name?.toLowerCase().includes(lowercaseQuery)
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