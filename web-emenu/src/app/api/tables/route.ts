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

    try {
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
    } catch (directusError) {
      console.warn('Directus API unavailable, using fallback data:', directusError);

      // Fallback mock data when Directus is not available
      const mockTables = [
        {
          id: 'table-a01',
          name: 'Table A01',
          code: 'A01',
          description: 'Window table for 2-4 people',
          zone_id: 'zone-a',
          zone_name: 'Main Dining',
          capacity: 4,
          table_type: 'standard',
          shape: 'rectangle',
          position_x: 100,
          position_y: 100,
          width: 120,
          height: 80,
          rotation: 0,
          is_mergeable: false,
          is_reserved: false,
          is_available: true,
          is_active: true,
          branch_id: 'branch-1',
          external_id: null,
          external_source: 'fallback',
          sync_status: 'fallback',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'table-a02',
          name: 'Table A02',
          code: 'A02',
          description: 'Center table for 4 people',
          zone_id: 'zone-a',
          zone_name: 'Main Dining',
          capacity: 4,
          table_type: 'standard',
          shape: 'square',
          position_x: 300,
          position_y: 100,
          width: 100,
          height: 100,
          rotation: 0,
          is_mergeable: false,
          is_reserved: false,
          is_available: true,
          is_active: true,
          branch_id: 'branch-1',
          external_id: null,
          external_source: 'fallback',
          sync_status: 'fallback',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'table-b01',
          name: 'Table B01',
          code: 'B01',
          description: 'Private room table for 6 people',
          zone_id: 'zone-b',
          zone_name: 'Private Room',
          capacity: 6,
          table_type: 'large',
          shape: 'rectangle',
          position_x: 100,
          position_y: 300,
          width: 140,
          height: 90,
          rotation: 0,
          is_mergeable: false,
          is_reserved: false,
          is_available: true,
          is_active: true,
          branch_id: 'branch-1',
          external_id: null,
          external_source: 'fallback',
          sync_status: 'fallback',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'table-c01',
          name: 'Table C01',
          code: 'C01',
          description: 'Outdoor table for 2 people',
          zone_id: 'zone-c',
          zone_name: 'Outdoor',
          capacity: 2,
          table_type: 'small',
          shape: 'circle',
          position_x: 100,
          position_y: 500,
          width: 80,
          height: 80,
          rotation: 0,
          is_mergeable: false,
          is_reserved: false,
          is_available: true,
          is_active: true,
          branch_id: 'branch-2',
          external_id: null,
          external_source: 'fallback',
          sync_status: 'fallback',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'table-c02',
          name: 'Table C02',
          code: 'C02',
          description: 'Outdoor table for 4 people',
          zone_id: 'zone-c',
          zone_name: 'Outdoor',
          capacity: 4,
          table_type: 'standard',
          shape: 'rectangle',
          position_x: 250,
          position_y: 500,
          width: 120,
          height: 80,
          rotation: 0,
          is_mergeable: false,
          is_reserved: false,
          is_available: true,
          is_active: true,
          branch_id: 'branch-2',
          external_id: null,
          external_source: 'fallback',
          sync_status: 'fallback',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      let filteredTables = mockTables;

      // Apply filters to fallback data
      if (zone) {
        filteredTables = filteredTables.filter(table => table.zone_name === zone);
      }
      if (search) {
        filteredTables = filteredTables.filter(table =>
          table.name.toLowerCase().includes(search.toLowerCase()) ||
          table.code.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (active !== null && active !== undefined) {
        filteredTables = filteredTables.filter(table => table.is_active === (active === 'true'));
      }

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedTables = filteredTables.slice(startIndex, endIndex);

      // Extract unique zones from filtered data
      const zones = [...new Set(mockTables.map(table => table.zone_name))];

      return NextResponse.json({
        success: true,
        data: paginatedTables,
        zones,
        meta: {
          total_count: filteredTables.length,
          page_count: Math.ceil(filteredTables.length / limit),
          current_page: page,
          per_page: limit
        },
        fallback: true
      });
    }
  } catch (error) {
    console.error('Unexpected error in tables API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch tables',
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