import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tableId: string }> }
) {
  try {
    const { tableId } = await params;

    // Mock data for now - in production, this would fetch from Directus
    const mockTables: Record<string, any> = {
      'A01': {
        id: 'table-a01',
        name: 'Table A01',
        code: 'A01',
        capacity: 4,
        zone: 'Main Dining',
        branch_id: 'branch-1',
        status: 'available'
      },
      'A02': {
        id: 'table-a02',
        name: 'Table A02',
        code: 'A02',
        capacity: 4,
        zone: 'Main Dining',
        branch_id: 'branch-1',
        status: 'available'
      },
      'B01': {
        id: 'table-b01',
        name: 'Table B01',
        code: 'B01',
        capacity: 6,
        zone: 'Private Room',
        branch_id: 'branch-1',
        status: 'available'
      },
      'C01': {
        id: 'table-c01',
        name: 'Table C01',
        code: 'C01',
        capacity: 2,
        zone: 'Outdoor',
        branch_id: 'branch-2',
        status: 'available'
      }
    };

    const table = mockTables[tableId.toUpperCase()];

    if (!table) {
      return NextResponse.json(
        { error: 'Table not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: table,
      success: true
    });

  } catch (error) {
    console.error('Error fetching table:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}