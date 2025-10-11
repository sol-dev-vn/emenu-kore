import { NextRequest, NextResponse } from 'next/server';
import { directusClient } from '@/lib/directus';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await directusClient.getSyncLog(params.id);

    return NextResponse.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error(`Failed to fetch sync log ${params.id}:`, error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch sync log'
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const result = await directusClient.updateSyncLog(params.id, body);

    return NextResponse.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error(`Failed to update sync log ${params.id}:`, error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update sync log'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await directusClient.deleteSyncLog(params.id);

    return NextResponse.json({
      success: true,
      message: 'Sync log deleted successfully'
    });
  } catch (error) {
    console.error(`Failed to delete sync log ${params.id}:`, error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete sync log'
      },
      { status: 500 }
    );
  }
}