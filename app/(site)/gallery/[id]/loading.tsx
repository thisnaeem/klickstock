"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function ImageDetailLoading() {
  return (
    <div className="min-h-screen bg-black text-white animate-fade-in">
      {/* Top navigation with breadcrumbs */}
      <div className="border-b border-gray-800/50 py-4">
        <div className="w-full px-6 lg:px-8">
          <div className="flex items-center space-x-2">
            <Link 
              href="/gallery" 
              className="bg-gray-800/80 hover:bg-gray-700 text-gray-200 hover:text-white transition-all 
                         text-sm font-medium py-2.5 px-5 rounded-full flex items-center 
                         shadow-md hover:shadow-lg"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Gallery
            </Link>
          </div>
        </div>
      </div>
      
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Title and description skeleton */}
        <div className="space-y-3 mb-6">
          <div className="h-9 bg-gray-800/60 rounded-lg w-2/3 max-w-md animate-pulse"></div>
          <div className="h-4 bg-gray-800/40 rounded-md w-full max-w-lg animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Image Column Skeleton */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main Image Skeleton */}
            <div className="rounded-xl overflow-hidden bg-gray-900/60 border border-gray-800/50 shadow-lg">
              <div className="relative">
                {/* Skeleton for the main image container */}
                <div className="aspect-[4/3] flex items-center justify-center relative bg-gray-800/40">
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {/* Shimmer effect that moves across the skeleton */}
                    <div className="relative w-full h-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-800/0 via-gray-700/10 to-gray-800/0 animate-shimmer" 
                           style={{backgroundSize: '200% 100%', animation: 'shimmer 2s infinite'}}></div>
                    </div>
                    {/* Loading indicator in the center */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-16 h-16">
                        {/* Outer spinning ring */}
                        <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500/80 animate-spin"></div>
                        
                        {/* Inner spinning ring (opposite direction) */}
                        <div className="absolute inset-[4px] rounded-full border-4 border-t-purple-500/80 border-r-transparent border-b-purple-500/20 border-l-transparent animate-spin animation-direction-reverse animation-delay-150"></div>
                        
                        {/* Center logo placeholder */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Similar Content Skeleton */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <div className="h-7 bg-gray-800/60 rounded-lg w-40 animate-pulse"></div>
                <div className="h-5 bg-gray-800/40 rounded-lg w-24 animate-pulse"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-auto">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div 
                    key={index} 
                    className="aspect-[4/3] rounded-lg bg-gray-800/50 animate-pulse"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar Skeleton */}
          <div>
            {/* Details Card Skeleton */}
            <div className="rounded-xl overflow-hidden bg-gray-900/60 border border-gray-800/50 shadow-lg">
              {/* User info section */}
              <div className="p-6 bg-gray-900/80">
                {/* Author info skeleton */}
                <div className="flex items-center space-x-3 mb-6">
                  <div className="h-12 w-12 rounded-full bg-gray-800/70 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-800/60 rounded-md w-32 animate-pulse"></div>
                    <div className="h-3 bg-gray-800/40 rounded-md w-24 animate-pulse"></div>
                  </div>
                </div>
                
                {/* Download button skeleton */}
                <div className="space-y-4">
                  <div className="h-14 bg-gradient-to-r from-indigo-600/40 to-purple-600/40 rounded-full animate-pulse"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-10 bg-gray-800/50 rounded-full animate-pulse"></div>
                    <div className="h-10 bg-gray-800/50 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
              
              {/* Image details section */}
              <div className="border-t border-gray-800/50 px-6 py-5 bg-gray-900/60 space-y-4">
                {/* License, file type, and category skeletons */}
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="w-1/3 h-4 bg-gray-800/40 rounded-md animate-pulse"></div>
                    <div className="w-2/3 h-4 bg-gray-800/60 rounded-md animate-pulse ml-2"></div>
                  </div>
                ))}
                
                {/* Tags section skeleton */}
                <div className="border-t border-gray-800/30 pt-4 mt-4">
                  <div className="h-5 bg-gray-800/60 rounded-md w-20 mb-3 animate-pulse"></div>
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div 
                        key={index} 
                        className="h-8 w-20 bg-gray-800/50 rounded-full animate-pulse"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      ></div>
                    ))}
                  </div>
                </div>
                
                {/* Legal Info skeleton */}
                <div className="border-t border-gray-800/30 pt-4 mt-4 space-y-2">
                  <div className="h-3 bg-gray-800/40 rounded-md w-full animate-pulse"></div>
                  <div className="h-3 bg-gray-800/40 rounded-md w-1/2 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* More from this creator skeleton */}
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <div className="h-7 bg-gray-800/60 rounded-lg w-48 animate-pulse"></div>
                <div className="h-5 bg-gray-800/40 rounded-lg w-20 animate-pulse"></div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-auto">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div 
                    key={index} 
                    className="aspect-[4/3] rounded-lg bg-gray-800/50 animate-pulse"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 