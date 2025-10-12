'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBranch } from '@/contexts/branch-context';
import { useBranchScopedApi } from '@/hooks/use-branch-scoped-api';
import { Store, Globe, Database, RefreshCw } from 'lucide-react';

export default function BranchScopedExample() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { selectedBranchId, selectedBranch, branches } = useBranch();
  const { getItems, getCount } = useBranchScopedApi();

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Example: Get menu items scoped to current branch
      const response = await getItems('menu_items', {
        sort: ['-date_created'],
        limit: 10
      });

      if (response?.data) {
        setItems(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadItemCount = async () => {
    try {
      const count = await getCount('menu_items');
      console.log(`Total menu items in scope: ${count}`);
      return count;
    } catch (err) {
      console.error('Failed to get count:', err);
      return 0;
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedBranchId]);

  const getBranchDisplay = () => {
    if (selectedBranchId === 'all') {
      return { icon: Globe, name: 'All Branches', color: 'blue' };
    }
    if (selectedBranch) {
      return { icon: Store, name: selectedBranch.display_name || selectedBranch.name, color: 'green' };
    }
    return { icon: Store, name: 'No Branch Selected', color: 'gray' };
  };

  const branchDisplay = getBranchDisplay();
  const BranchIcon = branchDisplay.icon;

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Database className="h-5 w-5" />
            Branch-Scoped API Example
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Branch Display */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <BranchIcon className={`h-8 w-8 text-${branchDisplay.color}-500`} />
            <div>
              <div className="font-semibold">Current Scope:</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{branchDisplay.name}</div>
            </div>
            <Badge variant={selectedBranchId === 'all' ? 'default' : 'secondary'}>
              {selectedBranchId === 'all' ? 'Global' : 'Scoped'}
            </Badge>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={loadData} disabled={loading} className="flex items-center gap-2">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Load Data
            </Button>
            <Button
              variant="outline"
              onClick={loadItemCount}
              className="flex items-center gap-2"
            >
              Get Count
            </Button>
          </div>

          {/* Status */}
          {loading && (
            <div className="text-sm text-blue-600 dark:text-blue-400">
              Loading data...
            </div>
          )}

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded">
              Error: {error}
            </div>
          )}

          {/* Results */}
          {items.length > 0 && (
            <div className="space-y-3">
              <div className="text-sm font-medium">
                Found {items.length} items in current scope:
              </div>
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div key={index} className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
                    <div className="font-medium">{item.name || `Item ${index + 1}`}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      ID: {item.id}
                    </div>
                    {item.branch_id && (
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Branch: {item.branch_id}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="text-sm text-gray-600 dark:text-gray-400 text-center py-8">
              No items found in current branch scope
            </div>
          )}

          {/* Usage Instructions */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Usage Examples:</h4>
            <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
              <div><code>const {`{`}getItems{`} =`} useBranchScopedApi();</code></div>
              <div><code>const data = await getItems('collection_name', options);</code></div>
              <div><code>const count = await getCount('collection_name');</code></div>
              <div className="text-xs mt-2">
                • Automatically filters by current branch<br/>
                • Use 'includeAllBranches: true' to override<br/>
                • Use 'customBranchId: "branch-id"' for specific branch
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}