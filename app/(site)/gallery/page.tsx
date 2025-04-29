import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/prisma";
import { Download, Eye, Search, Filter, ChevronDown, CheckCircle2, SlidersHorizontal } from "lucide-react";
import { ImageWithPattern } from "@/components/ui/image-with-pattern";
import { categoryOptions, imageTypeOptions, aiGenerationOptions } from "@/lib/constants";

// Filter options
const CATEGORIES = categoryOptions;

const IMAGE_TYPES = imageTypeOptions;

const AI_STATUS = aiGenerationOptions;

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "downloads", label: "Most Downloaded" },
];

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    q?: string; 
    category?: string;
    imageType?: string;
    aiGenerated?: string;
    sort?: string;
  }>;
}) {
  // Convert searchParams to regular variables to avoid async issues
  const { q, category, imageType, aiGenerated, sort } = await searchParams;
  const searchQuery = q || "";
  const categoryFilter = category || "";
  const imageTypeFilter = imageType || "";
  const aiGeneratedFilter = aiGenerated || "";
  const sortOption = sort || "popular";

  // Fetch all approved items with filters
  const approvedItems = await db.contributorItem.findMany({
    where: { 
      status: "APPROVED",
      ...(searchQuery ? {
        OR: [
          { title: { contains: searchQuery, mode: 'insensitive' } },
          { description: { contains: searchQuery, mode: 'insensitive' } },
          { tags: { has: searchQuery } }
        ]
      } : {}),
      ...(categoryFilter ? {
        category: categoryFilter
      } : {}),
      ...(imageTypeFilter ? {
        imageType: imageTypeFilter
      } : {}),
      ...(aiGeneratedFilter ? {
        aiGeneratedStatus: aiGeneratedFilter
      } : {})
    },
    orderBy: sortOption === "newest" 
      ? [{ createdAt: 'desc' }] 
      : sortOption === "downloads" 
        ? [{ downloads: 'desc' }] 
        : [{ views: 'desc' }, { createdAt: 'desc' }],
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });

  // Function to generate filter URL with updated params
  const getFilterUrl = (paramName: string, value: string) => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('q', searchQuery);
    if (categoryFilter && paramName !== 'category') params.set('category', categoryFilter);
    if (imageTypeFilter && paramName !== 'imageType') params.set('imageType', imageTypeFilter);
    if (aiGeneratedFilter && paramName !== 'aiGenerated') params.set('aiGenerated', aiGeneratedFilter);
    if (sortOption && paramName !== 'sort') params.set('sort', sortOption);
    
    // Add or remove the selected filter
    if (paramName === 'category' && categoryFilter !== value) params.set('category', value);
    if (paramName === 'imageType' && imageTypeFilter !== value) params.set('imageType', value);
    if (paramName === 'aiGenerated' && aiGeneratedFilter !== value) params.set('aiGenerated', value);
    if (paramName === 'sort' && sortOption !== value) params.set('sort', value);
    
    return `/gallery?${params.toString()}`;
  };

  // Function to check if a filter is active
  const isFilterActive = (paramName: string, value: string) => {
    if (paramName === 'category') return categoryFilter === value;
    if (paramName === 'imageType') return imageTypeFilter === value;
    if (paramName === 'aiGenerated') return aiGeneratedFilter === value;
    if (paramName === 'sort') return sortOption === value;
    return false;
  };

  // Function to get a clear filter URL
  const getClearFilterUrl = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    return `/gallery${params.toString() ? `?${params.toString()}` : ''}`;
  };

  // Check if any filters are applied
  const hasFilters = categoryFilter || imageTypeFilter || aiGeneratedFilter;

  // Safe display of imageType and aiGeneratedStatus, accounting for potentially older records
  const getImageType = (item: any) => {
    return item.imageType || 'JPG';
  };

  const isAiGenerated = (item: any) => {
    return item.aiGeneratedStatus === 'AI_GENERATED';
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Modern header without search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Image Gallery</h1>
            <p className="text-gray-500 mt-1">
              {approvedItems.length} high-quality images
            </p>
          </div>
        </div>

        {/* Modern filter and sort bar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 py-4 border-b border-gray-100">
          {/* Active filters and sort options */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map((option) => (
                <Link
                  key={option.value}
                  href={getFilterUrl('sort', option.value)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    isFilterActive('sort', option.value)
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Applied filters pills */}
          <div className="flex flex-wrap gap-2 items-center">
            {hasFilters && (
              <div className="flex flex-wrap gap-2">
                {categoryFilter && (
                  <div className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-lg flex items-center">
                    {CATEGORIES.find(c => c.value === categoryFilter)?.label || categoryFilter}
                    <Link href={getFilterUrl('category', '')} className="ml-1 hover:text-blue-800">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                      </svg>
                    </Link>
                  </div>
                )}
                
                {imageTypeFilter && (
                  <div className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-lg flex items-center">
                    {IMAGE_TYPES.find(t => t.value === imageTypeFilter)?.label || imageTypeFilter}
                    <Link href={getFilterUrl('imageType', '')} className="ml-1 hover:text-blue-800">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                      </svg>
                    </Link>
                  </div>
                )}
                
                {aiGeneratedFilter && (
                  <div className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-lg flex items-center">
                    {AI_STATUS.find(s => s.value === aiGeneratedFilter)?.label || aiGeneratedFilter}
                    <Link href={getFilterUrl('aiGenerated', '')} className="ml-1 hover:text-blue-800">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                      </svg>
                    </Link>
                  </div>
                )}
                
                <Link 
                  href={getClearFilterUrl()}
                  className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Clear filters
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Modern collapsible filters sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden sticky top-[80px] max-h-[calc(100vh-100px)] overflow-y-auto">
              <div className="p-4 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                <h2 className="font-medium text-gray-800 flex items-center">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </h2>
              </div>

              {/* AI Generated filter - Moved to top */}
              <div className="p-4">
                <h3 className="font-medium text-gray-700 mb-3">AI Status</h3>
                <div className="flex gap-2 mt-2">
                  {AI_STATUS.map((status) => (
                    <Link 
                      key={status.value}
                      href={getFilterUrl('aiGenerated', status.value)}
                      className={`flex-1 text-center text-sm py-1.5 px-3 rounded-lg ${
                        isFilterActive('aiGenerated', status.value) 
                          ? 'bg-blue-100 text-blue-800 font-medium' 
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {status.value === "AI_GENERATED" ? "AI" : "Not AI"}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Image Type filter */}
              <div className="border-t border-gray-100">
                <div className="p-4">
                  <h3 className="font-medium text-gray-700 mb-3">File Type</h3>
                  <div className="flex gap-2 mt-2">
                    {IMAGE_TYPES.map((type) => (
                      <Link 
                        key={type.value}
                        href={getFilterUrl('imageType', type.value)}
                        className={`flex-1 text-center text-sm py-1.5 px-3 rounded-lg ${
                          isFilterActive('imageType', type.value) 
                            ? 'bg-blue-100 text-blue-800 font-medium' 
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {type.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category filter - Optimized grid layout */}
              <div className="border-t border-gray-100">
                <div className="p-4">
                  <h3 className="font-medium text-gray-700 mb-3">Category</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {CATEGORIES.map((category) => {
                      const isSelected = isFilterActive('category', category.value);
                      
                      return (
                        <Link 
                          key={category.value}
                          href={getFilterUrl('category', category.value)}
                          className={`flex items-center justify-center text-sm py-2 px-3 rounded-lg ${
                            isSelected
                              ? 'bg-blue-100 text-blue-800 font-medium' 
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <span className="truncate text-sm text-center w-full">{category.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main content - image grid */}
          <div className="flex-1">
            {approvedItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No images found matching your criteria.</p>
              </div>
            ) : (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {approvedItems.map((item) => (
                  <Link 
                    href={`/gallery/${item.id}`} 
                    key={item.id}
                    className="group block break-inside-avoid"
                  >
                    <div className="bg-gray-50 rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative">
                      <div className="relative w-full">
                        <ImageWithPattern 
                          src={item.imageUrl}
                          alt={item.title}
                          width={800}
                          height={800}
                          className="w-full transition-transform duration-300 group-hover:scale-105"
                          imageType={getImageType(item)}
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <h3 className="text-white font-medium truncate">{item.title}</h3>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center text-xs text-white/80">
                            <Eye className="w-3 h-3 mr-1" />
                            <span>{item.views}</span>
                            <Download className="w-3 h-3 ml-2 mr-1" />
                            <span>{item.downloads}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}