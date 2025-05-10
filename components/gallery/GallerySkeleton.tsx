export function GallerySkeleton() {
  return (
    <div className="animate-pulse">
      {/* Sort buttons skeleton */}
      <div className="mb-6 flex flex-wrap gap-3">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className="w-32 h-11 bg-gray-800/50 rounded-full"
          />
        ))}
      </div>

      {/* Gallery items skeleton */}
      <div className="columns-1 sm:columns-2 lg:columns-3 2xl:columns-4 gap-6 space-y-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="break-inside-avoid mb-6">
            <div className="bg-gray-900/60 rounded-xl overflow-hidden shadow border border-gray-800/50 relative">
              {/* Image placeholder */}
              <div className="aspect-square w-full bg-gray-800/50" />
              
              {/* Content placeholder */}
              <div className="p-4 border-t border-gray-800/50">
                {/* Title placeholder */}
                <div className="h-5 w-3/4 bg-gray-800/50 rounded mb-3" />
                
                {/* Metadata placeholders */}
                <div className="flex justify-between items-center">
                  <div className="h-4 w-1/3 bg-gray-800/50 rounded" />
                  <div className="h-4 w-10 bg-gray-800/50 rounded" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 