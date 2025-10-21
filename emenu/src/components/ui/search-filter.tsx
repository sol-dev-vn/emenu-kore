'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  X,
  ChevronDown,
  SlidersHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SearchFilterProps<T> {
  placeholder?: string;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filters?: FilterOption<T>[];
  activeFilters?: Record<string, any>;
  onFilterChange: (filters: Record<string, any>) => void;
  onClearFilters?: () => void;
  className?: string;
}

interface FilterOption<T> {
  key: keyof T;
  label: string;
  type: 'select' | 'multiselect' | 'range' | 'date';
  options?: Array<{
    label: string;
    value: any;
  }>;
  placeholder?: string;
}

export function SearchFilter<T>({
  placeholder = 'Search...',
  searchTerm,
  onSearchChange,
  filters = [],
  activeFilters = {},
  onFilterChange,
  onClearFilters,
  className
}: SearchFilterProps<T>) {
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const activeFilterCount = Object.keys(activeFilters).filter(
    key => {
      const value = activeFilters[key];
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== null && value !== '';
    }
  ).length;

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...activeFilters };

    if (value === '' || value === null || value === undefined) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }

    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    onFilterChange({});
    onClearFilters?.();
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {/* Filter Button */}
      {filters.length > 0 && (
        <DropdownMenu open={isFilterMenuOpen} onOpenChange={setIsFilterMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="relative">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="start">
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Filters</h4>
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-auto p-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {filters.map((filter) => (
                <div key={String(filter.key)} className="space-y-2">
                  <label className="text-sm font-medium">{filter.label}</label>

                  {filter.type === 'select' && (
                    <select
                      value={activeFilters[filter.key as string] || ''}
                      onChange={(e) => handleFilterChange(filter.key as string, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">{filter.placeholder || 'Select...'}</option>
                      {filter.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}

                  {filter.type === 'multiselect' && (
                    <div className="space-y-1">
                      {filter.options?.map((option) => {
                        const isSelected = Array.isArray(activeFilters[filter.key as string]) &&
                          activeFilters[filter.key as string].includes(option.value);

                        return (
                          <label key={option.value} className="flex items-center space-x-2 text-sm">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                const currentValues = activeFilters[filter.key as string] || [];
                                const newValues = e.target.checked
                                  ? [...currentValues, option.value]
                                  : currentValues.filter((v: any) => v !== option.value);
                                handleFilterChange(filter.key as string, newValues);
                              }}
                              className="h-4 w-4"
                            />
                            <span>{option.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {filter.type === 'range' && (
                    <div className="space-y-2">
                      <input
                        type="range"
                        min={filter.options?.[0]?.value || 0}
                        max={filter.options?.[1]?.value || 100}
                        value={activeFilters[filter.key as string] || 50}
                        onChange={(e) => handleFilterChange(filter.key as string, parseInt(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{filter.options?.[0]?.label || 'Min'}</span>
                        <span>{activeFilters[filter.key as string] || '50'}</span>
                        <span>{filter.options?.[1]?.label || 'Max'}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div className="flex space-x-2 pt-2">
                <Button
                  size="sm"
                  onClick={() => setIsFilterMenuOpen(false)}
                  style={{backgroundColor: '#9B1D20'}}
                >
                  Apply Filters
                </Button>
                <Button variant="outline" size="sm" onClick={clearAllFilters}>
                  Clear
                </Button>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Active Filter Badges */}
      {activeFilterCount > 0 && (
        <div className="flex items-center space-x-2">
          {Object.entries(activeFilters).map(([key, value]) => {
            const filter = filters.find(f => String(f.key) === key);
            if (!filter || !value) return null;

            const getDisplayValue = (val: any) => {
              if (Array.isArray(val)) {
                return `${val.length} selected`;
              }
              if (filter.type === 'range') {
                return `${val}`;
              }
              const option = filter.options?.find(opt => opt.value === val);
              return option?.label || val;
            };

            return (
              <Badge key={key} variant="secondary" className="flex items-center space-x-1">
                <span>{filter.label}: {getDisplayValue(value)}</span>
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleFilterChange(key, null)}
                />
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}