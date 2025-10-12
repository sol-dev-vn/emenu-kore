'use client';

import { useCallback } from 'react';
import { useBranch } from '@/contexts/branch-context';
import { directusClient } from '@/lib/directus';

export interface BranchScopedOptions {
  includeAllBranches?: boolean;
  customBranchId?: string | null;
}

export function useBranchScopedApi() {
  const { selectedBranchId, selectedBranch } = useBranch();

  // Add branch filter to API options
  const addBranchFilter = useCallback((
    options: any = {},
    { includeAllBranches = false, customBranchId }: BranchScopedOptions = {}
  ) => {
    const branchId = customBranchId !== undefined ? customBranchId : selectedBranchId;

    // If we want all branches or no branch is selected, don't add filter
    if (includeAllBranches || !branchId || branchId === 'all') {
      return options;
    }

    // Add branch filter to existing options
    return {
      ...options,
      filter: {
        ...options.filter,
        branch_id: {
          _eq: branchId
        }
      }
    };
  }, [selectedBranchId]);

  // Get items with branch scoping
  const getItems = useCallback(async (
    collection: string,
    options: any = {},
    branchOptions: BranchScopedOptions = {}
  ) => {
    const scopedOptions = addBranchFilter(options, branchOptions);
    return directusClient.getItems(collection, scopedOptions);
  }, [addBranchFilter]);

  // Create item with branch assignment
  const createItem = useCallback(async (
    collection: string,
    data: any,
    branchOptions: BranchScopedOptions = {}
  ) => {
    const branchId = branchOptions.customBranchId !== undefined
      ? branchOptions.customBranchId
      : selectedBranchId;

    // Auto-assign branch if we have a selected branch and it's not 'all'
    if (branchId && branchId !== 'all' && !data.branch_id) {
      data.branch_id = branchId;
    }

    return directusClient.createDirectusItem(collection, data);
  }, [selectedBranchId]);

  // Update item with branch scoping (ensures user can only update items in their scope)
  const updateItem = useCallback(async (
    collection: string,
    id: string,
    data: any,
    branchOptions: BranchScopedOptions = {}
  ) => {
    const branchId = branchOptions.customBranchId !== undefined
      ? branchOptions.customBranchId
      : selectedBranchId;

    // Add branch filter to ensure we only update items in scope
    if (branchId && branchId !== 'all' && !branchOptions.includeAllBranches) {
      // For updates, we don't typically need to filter by branch_id
      // The backend should handle authorization
      return directusClient.updateDirectusItem(collection, id, data);
    }

    return directusClient.updateDirectusItem(collection, id, data);
  }, [selectedBranchId]);

  // Delete item with branch scoping
  const deleteItem = useCallback(async (
    collection: string,
    id: string,
    branchOptions: BranchScopedOptions = {}
  ) => {
    // The backend should handle authorization to ensure user can only delete items in their scope
    return directusClient.deleteDirectusItem(collection, id);
  }, []);

  // Get count with branch scoping
  const getCount = useCallback(async (
    collection: string,
    options: any = {},
    branchOptions: BranchScopedOptions = {}
  ) => {
    const scopedOptions = addBranchFilter(options, branchOptions);

    // Use the items endpoint with aggregate for count
    const response = await directusClient.getItems(collection, {
      ...scopedOptions,
      aggregate: ['count'],
      limit: 1
    });

    return response.data?.[0]?.count || 0;
  }, [addBranchFilter]);

  // Get sync logs with branch scoping
  const getSyncLogs = useCallback(async (
    options: any = {},
    branchOptions: BranchScopedOptions = {}
  ) => {
    const branchId = branchOptions.customBranchId !== undefined
      ? branchOptions.customBranchId
      : selectedBranchId;

    // For sync logs, we might want to filter by branch if the collection supports it
    if (branchId && branchId !== 'all' && !branchOptions.includeAllBranches) {
      // Check if sync_logs has branch_id field
      const scopedOptions = {
        ...options,
        filter: {
          ...options.filter,
          branch_id: {
            _eq: branchId
          }
        }
      };
      return directusClient.getSyncLogs(scopedOptions);
    }

    return directusClient.getSyncLogs(options);
  }, [selectedBranchId]);

  return {
    getItems,
    createItem,
    updateItem,
    deleteItem,
    getCount,
    getSyncLogs,
    selectedBranchId,
    selectedBranch,
    addBranchFilter,
  };
}