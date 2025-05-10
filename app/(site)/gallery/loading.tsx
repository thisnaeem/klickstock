import { GallerySkeleton } from "@/components/gallery/GallerySkeleton";

export default function GalleryLoading() {
  return (
    <div className="bg-black min-h-screen">
      {/* Search bar skeleton */}
      <div className="w-full bg-black border-b border-gray-800/50">
        <div className="w-full px-6 py-5">
          <div className="relative w-full">
            <div className="w-full py-4 pl-8 pr-10 text-lg text-white bg-black border-0 h-12 animate-pulse rounded-md" />
          </div>
        </div>
      </div>
      
      <div className="border-b border-gray-800/50">
        {/* Empty space where filters would be */}
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar skeleton */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="p-4">
            <div className="animate-pulse">
              {/* Category header */}
              <div className="h-6 w-24 bg-gray-800/50 rounded mb-4" />
              
              {/* Category filters */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="mb-3 flex items-center">
                  <div className="h-5 w-5 bg-gray-800/50 rounded-sm mr-3" />
                  <div className="h-4 w-24 bg-gray-800/50 rounded" />
                </div>
              ))}
              
              {/* Image type header */}
              <div className="h-6 w-20 bg-gray-800/50 rounded mt-6 mb-4" />
              
              {/* Image type filters */}
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="mb-3 flex items-center">
                  <div className="h-5 w-5 bg-gray-800/50 rounded-sm mr-3" />
                  <div className="h-4 w-16 bg-gray-800/50 rounded" />
                </div>
              ))}
              
              {/* AI status header */}
              <div className="h-6 w-28 bg-gray-800/50 rounded mt-6 mb-4" />
              
              {/* AI status filters */}
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="mb-3 flex items-center">
                  <div className="h-5 w-5 bg-gray-800/50 rounded-sm mr-3" />
                  <div className="h-4 w-32 bg-gray-800/50 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main content / gallery grid */}
        <div className="flex-1 p-4">
          <GallerySkeleton />
        </div>
      </div>
    </div>
  );
} 