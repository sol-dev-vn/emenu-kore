'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { directusClient } from '@/lib/directus';
import { useAuth } from '@/contexts/auth-context';

export interface BranchItem {
  id: string;
  name: string;
  code: string;
  display_name?: string;
  description?: string;
  is_active: boolean;
}

export interface BranchContextType {
  branches: BranchItem[];
  selectedBranchId: string | null;
  selectedBranch: BranchItem | null;
  isLoading: boolean;
  error: string | null;
  selectBranch: (branchId: string | null) => void;
  refreshBranches: () => Promise<void>;
  getActiveBranches: () => BranchItem[];
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export const useBranch = () => {
  const context = useContext(BranchContext);
  if (context === undefined) {
    throw new Error('useBranch must be used within a BranchProvider');
  }
  return context;
};

interface BranchProviderProps {
  children: ReactNode;
}

export function BranchProvider({ children }: BranchProviderProps) {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [branches, setBranches] = useState<BranchItem[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the selected branch object
  const selectedBranch = selectedBranchId
    ? branches.find(b => b.id === selectedBranchId) || null
    : null;

  // Load branches from Directus API
  const loadBranches = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.debug('Branch: Loading branches...');
      const response = await directusClient.getBranches();
      console.debug('Branch: Branches response:', response);
      if (response?.data) {
        const activeBranches = response.data.filter(branch => branch.is_active);
        console.debug('Branch: Found active branches:', activeBranches.length);
        setBranches(activeBranches);
      }
    } catch (err) {
      console.error('Failed to load branches:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load branches';

      // Special handling for permission errors
      if (errorMessage.includes('403') || errorMessage.includes('permission')) {
        setError('You do not have permission to access branches. Please contact your administrator.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Read selected branch from cookie/localStorage
  const readSelectedBranchFromStorage = () => {
    try {
      // Try localStorage first
      const storedBranch = localStorage.getItem('selected_branch');
      if (storedBranch) {
        if (storedBranch === 'all') {
          setSelectedBranchId('all');
          return;
        }
        setSelectedBranchId(storedBranch);
        return;
      }

      // Fallback to cookie
      const match = document.cookie.match(/(?:^|; )selected_branch=([^;]+)/);
      if (match) {
        const value = decodeURIComponent(match[1]);
        if (value === 'all') {
          setSelectedBranchId('all');
        } else {
          setSelectedBranchId(value);
        }
      }
    } catch (err) {
      console.warn('Failed to read selected branch from storage:', err);
    }
  };

  // Save selected branch to storage
  const saveSelectedBranchToStorage = (branchId: string | null) => {
    try {
      if (branchId === null || branchId === 'all') {
        localStorage.setItem('selected_branch', 'all');
        document.cookie = 'selected_branch=all; path=/; max-age=31536000'; // 1 year
      } else {
        localStorage.setItem('selected_branch', branchId);
        document.cookie = `selected_branch=${branchId}; path=/; max-age=31536000`; // 1 year
      }
    } catch (err) {
      console.warn('Failed to save selected branch to storage:', err);
    }
  };

  // Select a branch
  const selectBranch = (branchId: string | null) => {
    const finalBranchId = branchId === null ? 'all' : branchId;
    setSelectedBranchId(finalBranchId);
    saveSelectedBranchToStorage(finalBranchId);
  };

  // Get active branches (filtered)
  const getActiveBranches = (): BranchItem[] => {
    return branches.filter(branch => branch.is_active);
  };

  // Refresh branches from API
  const refreshBranches = async () => {
    await loadBranches();
  };

  // Initialize on mount and when auth state changes
  useEffect(() => {
    const initialize = async () => {
      // Only load branches if user is authenticated
      if (isAuthenticated) {
        console.debug('Branch: User authenticated, loading branches...');
        await loadBranches();
        readSelectedBranchFromStorage();
      } else {
        console.debug('Branch: User not authenticated, skipping branch loading');
        setIsLoading(false);
      }
    };

    initialize();

    // Listen for storage events (for cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'selected_branch') {
        readSelectedBranchFromStorage();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isAuthenticated]);

  // Check for cookie updates on window focus
  useEffect(() => {
    const handleFocus = () => {
      readSelectedBranchFromStorage();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const value: BranchContextType = {
    branches,
    selectedBranchId,
    selectedBranch,
    isLoading,
    error,
    selectBranch,
    refreshBranches,
    getActiveBranches,
  };

  return (
    <BranchContext.Provider value={value}>
      {children}
    </BranchContext.Provider>
  );
}