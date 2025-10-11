import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ branchId: string }> }
) {
  try {
    const { branchId } = await params;

    // Mock data for now - in production, this would fetch from Directus
    const mockBranches: Record<string, any> = {
      'branch-1': {
        id: 'branch-1',
        name: 'SOL Restaurant - District 1',
        code: 'SOL-D1',
        address: '123 Nguyen Hue Street, District 1',
        phone: '+84 28 1234 5678',
        hours: '10:00 AM - 10:00 PM',
        currency: 'VND',
        timezone: 'Asia/Ho_Chi_Minh'
      },
      'branch-2': {
        id: 'branch-2',
        name: 'SOL Restaurant - District 3',
        code: 'SOL-D3',
        address: '456 Vo Van Tan Street, District 3',
        phone: '+84 28 8765 4321',
        hours: '10:00 AM - 10:00 PM',
        currency: 'VND',
        timezone: 'Asia/Ho_Chi_Minh'
      }
    };

    const branch = mockBranches[branchId];

    if (!branch) {
      return NextResponse.json(
        { error: 'Branch not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: branch,
      success: true
    });

  } catch (error) {
    console.error('Error fetching branch:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}