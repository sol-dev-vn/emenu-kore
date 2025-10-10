// API Health Check Route
// Checks the health of Directus API connection

import { NextRequest, NextResponse } from 'next/server';
import { directusClient } from '@/lib/directus';

export async function GET() {
  try {
    // Check Directus API health
    const healthStatus = await directusClient.healthCheck();

    // Get additional server info if available
    let serverInfo = null;
    try {
      serverInfo = await directusClient.getServerInfo();
    } catch (error) {
      // Server info is optional, don't fail if it's not available
      console.warn('Could not fetch server info:', error);
    }

    return NextResponse.json({
      status: healthStatus.status,
      message: healthStatus.message,
      timestamp: new Date().toISOString(),
      directus_url: process.env.NEXT_PUBLIC_DIRECTUS_URL || process.env.DIRECTUS_URL,
      server_info: serverInfo ? {
        available: true,
        data: serverInfo
      } : null,
      app_version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
    });

  } catch (error) {
    console.error('Health check failed:', error);

    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown health check error',
      timestamp: new Date().toISOString(),
      directus_url: process.env.NEXT_PUBLIC_DIRECTUS_URL || process.env.DIRECTUS_URL,
      app_version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
    }, { status: 500 });
  }
}

// Optional: Handle POST requests for more detailed health checks
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { detailed = false } = body;

    if (detailed) {
      // Perform more detailed health checks
      const results = await Promise.allSettled([
        directusClient.healthCheck(),
        directusClient.getServerInfo(),
        // Add more health checks here if needed
      ]);

      const [healthResult, serverResult] = results;

      return NextResponse.json({
        status: healthResult.status === 'fulfilled' ? healthResult.value.status : 'error',
        checks: {
          directus_api: healthResult.status === 'fulfilled' ? 'pass' : 'fail',
          server_info: serverResult.status === 'fulfilled' ? 'pass' : 'fail'
        },
        details: {
          health: healthResult.status === 'fulfilled' ? healthResult.value : null,
          server: serverResult.status === 'fulfilled' ? serverResult.value : null
        },
        timestamp: new Date().toISOString(),
        directus_url: process.env.NEXT_PUBLIC_DIRECTUS_URL || process.env.DIRECTUS_URL,
        app_version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
      });
    } else {
      // Simple health check (same as GET)
      return await GET();
    }

  } catch (error) {
    console.error('Detailed health check failed:', error);

    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown health check error',
      timestamp: new Date().toISOString(),
      directus_url: process.env.NEXT_PUBLIC_DIRECTUS_URL || process.env.DIRECTUS_URL,
      app_version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
    }, { status: 500 });
  }
}