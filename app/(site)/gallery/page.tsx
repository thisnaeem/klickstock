import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/prisma";
import { Download, Eye, Search, Filter, ChevronDown, CheckCircle2 } from "lucide-react";

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
  searchParams: { 
    q?: string; 
    category?: string;
    imageType?: string;
    aiGenerated?: string;
    sort?: string;
  };
}) {
  const searchQuery = searchParams.q || "";
  const categoryFilter = searchParams.category || "";
  const imageTypeFilter = searchParams.imageType || "";
  const aiGeneratedFilter = searchParams.aiGenerated || "";
  const sortOption = searchParams.sort || "popular";

  // Fetch all approved items with filters
  const approvedItems = await db.contributorItem.findMany({
    where: { 
      status: "APPROVED",
      // Title, description, or tags contains search query
      ...(searchQuery ? {
        OR: [
          { title: { contains: searchQuery, mode: 'insensitive' } },
          { description: { contains: searchQuery, mode: 'insensitive' } },
          { tags: { has: searchQuery } }
        ]
      } : {}),
      // Category filter
      ...(categoryFilter ? {
        category: categoryFilter
      } : {}),
      // Image type filter
      ...(imageTypeFilter ? {
        imageType: imageTypeFilter
      } : {}),
      // AI generation filter
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
      {/* Hero section with search */}
      <div className="bg-blue-50 py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Image Gallery</h1>
            <p className="text-lg text-gray-600">
              Browse through our collection of high-quality images
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <form action="/gallery" className="flex">
              <div className="relative flex-grow">
                <input
                  type="text"
                  name="q"
                  defaultValue={searchQuery}
                  placeholder="Search for images..."
                  className="w-full px-6 py-4 rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 h-[calc(100%-0.5rem)] aspect-square flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden sticky top-8">
              <div className="p-4 border-b">
                <h2 className="font-semibold text-gray-800 flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </h2>
              </div>

              {/* Category filter */}
              <div className="border-b">
                <div className="p-4">
                  <h3 className="font-medium text-gray-700 mb-2 flex items-center justify-between">
                    Category
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </h3>
                  <div className="space-y-2 mt-2">
                    {CATEGORIES.map((category) => (
                      <Link 
                        key={category.value}
                        href={getFilterUrl('category', category.value)}
                        className={`flex items-center text-sm py-1 px-2 rounded-md ${
                          isFilterActive('category', category.value) 
                            ? 'bg-blue-50 text-blue-600 font-medium' 
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {isFilterActive('category', category.value) && (
                          <CheckCircle2 className="w-4 h-4 mr-2 text-blue-500" />
                        )}
                        {category.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Image Type filter */}
              <div className="border-b">
                <div className="p-4">
                  <h3 className="font-medium text-gray-700 mb-2 flex items-center justify-between">
                    File Type
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </h3>
                  <div className="space-y-2 mt-2">
                    {IMAGE_TYPES.map((type) => (
                      <Link 
                        key={type.value}
                        href={getFilterUrl('imageType', type.value)}
                        className={`flex items-center text-sm py-1 px-2 rounded-md ${
                          isFilterActive('imageType', type.value) 
                            ? 'bg-blue-50 text-blue-600 font-medium' 
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {isFilterActive('imageType', type.value) && (
                          <CheckCircle2 className="w-4 h-4 mr-2 text-blue-500" />
                        )}
                        {type.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Generated filter */}
              <div className="border-b">
                <div className="p-4">
                  <h3 className="font-medium text-gray-700 mb-2 flex items-center justify-between">
                    AI Generated
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </h3>
                  <div className="space-y-2 mt-2">
                    {AI_STATUS.map((status) => (
                      <Link 
                        key={status.value}
                        href={getFilterUrl('aiGenerated', status.value)}
                        className={`flex items-center text-sm py-1 px-2 rounded-md ${
                          isFilterActive('aiGenerated', status.value) 
                            ? 'bg-blue-50 text-blue-600 font-medium' 
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {isFilterActive('aiGenerated', status.value) && (
                          <CheckCircle2 className="w-4 h-4 mr-2 text-blue-500" />
                        )}
                        {status.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clear filters */}
              {hasFilters && (
                <div className="p-4">
                  <Link 
                    href={getClearFilterUrl()}
                    className="text-sm text-blue-600 hover:underline font-medium"
                  >
                    Clear all filters
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Gallery content */}
          <div className="flex-grow">
            {/* Sort options */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-3">Sort by:</span>
                <div className="flex flex-wrap gap-2">
                  {SORT_OPTIONS.map((option) => (
                    <Link
                      key={option.value}
                      href={getFilterUrl('sort', option.value)}
                      className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
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

              <p className="text-sm text-gray-500">
                {approvedItems.length} results found
              </p>
            </div>

            {/* Applied filters */}
            {hasFilters && (
              <div className="mb-6 flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-500">Filters:</span>
                
                {categoryFilter && (
                  <div className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full flex items-center">
                    {CATEGORIES.find(c => c.value === categoryFilter)?.label || categoryFilter}
                    <Link href={getFilterUrl('category', '')} className="ml-1 hover:text-blue-800">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                )}
                
                {imageTypeFilter && (
                  <div className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full flex items-center">
                    {IMAGE_TYPES.find(t => t.value === imageTypeFilter)?.label || imageTypeFilter}
                    <Link href={getFilterUrl('imageType', '')} className="ml-1 hover:text-blue-800">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                )}
                
                {aiGeneratedFilter && (
                  <div className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full flex items-center">
                    {AI_STATUS.find(s => s.value === aiGeneratedFilter)?.label || aiGeneratedFilter}
                    <Link href={getFilterUrl('aiGenerated', '')} className="ml-1 hover:text-blue-800">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                )}
              </div>
            )}

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

            {/* Image grid */}
            {approvedItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {approvedItems.map((item) => (
                  <div key={item.id} className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
                    <Link href={`/gallery/${item.id}`} className="block aspect-square relative overflow-hidden">
                      <Image 
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* AI badge */}
                      {isAiGenerated(item) && (
                        <div className="absolute top-2 left-2 bg-purple-100 border border-purple-200 text-purple-700 text-xs px-2 py-0.5 rounded">
                          AI Generated
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity flex flex-col justify-end">
                        <div className="p-4 w-full">
                          <div className="flex justify-between text-white mb-2">
                            <div className="flex items-center space-x-1 text-xs bg-black bg-opacity-50 px-2 py-1 rounded-full">
                              <Eye className="w-3 h-3" />
                              <span>{item.views || 0}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-xs bg-black bg-opacity-50 px-2 py-1 rounded-full">
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
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500">
                          By{" "}
                          <Link 
                            href={`/creator/${item.userId}`}
                            className="hover:text-blue-600 hover:underline"
                          >
                            {item.user.name || item.user.email.split('@')[0]}
                          </Link>
                        </p>
                        
                        {/* File type badge */}
                        <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-100 rounded">
                          {getImageType(item)}
                        </span>
                      </div>
                      
                      {/* Tags/keywords */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {item.tags.slice(0, 3).map((tag, index) => (
                            <Link 
                              key={index} 
                              href={`/gallery?q=${tag}`}
                              className="text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full"
                            >
                              {tag}
                            </Link>
                          ))}
                          {item.tags.length > 3 && (
                            <span className="text-xs text-gray-600 px-2 py-1">
                              +{item.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-2">No images found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
                <Link 
                  href="/gallery" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
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