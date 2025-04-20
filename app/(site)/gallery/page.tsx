import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/prisma";
import { Download, Eye, Search, Filter, ChevronDown, CheckCircle2, SlidersHorizontal } from "lucide-react";

// Filter options
const CATEGORIES = [
  { value: "nature", label: "Nature" },
  { value: "business", label: "Business" },
  { value: "technology", label: "Technology" },
  { value: "food", label: "Food & Drink" },
  { value: "people", label: "People" },
  { value: "abstract", label: "Abstract" },
  { value: "animals", label: "Animals" },
  { value: "travel", label: "Travel" },
];

const IMAGE_TYPES = [
  { value: "JPG", label: "JPG" },
  { value: "PNG", label: "PNG" },
];

const AI_STATUS = [
  { value: "AI_GENERATED", label: "AI Generated" },
  { value: "NOT_AI_GENERATED", label: "Not AI Generated" },
];

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
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden sticky top-8">
              <div className="p-4 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                <h2 className="font-medium text-gray-800 flex items-center">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </h2>
              </div>

              {/* Category filter */}
              <div className="border-t border-gray-100">
                <div className="p-4">
                  <h3 className="font-medium text-gray-700 mb-3">Category</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 mt-2">
                    {CATEGORIES.map((category) => (
                      <Link 
                        key={category.value}
                        href={getFilterUrl('category', category.value)}
                        className={`flex items-center text-sm py-1.5 px-3 rounded-lg ${
                          isFilterActive('category', category.value) 
                            ? 'bg-blue-100 text-blue-800 font-medium' 
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {isFilterActive('category', category.value) && (
                          <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-blue-600" />
                        )}
                        {category.label}
                      </Link>
                    ))}
                  </div>
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

              {/* AI Generated filter */}
              <div className="border-t border-gray-100">
                <div className="p-4">
                  <h3 className="font-medium text-gray-700 mb-3">AI Generated</h3>
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
              </div>
            </div>
          </div>

          {/* Gallery content */}
          <div className="flex-grow">
            {/* Search results message */}
            {searchQuery && (
              <div className="mb-6">
                <p className="text-gray-600">
                  {approvedItems.length} results for "{searchQuery}"
                  {approvedItems.length === 0 && (
                    <Link href="/gallery" className="ml-2 text-blue-600 hover:underline">
                      Clear search
                    </Link>
                  )}
                </p>
              </div>
            )}

            {/* Modern image grid with 4 columns */}
            {approvedItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {approvedItems.map((item) => (
                  <div key={item.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                    <Link href={`/gallery/${item.id}`} className="block aspect-square relative overflow-hidden">
                      <Image 
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* AI badge */}
                      {isAiGenerated(item) && (
                        <div className="absolute top-3 left-3 bg-purple-600/90 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                          AI
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end">
                        <div className="p-4 w-full">
                          <div className="flex justify-between text-white mb-2">
                            <div className="flex items-center space-x-1 text-xs bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
                              <Eye className="w-3 h-3" />
                              <span>{item.views || 0}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-xs bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
                              <Download className="w-3 h-3" />
                              <span>{item.downloads || 0}</span>
                            </div>
                          </div>
                          <h3 className="text-white font-medium truncate">
                            {item.title}
                          </h3>
                        </div>
                      </div>
                    </Link>
                    <div className="p-3">
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500">
                          By{" "}
                          <Link 
                            href={`/creator/${item.userId}`}
                            className="hover:text-blue-600 font-medium"
                          >
                            {item.user.name || item.user.email.split('@')[0]}
                          </Link>
                        </p>
                        
                        {/* File type badge */}
                        <span className="text-xs font-medium text-gray-500 px-2 py-0.5 bg-gray-100 rounded-md">
                          {getImageType(item)}
                        </span>
                      </div>
                      
                      {/* Tags/keywords - reduced to conserve space */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {item.tags.slice(0, 2).map((tag, index) => (
                            <Link 
                              key={index} 
                              href={`/gallery?q=${tag}`}
                              className="text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-md"
                            >
                              {tag}
                            </Link>
                          ))}
                          {item.tags.length > 2 && (
                            <span className="text-xs text-gray-500 px-1 py-1">
                              +{item.tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
                <h3 className="text-lg font-medium text-gray-800 mb-2">No images found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
                <Link 
                  href="/gallery" 
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all inline-block"
                >
                  View all images
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}