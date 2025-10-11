import { NextRequest, NextResponse } from 'next/server';
import { directusClient } from '@/lib/directus';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const syncType = searchParams.get('sync_type');
    const sort = searchParams.get('sort')?.split(',') || ['-date_created'];

    const filter: Record<string, unknown> = {};
    if (status) {
      filter.status = { _eq: status };
    }
    if (syncType) {
      filter.sync_type = { _eq: syncType };
    }

    const result = await directusClient.getSyncLogs({
      page,
      limit,
      sort,
      filter,
      fields: [
        'id',
        'sync_type',
        'status',
        'records_processed',
        'records_created',
        'records_updated',
        'records_failed',
        'duration_seconds',
        'last_error_message',
        'date_created',
        'completed_at',
        'performance_metrics'
      ]
    });

    return NextResponse.json({
      success: true,
      data: result.data,
      meta: result.meta
    });
  } catch (error) {
    console.error('Failed to fetch sync logs:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch sync logs'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sync_type,
      status = 'pending',
      records_processed,
      records_created,
      records_updated,
      records_failed,
      duration_seconds,
      last_error_message,
      performance_metrics,
      session_log,
      log_file_path
    } = body;

    if (!sync_type) {
      return NextResponse.json(
        { success: false, error: 'sync_type is required' },
        { status: 400 }
      );
    }

    const result = await directusClient.createSyncLog({
      sync_type,
      status,
      records_processed,
      records_created,
      records_updated,
      records_failed,
      duration_seconds,
      last_error_message,
      performance_metrics,
      session_log,
      log_file_path
    });

    return NextResponse.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error('Failed to create sync log:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create sync log'
      },
      { status: 500 }
    );
  }
}