// Branch Service
// Business logic for branch operations

import { directusClient, Branch } from '@/lib/directus';

export interface BranchListResponse {
  branches: Branch[];
  loading: boolean;
  error: string | null;
}

export interface BranchStats {
  total: number;
  active: number;
  inactive: number;
}

class BranchService {
  /**
   * Fetch all branches from Directus
   */
  async getAllBranches(): Promise<Branch[]> {
    try {
      // Fetch via Next.js API to leverage server-side Directus auth and cookies
      const res = await fetch('/api/branches');
      const json = await res.json();
      const branches: Branch[] = Array.isArray(json?.data) ? json.data : [];
      return branches;
    } catch (error) {
      console.error('Failed to fetch branches:', error);
      throw new Error('Unable to load branches. Please try again later.');
    }
  }

  /**
   * Fetch a single branch by ID
   */
  async getBranchById(id: string): Promise<Branch> {
    try {
      const response = await directusClient.getBranch(id);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch branch ${id}:`, error);
      throw new Error('Unable to load branch details. Please try again later.');
    }
  }

  /**
   * Create a new branch
   */
  async createBranch(branchData: Partial<Branch>): Promise<Branch> {
    try {
      const response = await directusClient.createBranch(branchData);
      return response.data;
    } catch (error) {
      console.error('Failed to create branch:', error);
      throw new Error('Unable to create branch. Please check your data and try again.');
    }
  }

  /**
   * Update an existing branch
   */
  async updateBranch(id: string, branchData: Partial<Branch>): Promise<Branch> {
    try {
      const response = await directusClient.updateBranch(id, branchData);
      return response.data;
    } catch (error) {
      console.error(`Failed to update branch ${id}:`, error);
      throw new Error('Unable to update branch. Please check your data and try again.');
    }
  }

  /**
   * Delete a branch
   */
  async deleteBranch(id: string): Promise<void> {
    try {
      await directusClient.deleteBranch(id);
    } catch (error) {
      console.error(`Failed to delete branch ${id}:`, error);
      throw new Error('Unable to delete branch. Please try again later.');
    }
  }

  /**
   * Calculate branch statistics
   */
  calculateStats(branches: Branch[]): BranchStats {
    const total = branches.length;
    const active = branches.filter(branch => branch.is_active).length;
    const inactive = total - active;

    return { total, active, inactive };
  }

  /**
   * Format currency amount
   */
  formatCurrency(amount: number, currency: string = 'VND'): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  /**
   * Format opening hours for display
   */
  formatOpeningHours(openingHours?: Record<string, unknown>): string {
    if (!openingHours) return 'Not specified';

    // Basic formatting - can be enhanced based on actual data structure
    try {
      return JSON.stringify(openingHours, null, 2);
    } catch {
      return 'Invalid format';
    }
  }

  /**
   * Get branch status badge styling
   */
  getStatusBadgeClass(isActive: boolean): string {
    const baseClass = 'px-2 py-1 rounded-full text-xs font-medium ';
    return isActive
      ? baseClass + 'bg-green-100 text-green-800'
      : baseClass + 'bg-red-100 text-red-800';
  }

  /**
   * Validate branch data
   */
  validateBranchData(branchData: Partial<Branch>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!branchData.name || branchData.name.trim().length === 0) {
      errors.push('Branch name is required');
    }

    if (!branchData.code || branchData.code.trim().length === 0) {
      errors.push('Branch code is required');
    }

    if (branchData.code && !/^[a-zA-Z0-9_-]+$/.test(branchData.code)) {
      errors.push('Branch code can only contain letters, numbers, hyphens, and underscores');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const branchService = new BranchService();