import { NextRequest, NextResponse } from 'next/server';
import { directusClient } from '@/lib/directus';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const zone = searchParams.get('zone');
    const active = searchParams.get('active');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort')?.split(',') || ['zone_name', 'name'];

    const filter: Record<string, unknown> = {};
    if (zone) {
      filter.zone_name = { _eq: zone };
    }
    if (search) {
      filter.name = { _icontains: search };
    }
    if (active !== null && active !== undefined) {
      filter.is_active = { _eq: active === 'true' };
    }

    const result = await directusClient.getItems('tables', {
      page,
      limit,
      sort,
      filter,
      fields: [
        'id',
        'name',
        'code',
        'description',
        'zone_id',
        'zone_name',
        'capacity',
        'table_type',
        'shape',
        'position_x',
        'position_y',
        'width',
        'height',
        'rotation',
        'is_mergeable',
        'is_reserved',
        'is_available',
        'is_active',
        'branch_id',
        'external_id',
        'external_source',
        'sync_status',
        'created_at',
        'updated_at'
      ]
    });

    // Get unique zones for filtering
    const zonesResult = await directusClient.getItems('tables', {
      fields: ['zone_name'],
      filter: { zone_name: { _nnull: true } },
      groupBy: ['zone_name']
    });

    const zones = zonesResult.data?.map((z: any) => z.zone_name).filter(Boolean) || [];

    return NextResponse.json({
      success: true,
      data: result.data,
      zones,
      meta: result.meta || {}
    });
  } catch (error) {
    console.error('Failed to fetch tables:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch tables'
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
      zone_id,
      zone_name,
      capacity,
      table_type = 'standard',
      shape = 'rectangle',
      position_x = 0,
      position_y = 0,
      width = 100,
      height = 100,
      rotation = 0,
      is_mergeable = false,
      is_reserved = false,
      is_available = true,
      is_active = true,
      branch_id,
      external_source = 'manual'
    } = body;

    if (!name || !code) {
      return NextResponse.json(
        { success: false, error: 'name and code are required' },
        { status: 400 }
      );
    }

    const result = await directusClient.createDirectusItem('tables', {
      name,
      code,
      description,
      zone_id,
      zone_name,
      capacity,
      table_type,
      shape,
      position_x,
      position_y,
      width,
      height,
      rotation,
      is_mergeable,
      is_reserved,
      is_available,
      is_active,
      branch_id,
      external_source,
      sync_status: 'synced'
    });

    return NextResponse.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error('Failed to create table:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create table'
      },
      { status: 500 }
    );
  }
}