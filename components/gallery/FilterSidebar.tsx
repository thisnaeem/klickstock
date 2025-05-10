"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Filter, ChevronDown } from 'lucide-react';

type CategoryOption = {
  value: string;
  label: string;
};

type FilterData = {
  categories: CategoryOption[];
  imageTypes: CategoryOption[];
  aiStatus: CategoryOption[];
  activeFilters: {
    category: string;
    imageType: string;
    aiGenerated: string;
  };
  currentSearchQuery: string;
  currentSort: string;
};

type FilterSidebarProps = {
  filterData: FilterData;
};

export default function FilterSidebar({ filterData }: FilterSidebarProps) {
  const { categories, imageTypes, aiStatus, activeFilters, currentSearchQuery, currentSort } = filterData;
  const [showAllCategories, setShowAllCategories] = useState(false);
  
  // Number of categories to show initially
  const initialCategoriesCount = 8;
  
  // Function to generate filter URL with updated params
  const getFilterUrl = (paramName: string, value: string) => {
    const params = new URLSearchParams();
    
    // Add existing params except the one we're changing
    if (currentSearchQuery) params.set('q', currentSearchQuery);
    if (activeFilters.category && paramName !== 'category') params.set('category', activeFilters.category);
    if (activeFilters.imageType && paramName !== 'imageType') params.set('imageType', activeFilters.imageType);
    if (activeFilters.aiGenerated && paramName !== 'aiGenerated') params.set('aiGenerated', activeFilters.aiGenerated);
    if (currentSort && paramName !== 'sort') params.set('sort', currentSort);
    
    // Handle the filter change
    if (value) {
      params.set(paramName, value);
    }
    
    return `/gallery?${params.toString()}`;
  };

  // Function to check if a filter is active
  const isFilterActive = (paramName: string, value: string) => {
    if (paramName === 'category') return activeFilters.category === value;
    if (paramName === 'imageType') return activeFilters.imageType === value;
    if (paramName === 'aiGenerated') return activeFilters.aiGenerated === value;
    return false;
  };

  // Categories to display based on show more/less state
  const displayedCategories = showAllCategories 
    ? categories 
    : categories.slice(0, initialCategoriesCount);

  return (
    <div className="border-r border-gray-800/50 shadow-lg overflow-hidden h-screen overflow-y-auto bg-black">
      <div className="py-6 pr-4 pl-8 flex items-center gap-3 border-b border-gray-800/50">
        <Filter className="w-6 h-6 text-white" />
        <h2 className="text-xl text-white font-medium">Filters</h2>
      </div>

      {/* Categories Section */}
      <div className="border-b border-gray-800/50">
        <details className="group" open>
          <summary className="py-4 pr-4 pl-8 flex items-center justify-between cursor-pointer list-none">
            <h3 className="text-lg text-white">Categories</h3>
            <ChevronDown className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" />
          </summary>
          <div className="px-4 pb-4 pl-8">
            <div className="grid grid-cols-2 gap-2">
              {displayedCategories.map((category) => (
                <Link
                  key={category.value}
                  href={getFilterUrl('category', category.value)}
                  className={`flex items-center justify-center text-sm py-2 px-3 transition-colors rounded-full ${
                    isFilterActive('category', category.value)
                      ? 'text-white bg-gray-700/40 border border-gray-600'
                      : 'text-gray-400 border border-gray-800/50 hover:border-gray-600 bg-gray-900/20'
                  }`}
                >
                  <span className="truncate text-sm">{category.label}</span>
                </Link>
              ))}
            </div>
            <button 
              className="w-full mt-4 py-2 text-[#98FF98] text-sm font-medium hover:text-[#7FFF00] transition-colors focus:outline-none"
              onClick={() => setShowAllCategories(!showAllCategories)}
            >
              {showAllCategories ? '- Show Less' : '+ Show More'}
            </button>
          </div>
        </details>
      </div>

      {/* AI Status filter */}
      <div className="border-b border-gray-800/50">
        <details className="group" open>
          <summary className="py-4 pr-4 pl-8 flex items-center justify-between cursor-pointer list-none">
            <h3 className="text-lg text-white">AI Status</h3>
            <ChevronDown className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" />
          </summary>
          <div className="px-4 pb-4 pl-8">
            <div className="flex gap-2">
              {aiStatus.map((status) => (
                <Link 
                  key={status.value}
                  href={getFilterUrl('aiGenerated', status.value)}
                  className={`flex-1 text-center text-sm py-2 px-3 transition-colors rounded-full ${
                    isFilterActive('aiGenerated', status.value)
                      ? 'text-white bg-gray-700/40 border border-gray-600'
                      : 'text-gray-400 border border-gray-800/50 hover:border-gray-600 bg-gray-900/20'
                  }`}
                >
                  {status.label}
                </Link>
              ))}
            </div>
          </div>
        </details>
      </div>

      {/* Image Type filter */}
      <div>
        <details className="group" open>
          <summary className="py-4 pr-4 pl-8 flex items-center justify-between cursor-pointer list-none">
            <h3 className="text-lg text-white">Image Type</h3>
            <ChevronDown className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" />
          </summary>
          <div className="px-4 pb-4 pl-8">
            <div className="flex gap-2">
              {imageTypes.map((type) => (
                <Link 
                  key={type.value}
                  href={getFilterUrl('imageType', type.value)}
                  className={`flex-1 text-center text-sm py-2 px-3 transition-colors rounded-full ${
                    isFilterActive('imageType', type.value)
                      ? 'text-white bg-gray-700/40 border border-gray-600'
                      : 'text-gray-400 border border-gray-800/50 hover:border-gray-600 bg-gray-900/20'
                  }`}
                >
                  {type.label}
                </Link>
              ))}
            </div>
          </div>
        </details>
      </div>
    </div>
  );
} 