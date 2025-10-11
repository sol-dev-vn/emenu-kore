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
  } catch (error) {
    console.error('Failed to fetch menu items:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch menu items'
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