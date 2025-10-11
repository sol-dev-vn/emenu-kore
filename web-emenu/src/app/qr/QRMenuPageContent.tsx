'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/LoadingSpinner';
import { toast } from 'sonner';

interface TableData { name?: string; branch_id?: string }
interface BranchData { name?: string }

export default function QRMenuPage() {
  const searchParams = useSearchParams();
  const tableId = searchParams.get('table');
  const [isLoading, setIsLoading] = useState(true);
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [branchData, setBranchData] = useState<BranchData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tableId) {
      loadTableAndMenuData(tableId);
    } else {
      setError('No table ID provided');
      setIsLoading(false);
    }
  }, [tableId]);

  const loadTableAndMenuData = async (tableId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Load table information
      const tableResponse = await fetch(`/api/tables/${tableId}`);
      if (!tableResponse.ok) {
        throw new Error('Table not found');
      }
      const tableResult = await tableResponse.json();
      setTableData(tableResult.data);

      // Load branch information
      const branchResponse = await fetch(`/api/branches/${tableResult.data.branch_id}`);
      if (!branchResponse.ok) {
        throw new Error('Branch not found');
      }
      const branchResult = await branchResponse.json();
      setBranchData(branchResult.data);

      toast.success(`Welcome to table ${tableId}!`);

    } catch (error) {
      console.error('Error loading table data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load table information');
      toast.error('Unable to load table information');
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    window.history.back();
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading menu..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">{error}</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={goBack} className="flex-1">
                Go Back
              </Button>
              <Button onClick={() => window.location.href = '/'} className="flex-1">
                Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with table and branch info */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">SOL eMenu</h1>
              <p className="text-sm text-gray-600">
                Table: {tableData?.name} | Branch: {branchData?.name}
              </p>
            </div>
            <Button variant="outline" onClick={goBack}>
              Change Table
            </Button>
          </div>
        </div>
      </header>
+      <header className="bg-white shadow-sm border-b border-gray-200">
+        <div className="max-w-4xl mx-auto px-4 py-4">
+          <div className="flex items-center justify-between">
+            <div className="flex items-center gap-3">
+              <img src="/logo_trim.png" alt="SOL eMenu" className="h-8 w-auto" />
+              <div>
+                <h1 className="text-xl font-bold tracking-tight text-gray-900">SOL eMenu</h1>
+                <p className="text-sm text-gray-600">
+                  Table: {tableData?.name} | Branch: {branchData?.name}
+                </p>
+              </div>
+            </div>
+            <Button variant="outline" onClick={goBack}>
+              Change Table
+            </Button>
+          </div>
+        </div>
+      </header>

      {/* Main Menu Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to {branchData?.name}
          </h2>
          <p className="text-gray-600">
            Browse our menu and place your order
          </p>
        </div>

        {/* Menu Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍜</span>
              </div>
              <h3 className="font-semibold text-gray-900">Noodles</h3>
              <p className="text-sm text-gray-600 mt-1">Traditional Vietnamese noodles</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍛</span>
              </div>
              <h3 className="font-semibold text-gray-900">Rice Dishes</h3>
              <p className="text-sm text-gray-600 mt-1">Fragrant rice meals</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🥗</span>
              </div>
              <h3 className="font-semibold text-gray-900">Salads</h3>
              <p className="text-sm text-gray-600 mt-1">Fresh and healthy options</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🥤</span>
              </div>
              <h3 className="font-semibold text-gray-900">Beverages</h3>
              <p className="text-sm text-gray-600 mt-1">Drinks and refreshments</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍰</span>
              </div>
              <h3 className="font-semibold text-gray-900">Desserts</h3>
              <p className="text-sm text-gray-600 mt-1">Sweet treats</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎁</span>
              </div>
              <h3 className="font-semibold text-gray-900">Combos</h3>
              <p className="text-sm text-gray-600 mt-1">Value meal deals</p>
            </CardContent>
          </Card>
        </div>

        {/* Placeholder for actual menu items */}
        <div className="text-center py-12">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Menu Loading...
            </h3>
            <p className="text-yellow-700">
              Menu items are being loaded from our system. This is a demo page showing the QR code functionality.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-600">
          <p>© 2025 SOL eMenu. Powered by Directus & Next.js.</p>
        </div>
      </footer>
    </div>
  );
}