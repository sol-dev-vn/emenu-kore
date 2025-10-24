import { useState, useEffect } from 'react';

export interface MenuCategory {
  id: number;
  name: string;
  description?: string;
  itemCount: number;
  color?: string;
  sort?: number;
  createdAt: string;
  updatedAt: string;
}

export function useMenuCategories() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);

      try {
        // TODO: Replace with actual Directus API call
        const response = await fetch('/api/directus/menu-categories');

        if (!response.ok) {
          throw new Error('Failed to fetch menu categories');
        }

        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load menu categories');
        console.error('Error fetching menu categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const refetch = () => {
    fetchCategories();
  };

  return {
    categories,
    loading,
    error,
    refetch,
  };
}