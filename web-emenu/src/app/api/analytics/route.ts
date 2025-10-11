import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d'; // 7d, 30d, 90d, 1y
    const branchId = searchParams.get('branchId'); // Optional branch filter

    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // For now, return mock analytics data
    // In a real implementation, you would query Directus/your database
    const mockAnalytics = {
      overview: {
        totalRevenue: 12450,
        totalOrders: 324,
        activeCustomers: 1248,
        avgOrderValue: 38.40,
        revenueChange: 12,
        ordersChange: 8,
        customersChange: 15,
        avgOrderChange: 3
      },
      salesData: [
        { date: '2024-01-15', revenue: 1850, orders: 45, customers: 128 },
        { date: '2024-01-14', revenue: 2100, orders: 52, customers: 145 },
        { date: '2024-01-13', revenue: 1950, orders: 48, customers: 134 },
        { date: '2024-01-12', revenue: 1750, orders: 42, customers: 118 },
        { date: '2024-01-11', revenue: 2200, orders: 58, customers: 165 },
        { date: '2024-01-10', revenue: 1650, orders: 38, customers: 105 },
        { date: '2024-01-09', revenue: 1950, orders: 41, customers: 153 }
      ],
      topProducts: [
        { name: 'Salmon Sashimi', category: 'Sushi', orders: 45, revenue: 1125, percentage: 18.5 },
        { name: 'Tonkotsu Ramen', category: 'Ramen', orders: 38, revenue: 912, percentage: 15.6 },
        { name: 'California Roll', category: 'Sushi', orders: 32, revenue: 640, percentage: 13.1 },
        { name: 'Chicken Teriyaki', category: 'Main Course', orders: 28, revenue: 840, percentage: 11.5 },
        { name: 'Vietnamese Coffee', category: 'Drinks', orders: 25, revenue: 125, percentage: 10.2 }
      ],
      categoryPerformance: [
        { name: 'Sushi & Sashimi', orders: 125, revenue: 3500, percentage: 35.2 },
        { name: 'Ramen & Noodles', orders: 98, revenue: 2450, percentage: 24.6 },
        { name: 'Main Courses', orders: 67, revenue: 2150, percentage: 21.6 },
        { name: 'Drinks', orders: 145, revenue: 1080, percentage: 10.8 },
        { name: 'Appetizers', orders: 34, revenue: 780, percentage: 7.8 }
      ],
      peakHours: [
        { hour: '11:00', orders: 15, revenue: 580 },
        { hour: '12:00', orders: 68, revenue: 2450 },
        { hour: '13:00', orders: 45, revenue: 1680 },
        { hour: '18:00', orders: 28, revenue: 980 },
        { hour: '19:00', orders: 85, revenue: 3150 },
        { hour: '20:00', orders: 63, revenue: 2240 },
        { hour: '21:00', orders: 20, revenue: 720 }
      ],
      tablePerformance: [
        { tableId: 'T01', totalOrders: 45, revenue: 1850, occupancyRate: 78.5, avgTurnover: 45 },
        { tableId: 'T02', totalOrders: 42, revenue: 1680, occupancyRate: 75.2, avgTurnover: 48 },
        { tableId: 'T05', totalOrders: 38, revenue: 1520, occupancyRate: 82.1, avgTurnover: 42 },
        { tableId: 'T08', totalOrders: 35, revenue: 1420, occupancyRate: 68.9, avgTurnover: 50 },
        { tableId: 'T03', totalOrders: 33, revenue: 1280, occupancyRate: 71.3, avgTurnover: 46 }
      ]
    };

    return NextResponse.json({
      success: true,
      data: mockAnalytics,
      period,
      dateRange: {
        start: startDate.toISOString().split('T')[0],
        end: now.toISOString().split('T')[0]
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}