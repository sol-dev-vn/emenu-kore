import { NextRequest, NextResponse } from 'next/server';
import { directusClient } from '@/lib/directus';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const orderType = searchParams.get('orderType');
    const paymentStatus = searchParams.get('paymentStatus');
    const search = searchParams.get('search');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const sort = searchParams.get('sort')?.split(',') || ['-date_created', 'order_number'];

    const filter: Record<string, unknown> = {};
    if (status) {
      filter.status = { _eq: status };
    }
    if (priority) {
      filter.priority = { _eq: priority };
    }
    if (orderType) {
      filter.order_type = { _eq: orderType };
    }
    if (paymentStatus) {
      filter.payment_status = { _eq: paymentStatus };
    }
    if (search) {
      filter._or = [
        { order_number: { _icontains: search } },
        { customer_name: { _icontains: search } },
        { customer_phone: { _icontains: search } },
        { table_name: { _icontains: search } }
      ];
    }
    if (dateFrom || dateTo) {
      filter.date_created = {};
      if (dateFrom) {
        filter.date_created._gte = dateFrom;
      }
      if (dateTo) {
        filter.date_created._lte = dateTo;
      }
    }

    const result = await directusClient.getItems('orders', {
      page,
      limit,
      sort,
      filter,
      fields: [
        'id',
        'order_number',
        'table_id',
        'table_name',
        'zone_name',
        'customer_name',
        'customer_phone',
        'customer_email',
        'status',
        'priority',
        'order_type',
        'subtotal',
        'tax_amount',
        'discount_amount',
        'service_charge',
        'total_amount',
        'payment_method',
        'payment_status',
        'notes',
        'special_requests',
        'order_items',
        'branch_id',
        'staff_id',
        'external_source',
        'external_id',
        'estimated_time',
        'actual_time',
        'date_created',
        'date_updated'
      ]
    });

    return NextResponse.json({
      success: true,
      data: result.data,
      meta: result.meta || {}
    });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch orders'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      order_number,
      table_id,
      table_name,
      zone_name,
      customer_name,
      customer_phone,
      customer_email,
      status = 'pending',
      priority = 'normal',
      order_type = 'dine_in',
      subtotal = 0,
      tax_amount = 0,
      discount_amount = 0,
      service_charge = 0,
      total_amount = 0,
      payment_method,
      payment_status = 'pending',
      notes,
      special_requests,
      order_items,
      branch_id,
      staff_id,
      external_source = 'manual',
      external_id,
      estimated_time,
      actual_time
    } = body;

    if (!order_number || !table_id || !order_items) {
      return NextResponse.json(
        {
          success: false,
          error: 'order_number, table_id, and order_items are required'
        },
        { status: 400 }
      );
    }

    const result = await directusClient.createDirectusItem('orders', {
      order_number,
      table_id,
      table_name,
      zone_name,
      customer_name,
      customer_phone,
      customer_email,
      status,
      priority,
      order_type,
      subtotal,
      tax_amount,
      discount_amount,
      service_charge,
      total_amount,
      payment_method,
      payment_status,
      notes,
      special_requests,
      order_items,
      branch_id,
      staff_id,
      external_source,
      external_id,
      estimated_time,
      actual_time
    });

    return NextResponse.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create order'
      },
      { status: 500 }
    );
  }
}