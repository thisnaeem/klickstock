export default function GalleryLoading() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header Skeleton */}
      <div className="relative py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="h-12 w-64 bg-gray-200 rounded-lg animate-pulse mx-auto mb-4"></div>
            <div className="h-6 w-96 bg-gray-200 rounded-lg animate-pulse mx-auto"></div>
          </div>
        </div>
      </div>

      {/* Filters Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-4 mb-8">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="h-10 w-24 bg-gray-200 rounded-full animate-pulse"
            ></div>
          ))}
        </div>

        {/* Search Bar Skeleton */}
        <div className="mb-8">
          <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        {/* Gallery Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(12)].map((_, index) => (
            <div key={index} className="space-y-4">
              {/* Image Skeleton */}
              <div className="aspect-[4/3] bg-gray-200 rounded-lg animate-pulse"></div>
              
              {/* Title Skeleton */}
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              
              {/* Metadata Skeleton */}
              <div className="flex items-center space-x-4">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>

              {/* Tags Skeleton */}
              <div className="flex flex-wrap gap-2">
                {[...Array(3)].map((_, tagIndex) => (
                  <div
                    key={tagIndex}
                    className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Load More Skeleton */}
        <div className="mt-12 text-center">
          <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse mx-auto"></div>
        </div>
      </div>

      {/* Pagination Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center space-x-2">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="h-10 w-10 bg-gray-200 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
} 