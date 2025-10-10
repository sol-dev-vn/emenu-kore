'use client';

import { useState, useEffect } from 'react';
import BranchTable from '@/components/BranchTable';

export default function Home() {
  const [healthStatus, setHealthStatus] = useState<{ status: string; message: string } | null>(null);

  useEffect(() => {
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setHealthStatus(data);
    } catch {
      setHealthStatus({
        status: 'unknown',
        message: 'Unable to check API health'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img
                src="/sol-logo.svg"
                alt="SOL eMenu"
                className="h-10 w-auto"
              />
              <div className="ml-4">
                <h1 className="text-xl font-bold text-gray-900">SOL eMenu</h1>
                <p className="text-xs text-gray-500">Restaurant Management Platform</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {healthStatus && (
                <div className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${
                    healthStatus.status === 'healthy' ? 'bg-green-500' :
                    healthStatus.status === 'unhealthy' ? 'bg-red-500' :
                    'bg-yellow-500'
                  }`}></div>
                  <span className="text-gray-600">
                    API: {healthStatus.status}
                  </span>
                </div>
              )}

              <button
                onClick={checkApiHealth}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Restaurant Branch Management
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your restaurant network with real-time data synchronization from CukCuk POS system.
            Monitor branch performance, track orders, and streamline operations across all locations.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Branch Management</h3>
            <p className="text-gray-600">Complete overview of all restaurant branches with real-time status updates and performance metrics.</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Analytics</h3>
            <p className="text-gray-600">Track sales performance, customer data, and operational metrics across all locations in real-time.</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">POS Integration</h3>
            <p className="text-gray-600">Seamless synchronization with CukCuk POS system for unified data management across platforms.</p>
          </div>
        </div>

        {/* Branch Table */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">All Branches</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Data synced from CukCuk POS</span>
            </div>
          </div>

          <BranchTable />
        </div>

        {/* API Status Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">API Connection Status</h3>
              <div className="mt-2 text-sm text-blue-700">
                {healthStatus?.message || 'Checking API connection...'}
              </div>
              <div className="mt-2">
                <code className="text-xs bg-blue-100 px-2 py-1 rounded">
                  {process.env.NEXT_PUBLIC_DIRECTUS_URL || 'Directus URL not configured'}
                </code>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src="/sol-logo.svg"
                alt="SOL eMenu"
                className="h-8 w-auto"
              />
              <span className="ml-2 text-sm text-gray-500">
                © 2024 SOL eMenu Platform. Powered by Directus & Next.js.
              </span>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span>Version {process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'}</span>
              <a href="#" className="hover:text-gray-700">Documentation</a>
              <a href="#" className="hover:text-gray-700">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
