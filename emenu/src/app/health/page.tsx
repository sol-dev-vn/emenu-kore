import { ReactNode } from 'react';
import { Metadata } from 'next';
import HealthStatusClient from '../health/HealthStatusClient';

export const metadata: Metadata = {
  title: 'System Health Status',
  description: 'System health and operational status',
};

interface HealthCheck {
  name: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime?: number;
  lastChecked: Date;
  details?: string;
}

async function getHealthChecks(): Promise<HealthCheck[]> {
  const checks: HealthCheck[] = [];

  // Directus API health check (includes database connectivity)
  const apiStartTime = Date.now();
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/users/me`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${process.env.DIRECTUS_TOKEN || ''}`
      }
    });
    const apiResponseTime = Date.now() - apiStartTime;

    checks.push({
      name: 'Directus API',
      status: response.ok ? 'healthy' : 'unhealthy',
      responseTime: apiResponseTime,
      lastChecked: new Date(),
      details: response.ok ? 'API and database responding normally' : 'API or database connection failed'
    });
  } catch (error) {
    checks.push({
      name: 'Directus API',
      status: 'unhealthy',
      responseTime: Date.now() - apiStartTime,
      lastChecked: new Date(),
      details: 'API unreachable - check database connection'
    });
  }

  // Web service check
  const webStartTime = Date.now();
  checks.push({
    name: 'Web Service',
    status: 'healthy',
    responseTime: Date.now() - webStartTime,
    lastChecked: new Date(),
    details: 'Next.js application running'
  });

  // Environment check
  checks.push({
    name: 'Environment',
    status: 'healthy',
    lastChecked: new Date(),
    details: `Running in ${process.env.NODE_ENV || 'unknown'} mode`
  });

  return checks;
}

export default async function HealthPage() {
  const healthChecks = await getHealthChecks();
  const overallStatus = healthChecks.some(check => check.status === 'unhealthy')
    ? 'unhealthy'
    : healthChecks.some(check => check.status === 'degraded')
    ? 'degraded'
    : 'healthy';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              System Health Status
            </h1>
            <p className="text-lg text-gray-600">
              Real-time monitoring of system components and services
            </p>
          </div>

          {/* Overall Status */}
          <div className={`rounded-lg p-6 mb-8 ${
            overallStatus === 'healthy' ? 'bg-green-50 border border-green-200' :
            overallStatus === 'degraded' ? 'bg-yellow-50 border border-yellow-200' :
            'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${
                  overallStatus === 'healthy' ? 'bg-green-500' :
                  overallStatus === 'degraded' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`} />
                <h2 className="text-2xl font-semibold text-gray-900">
                  Overall System Status
                </h2>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                overallStatus === 'healthy' ? 'bg-green-100 text-green-800' :
                overallStatus === 'degraded' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {overallStatus.toUpperCase()}
              </span>
            </div>
            <p className="mt-2 text-gray-600">
              {overallStatus === 'healthy' ? 'All systems are operating normally.' :
               overallStatus === 'degraded' ? 'Some systems are experiencing issues.' :
               'Critical systems are experiencing issues.'}
            </p>
          </div>

          {/* Health Checks Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {healthChecks.map((check, index) => (
              <div key={index} className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-gray-900">{check.name}</h3>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      check.status === 'healthy' ? 'bg-green-500' :
                      check.status === 'degraded' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`} />
                    <span className={`text-sm font-medium ${
                      check.status === 'healthy' ? 'text-green-600' :
                      check.status === 'degraded' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {check.status}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">{check.details}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Last checked: {check.lastChecked.toLocaleTimeString()}</span>
                  {check.responseTime && (
                    <span>Response: {check.responseTime}ms</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* System Information */}
          <div className="mt-8 bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">System Information</h3>
            <div className="grid gap-4 md:grid-cols-2 text-sm">
              <div>
                <span className="font-medium text-gray-700">Application:</span>
                <span className="ml-2 text-gray-600">eMenu Next.js Application</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Environment:</span>
                <span className="ml-2 text-gray-600">{process.env.NODE_ENV || 'Unknown'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Server URL:</span>
                <span className="ml-2 text-gray-600">{process.env.NEXT_PUBLIC_SITE_URL || 'Not configured'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">API URL:</span>
                <span className="ml-2 text-gray-600">{process.env.NEXT_PUBLIC_DIRECTUS_URL || 'Not configured'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Server Time:</span>
                <span className="ml-2 text-gray-600">{new Date().toLocaleString()}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Uptime:</span>
                <span className="ml-2 text-gray-600">Since server start</span>
              </div>
            </div>
          </div>

          {/* Auto-refresh indicator */}
          <div className="mt-8 text-center">
            <HealthStatusClient />
          </div>
        </div>
      </div>
    </div>
  );
}