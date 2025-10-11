import { NextRequest, NextResponse } from 'next/server';
import { directusClient } from '@/lib/directus';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const active = searchParams.get('active');
    const sort = searchParams.get('sort')?.split(',') || ['name'];

    const filter: Record<string, unknown> = {};
    if (active !== null && active !== undefined) {
      filter.is_active = { _eq: active === 'true' };
    }

    try {
      const result = await directusClient.getItems('categories', {
        sort,
        filter,
        fields: [
          'id',
          'name',
          'code',
          'description',
          'is_active',
          'external_id',
          'external_source',
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
      const mockCategories = [
        {
          id: 'cat-1',
          name: 'Combos',
          code: 'COMBO',
          description: 'Value meal combinations',
          is_active: true,
          external_id: null,
          external_source: 'fallback',
          sync_status: 'fallback',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'cat-2',
          name: 'Sushi & Sashimi',
          code: 'SUSHI',
          description: 'Fresh Japanese cuisine',
          is_active: true,
          external_id: null,
          external_source: 'fallback',
          sync_status: 'fallback',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'cat-3',
          name: 'Main Courses',
          code: 'MAIN',
          description: 'Hearty main dishes',
          is_active: true,
          external_id: null,
          external_source: 'fallback',
          sync_status: 'fallback',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'cat-4',
          name: 'Beverages',
          code: 'BEVERAGE',
          description: 'Drinks and refreshments',
          is_active: true,
          external_id: null,
          external_source: 'fallback',
          sync_status: 'fallback',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'cat-5',
          name: 'Desserts',
          code: 'DESSERT',
          description: 'Sweet treats',
          is_active: true,
          external_id: null,
          external_source: 'fallback',
          sync_status: 'fallback',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      const filteredCategories = mockCategories.filter(cat =>
        active === null || active === undefined || cat.is_active === (active === 'true')
      );

      return NextResponse.json({
        success: true,
        data: filteredCategories,
        meta: { total_count: filteredCategories.length },
        fallback: true
      });
    }
  } catch (error) {
    console.error('Unexpected error in categories API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch categories',
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
      is_active = true,
      external_source = 'manual'
    } = body;

    if (!name || !code) {
      return NextResponse.json(
        { success: false, error: 'name and code are required' },
        { status: 400 }
      );
    }

    const result = await directusClient.createDirectusItem('categories', {
      name,
      code,
      description,
      is_active,
      external_source,
      sync_status: 'synced'
    });

    return NextResponse.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error('Failed to create category:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create category'
      },
      { status: 500 }
    );
  }
}