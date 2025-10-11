import { NextRequest, NextResponse } from 'next/server';
import { directusClient } from '@/lib/directus';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const active = searchParams.get('active');
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort')?.split(',') || ['-start_date', 'name'];

    const filter: Record<string, unknown> = {};
    if (active !== null && active !== undefined) {
      filter.is_active = { _eq: active === 'true' };
    }
    if (type) {
      filter.type = { _eq: type };
    }
    if (search) {
      filter._or = [
        { name: { _icontains: search } },
        { code: { _icontains: search } },
        { description: { _icontains: search } }
      ];
    }

    const result = await directusClient.getItems('promotions', {
      page,
      limit,
      sort,
      filter,
      fields: [
        'id',
        'name',
        'code',
        'description',
        'type',
        'discount_value',
        'minimum_amount',
        'start_date',
        'end_date',
        'is_active',
        'applicable_items',
        'applicable_categories',
        'usage_limit',
        'usage_count',
        'image_url',
        'branch_id',
        'external_source',
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
    console.error('Failed to fetch promotions:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch promotions'
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
      type = 'percentage',
      discount_value,
      minimum_amount,
      start_date,
      end_date,
      is_active = true,
      applicable_items,
      applicable_categories,
      usage_limit,
      image_url,
      branch_id,
      external_source = 'manual'
    } = body;

    if (!name || !code || !discount_value || !start_date || !end_date) {
      return NextResponse.json(
        {
          success: false,
          error: 'name, code, discount_value, start_date, and end_date are required'
        },
        { status: 400 }
      );
    }

    const result = await directusClient.createDirectusItem('promotions', {
      name,
      code,
      description,
      type,
      discount_value,
      minimum_amount,
      start_date,
      end_date,
      is_active,
      applicable_items,
      applicable_categories,
      usage_limit,
      image_url,
      branch_id,
      external_source,
      sync_status: 'synced'
    });

    return NextResponse.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error('Failed to create promotion:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create promotion'
      },
      { status: 500 }
    );
  }
}