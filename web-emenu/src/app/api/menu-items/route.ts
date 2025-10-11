import { NextRequest, NextResponse } from 'next/server';
import { directusClient } from '@/lib/directus';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const active = searchParams.get('active');
    const sort = searchParams.get('sort')?.split(',') || ['name'];

    const filter: Record<string, unknown> = {};
    if (category) {
      filter.category_name = { _eq: category };
    }
    if (search) {
      filter.name = { _icontains: search };
    }
    if (active !== null && active !== undefined) {
      filter.is_active = { _eq: active === 'true' };
    }

    try {
      const result = await directusClient.getItems('menu_items', {
        page,
        limit,
        sort,
        filter,
        fields: [
          'id',
          'name',
          'code',
          'description',
          'price',
          'category_name',
          'category_code',
          'unit_name',
          'is_active',
          'is_available',
          'image_url',
          'track_inventory',
          'allergen_info',
          'dietary_restrictions',
          'preparation_time',
          'spice_level',
          'external_id',
          'sync_status',
          'created_at',
          'updated_at'
        ]
      });

      return NextResponse.json({
        success: true,
        data: result.data,
        meta: result.meta || {}
      });
    } catch (directusError) {
      console.warn('Directus API unavailable, using fallback data:', directusError);

      // Fallback mock data when Directus is not available
      const mockMenuItems = [
        {
          id: 'item-1',
          name: 'Combo A',
          code: 'COMBO_A',
          description: 'Rice + Main Dish + Drink',
          price: 125000,
          category_name: 'Combos',
          category_code: 'COMBO',
          unit_name: 'set',
          is_active: true,
          is_available: true,
          image_url: null,
          track_inventory: false,
          allergen_info: null,
          dietary_restrictions: null,
          preparation_time: 15,
          spice_level: 0,
          external_id: null,
          sync_status: 'fallback',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'item-2',
          name: 'Salmon Sashimi',
          code: 'SASHIMI_SALMON',
          description: 'Fresh salmon sashimi (6 pieces)',
          price: 180000,
          category_name: 'Sushi & Sashimi',
          category_code: 'SUSHI',
          unit_name: 'portion',
          is_active: true,
          is_available: true,
          image_url: null,
          track_inventory: false,
          allergen_info: 'Contains fish',
          dietary_restrictions: null,
          preparation_time: 10,
          spice_level: 0,
          external_id: null,
          sync_status: 'fallback',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'item-3',
          name: 'Pho Bo',
          code: 'PHO_BO',
          description: 'Traditional beef noodle soup',
          price: 95000,
          category_name: 'Main Courses',
          category_code: 'MAIN',
          unit_name: 'bowl',
          is_active: true,
          is_available: true,
          image_url: null,
          track_inventory: false,
          allergen_info: 'Contains gluten, beef',
          dietary_restrictions: null,
          preparation_time: 20,
          spice_level: 1,
          external_id: null,
          sync_status: 'fallback',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'item-4',
          name: 'Vietnamese Iced Coffee',
          code: 'CA_PHE_DA',
          description: 'Traditional Vietnamese iced coffee',
          price: 35000,
          category_name: 'Beverages',
          category_code: 'BEVERAGE',
          unit_name: 'glass',
          is_active: true,
          is_available: true,
          image_url: null,
          track_inventory: false,
          allergen_info: null,
          dietary_restrictions: null,
          preparation_time: 5,
          spice_level: 0,
          external_id: null,
          sync_status: 'fallback',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'item-5',
          name: 'Cheesecake',
          code: 'CHEESECAKE',
          description: 'Classic New York cheesecake',
          price: 55000,
          category_name: 'Desserts',
          category_code: 'DESSERT',
          unit_name: 'slice',
          is_active: true,
          is_available: true,
          image_url: null,
          track_inventory: false,
          allergen_info: 'Contains dairy, gluten',
          dietary_restrictions: 'Vegetarian',
          preparation_time: 5,
          spice_level: 0,
          external_id: null,
          sync_status: 'fallback',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      let filteredItems = mockMenuItems;

      // Apply filters to fallback data
      if (category) {
        filteredItems = filteredItems.filter(item => item.category_name === category);
      }
      if (search) {
        filteredItems = filteredItems.filter(item =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (active !== null && active !== undefined) {
        filteredItems = filteredItems.filter(item => item.is_active === (active === 'true'));
      }

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedItems = filteredItems.slice(startIndex, endIndex);

      return NextResponse.json({
        success: true,
        data: paginatedItems,
        meta: {
          total_count: filteredItems.length,
          page_count: Math.ceil(filteredItems.length / limit),
          current_page: page,
          per_page: limit
        },
        fallback: true
      });
    }
  } catch (error) {
    console.error('Unexpected error in menu items API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch menu items',
        fallback: false
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      code,
      description,
      price,
      category_name,
      category_code,
      unit_name,
      is_active = true,
      is_available = true,
      image_url,
      track_inventory = false,
      allergen_info,
      dietary_restrictions,
      preparation_time,
      spice_level,
      external_source = 'manual'
    } = body;

    if (!name || !code) {
      return NextResponse.json(
        { success: false, error: 'name and code are required' },
        { status: 400 }
      );
    }

    const result = await directusClient.createDirectusItem('menu_items', {
      name,
      code,
      description,
      price,
      category_name,
      category_code,
      unit_name,
      is_active,
      is_available,
      image_url,
      track_inventory,
      allergen_info,
      dietary_restrictions,
      preparation_time,
      spice_level,
      external_source,
      sync_status: 'synced'
    });

    return NextResponse.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error('Failed to create menu item:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create menu item'
      },
      { status: 500 }
    );
  }
}