"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function SearchBar() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const imageType = searchParams.get("imageType") || "";
  const aiGenerated = searchParams.get("aiGenerated") || "";
  const sort = searchParams.get("sort") || "";

  return (
    <div className="w-full bg-black border-b border-gray-800/50">
      <div className="w-full px-6 py-6">
        <div className="relative w-full">
          <form action="/gallery" method="GET" className="w-full">
            <div className="relative flex items-center">
              <Search className="absolute left-2 w-6 h-6 text-gray-400 stroke-[1.5px]" />
              <input
                type="text"
                name="q"
                defaultValue={searchQuery}
                placeholder="Search Images and Pngs..."
                className="w-full py-4 pl-12 pr-14 text-xl text-white bg-black border-0 focus:ring-0 focus:outline-none placeholder:text-gray-500"
              />
              
              {/* Cross button with grey rounded border even when not hovering */}
              <Link 
                href="/" 
                className="absolute right-0 p-2.5 rounded-full text-gray-300 border border-gray-700 hover:bg-gray-800 hover:text-white hover:border-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </Link>
            </div>
            {/* Preserve other filter parameters */}
            {category && <input type="hidden" name="category" value={category} />}
            {imageType && <input type="hidden" name="imageType" value={imageType} />}
            {aiGenerated && <input type="hidden" name="aiGenerated" value={aiGenerated} />}
            {sort && <input type="hidden" name="sort" value={sort} />}
          </form>
        </div>
      </div>
    </div>
  );
} 