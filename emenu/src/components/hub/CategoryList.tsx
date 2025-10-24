'use client';

import { useState } from 'react';
import { Category } from '@/hooks/use-brand-menus';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface CategoryListProps {
  categories: Category[];
  selectedCategory: number | null;
  onCategorySelect: (categoryId: number | null) => void;
  loading?: boolean;
}

export function CategoryList({
  categories,
  selectedCategory,
  onCategorySelect,
  loading = false
}: CategoryListProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  const toggleCategory = (categoryId: number) => {
    onCategorySelect(selectedCategory === categoryId ? null : categoryId);
  };

  const toggleExpand = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-medium text-gray-900">Categories</h3>
      </div>

      <div className="p-2">
        {/* All Items option */}
        <button
          onClick={() => onCategorySelect(null)}
          className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedCategory === null
              ? 'bg-red-50 text-red-700 border-l-4 border-red-500'
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          All Items
        </button>

        {/* Category list */}
        {categories.map((category) => (
          <div key={category.id} className="mb-1">
            <div className="flex items-center">
              <button
                onClick={() => toggleCategory(category.id)}
                className={`flex-1 text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-red-50 text-red-700 border-l-4 border-red-500'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                style={{
                  borderLeftColor: category.color || '#9B1D20'
                }}
              >
                <div className="flex items-center justify-between w-full">
                  <span>{category.name}</span>
                  {category.color && (
                    <div
                      className="w-3 h-3 rounded-full border border-gray-300"
                      style={{ backgroundColor: category.color }}
                    />
                  )}
                </div>
              </button>
            </div>

            {/* Category description */}
            {category.description && selectedCategory === category.id && (
              <div className="px-3 py-1 text-xs text-gray-600 ml-2">
                {category.description}
              </div>
            )}
          </div>
        ))}

        {/* No categories state */}
        {categories.length === 0 && (
          <div className="px-3 py-4 text-center text-sm text-gray-500">
            No categories available
          </div>
        )}
      </div>
    </div>
  );
}