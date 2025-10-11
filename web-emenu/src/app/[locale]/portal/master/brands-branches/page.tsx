'use client';

import { useState, useEffect } from 'react';
import { Brand, Branch } from '@/lib/directus';
import { branchService, BranchStats } from '@/services/branchService';
import { Building2, Store, ArrowRightLeft, Edit2, Save, X, Phone, Mail, Globe, Eye, EyeOff } from 'lucide-react';

interface BranchFormData {
  display_name: string;
  phone: string;
  email: string;
}

interface InlineEditCellProps {
  value: string;
  onSave: (value: string) => void;
  type?: 'text' | 'email' | 'tel';
  placeholder?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

function InlineEditCell({ value, onSave, type = 'text', placeholder, icon, disabled }: InlineEditCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1">
        {icon && <span className="text-gray-400 dark:text-gray-600">{icon}</span>}
        <input
          type={type}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className={`px-2 py-1 border border-blue-300 dark:border-blue-600 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-w-[120px]`}
          placeholder={placeholder}
          autoFocus
        />
        <button
          onClick={handleSave}
          className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
          title="Save"
        >
          <Save className="w-3 h-3" />
        </button>
        <button
          onClick={handleCancel}
          className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          title="Cancel"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => !disabled && setIsEditing(true)}
      className={`flex items-center gap-1 group cursor-pointer ${disabled ? 'cursor-not-allowed' : ''}`}
    >
      {icon && <span className="text-gray-400 dark:text-gray-600">{icon}</span>}
      <span className={`text-xs ${value ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600 italic'} ${!disabled ? 'hover:text-blue-600 dark:hover:text-blue-400' : ''}`}>
        {value || placeholder}
      </span>
      {!disabled && (
        <Edit2 className="w-3 h-3 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </div>
  );
}

export default function BrandsBranchesPage() {
  const [activeTab, setActiveTab] = useState<'branches' | 'brands'>('branches');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [branchStats, setBranchStats] = useState<BranchStats>({ total: 0, active: 0, inactive: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingBranchId, setSavingBranchId] = useState<string | null>(null);

  useEffect(() => {
    fetchBranches();
    fetchBrands();
  }, []);

  const fetchBranches = async () => {
    try {
      setError(null);
      const branchesData = await branchService.getAllBranches();
      setBranches(branchesData);
      setBranchStats(branchService.calculateStats(branchesData));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (/401|Unauthorized|permission|forbidden/i.test(msg)) {
        setError('You are not authorized to view branches. Please log in and try again.');
      } else {
        setError(msg || 'Failed to load branches');
      }
    }
  };

  const fetchBrands = async () => {
    try {
      // Mock brands data for now - replace with actual API call
      const mockBrands: Brand[] = [
        {
          id: '1',
          name: 'SOL Korean BBQ',
          code: 'SOL',
          display_name: 'SOL Korean BBQ',
          description: 'Premium Korean dining experience',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'SOL Express',
          code: 'EXPRESS',
          display_name: 'SOL Express',
          description: 'Quick service Korean dining',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ];
      setBrands(mockBrands);
    } catch (err) {
      console.error('Failed to fetch brands:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBranchInlineEdit = async (branchId: string, field: keyof BranchFormData, value: string) => {
    try {
      setSavingBranchId(branchId);
      const updateData = { [field]: value };
      await branchService.updateBranch(branchId, updateData);
      await fetchBranches(); // Refresh data
    } catch (err) {
      console.error('Failed to update branch:', err);
      // You could show a toast notification here
    } finally {
      setSavingBranchId(null);
    }
  };

  const handleSwitchBranch = async (branchId: string) => {
    try {
      // Implement branch switching logic
      console.log('Switching to branch:', branchId);
      // This would typically update the user's session or context
      // For now, we'll just show a success message
      alert(`Successfully switched to branch: ${branches.find(b => b.id === branchId)?.name || branchId}`);
    } catch (err) {
      console.error('Failed to switch branch:', err);
      alert('Failed to switch branch. Please try again.');
    }
  };

  const getBrandName = (brandId?: string) => {
    if (!brandId) return 'Not assigned';
    const brand = brands.find(b => b.id === brandId);
    return brand?.display_name || brand?.name || 'Unknown Brand';
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-center py-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400 text-sm">Loading data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    const isAuthError = /not authorized|unauthorized|login/i.test(error);
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="text-center py-6">
          <div className="text-red-600 mb-3">
            <div className="mx-auto h-10 w-10">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">Unable to Load Data</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{error}</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={activeTab === 'branches' ? fetchBranches : fetchBrands}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded text-sm transition-colors"
            >
              Try Again
            </button>
            {isAuthError && (
              <a
                href="/login"
                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-2 px-3 rounded text-sm border border-gray-300 dark:border-gray-600 transition-colors"
              >
                Go to Login
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Brands & Branches</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your brands and restaurant branches</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('branches')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'branches'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <Store className="w-4 h-4" />
            Branches ({branchStats.total})
          </button>
          <button
            onClick={() => setActiveTab('brands')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'brands'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Brands ({brands.length})
          </button>
        </nav>
      </div>

      {/* Branches Tab */}
      {activeTab === 'branches' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          {/* Stats Header */}
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Restaurant Branches
              </h2>
              <button
                onClick={fetchBranches}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-xs flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-300">Total: <strong>{branchStats.total}</strong></span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-300">Active: <strong>{branchStats.active}</strong></span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-300">Inactive: <strong>{branchStats.inactive}</strong></span>
              </div>
            </div>
          </div>

          {/* Branches Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Branch
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Display Name
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {branches.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-8 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center">
                        <Store className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-600" />
                        <p className="mt-1 text-xs">No branches found</p>
                        <p className="text-xs text-gray-400 dark:text-gray-600">Start by adding your first restaurant branch</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  branches.map((branch) => (
                    <tr key={branch.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{branch.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Code: {branch.code}</div>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <InlineEditCell
                          value={branch.display_name || ''}
                          onSave={(value) => handleBranchInlineEdit(branch.id, 'display_name', value)}
                          placeholder="Display name"
                          disabled={savingBranchId === branch.id}
                        />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="space-y-1">
                          <InlineEditCell
                            value={branch.phone || ''}
                            onSave={(value) => handleBranchInlineEdit(branch.id, 'phone', value)}
                            type="tel"
                            placeholder="Phone"
                            icon={<Phone className="w-3 h-3" />}
                            disabled={savingBranchId === branch.id}
                          />
                          <InlineEditCell
                            value={branch.email || ''}
                            onSave={(value) => handleBranchInlineEdit(branch.id, 'email', value)}
                            type="email"
                            placeholder="Email"
                            icon={<Mail className="w-3 h-3" />}
                            disabled={savingBranchId === branch.id}
                          />
                          {!branch.phone && !branch.email && (
                            <span className="text-gray-400 dark:text-gray-600 italic text-xs">No contact info</span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-xs text-gray-900 dark:text-white">
                          {getBrandName(branch.brand_id)}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className={branchService.getStatusBadgeClass(branch.is_active)}>
                          {branch.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSwitchBranch(branch.id)}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 text-xs font-medium"
                            title="Switch to this branch"
                          >
                            <ArrowRightLeft className="w-3 h-3" />
                            Switch
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {branches.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-t border-gray-200 dark:border-gray-600">
              <div className="text-xs text-gray-600 dark:text-gray-300">
                Showing {branches.length} of {branchStats.total} branches
              </div>
            </div>
          )}
        </div>
      )}

      {/* Brands Tab */}
      {activeTab === 'brands' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          {/* Brands Header */}
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Restaurant Brands
              </h2>
              <button
                onClick={fetchBrands}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-xs flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          {/* Brands Grid */}
          <div className="p-4">
            {brands.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-600" />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">No brands found</p>
                <p className="text-xs text-gray-400 dark:text-gray-600">Start by adding your first restaurant brand</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {brands.map((brand) => (
                  <div key={brand.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {brand.logo ? (
                          <img src={brand.logo} alt={brand.name} className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{brand.name}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Code: {brand.code}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        brand.is_active
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                      }`}>
                        {brand.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {brand.description && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{brand.description}</p>
                    )}
                    {brand.website && (
                      <a
                        href={brand.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Globe className="w-3 h-3" />
                        {brand.website}
                      </a>
                    )}
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Branches: {branches.filter(b => b.brand_id === brand.id).length}</span>
                      <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                          <Eye className="w-3 h-3" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}