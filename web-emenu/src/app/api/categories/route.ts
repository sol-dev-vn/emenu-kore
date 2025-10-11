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
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch categories'
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