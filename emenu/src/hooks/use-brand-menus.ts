import { useState, useEffect } from 'react';

// Directus data interfaces
export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  brand_color?: string;
  is_active: boolean;
}

export interface BrandMenu {
  id: string;
  name: string;
  description?: string;
  default_currency: string;
  tax_rate: number;
  service_rate: number;
  is_active: boolean;
  brand: string;
  date_created: string;
  date_updated: string;
  // Computed fields
  brandName?: string;
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

export function useBrandMenus() {
  const [brandMenus, setBrandMenus] = useState<BrandMenu[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrandData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch both brands and brand menus from Directus API
        const [brandsResponse, menusResponse] = await Promise.all([
          fetch('/api/directus/brands'),
          fetch('/api/directus/brand-menus')
        ]);

        if (!brandsResponse.ok || !menusResponse.ok) {
          throw new Error('Failed to fetch brand data');
        }

        const brandsData: Brand[] = await brandsResponse.json();
        const menusData: BrandMenu[] = await menusResponse.json();

        // Transform the data to match our interface
        const transformedMenus = menusData.map(menu => {
          const brand = brandsData.find(b => b.id === menu.brand);
          const itemCount = menu.id ? Math.floor(Math.random() * 50) + 10 : 0; // Temporary count
          const categoryCount = menu.id ? Math.floor(Math.random() * 8) + 2 : 0; // Temporary count

          return {
            ...menu,
            brandName: brand?.name || 'Unknown Brand',
            items: itemCount,
            categories: categoryCount,
            lastUpdated: menu.date_updated ?
              new Date(menu.date_updated).toLocaleDateString() :
              new Date().toLocaleDateString(),
            currency: menu.default_currency || 'VND'
          };
        });

        setBrands(brandsData);
        setBrandMenus(transformedMenus);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load brand data');
        console.error('Error fetching brand data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandData();
  }, []);

  const refetch = () => {
    fetchBrandData();
  };

  const getBrandMenuById = (id: string) => {
    return brandMenus.find(menu => menu.id === id);
  };

  const getBrandById = (id: string) => {
    return brands.find(brand => brand.id === id);
  };

  return {
    brandMenus,
    brands,
    loading,
    error,
    refetch,
    getBrandMenuById,
    getBrandById,
  };
}