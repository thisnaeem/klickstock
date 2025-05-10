"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ImageWithPattern } from "@/components/ui/image-with-pattern";

export interface CarouselImage {
  id: string;
  imageUrl: string;
  title: string;
  imageType?: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

export function ImageCarousel({ images }: { images: CarouselImage[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [fallbackMode, setFallbackMode] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Make sure we have images and use fallbacks if needed
  useEffect(() => {
    // Check if images array is valid
    if (!images || images.length === 0) {
      console.error("No images provided to carousel");
      setFallbackMode(true);
      return;
    }
    
    // Check if all images have valid URLs
    const hasValidUrls = images.every(img => img.imageUrl && typeof img.imageUrl === 'string');
    if (!hasValidUrls) {
      console.error("Some images have invalid URLs");
      setFallbackMode(true);
    }
    
    // Set images as loaded
    setImagesLoaded(true);
  }, [images]);
  
  // Limit to display maximum 5 images in pagination
  const paginationImages = images && images.length > 0 ? images.slice(0, 5) : [];
  
  const nextSlide = () => {
    if (isAnimating || paginationImages.length === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex === paginationImages.length - 1 ? 0 : prevIndex + 1));
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  const prevSlide = () => {
    if (isAnimating || paginationImages.length === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? paginationImages.length - 1 : prevIndex - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  useEffect(() => {
    if (paginationImages.length === 0) return;
    
    autoPlayRef.current = setTimeout(() => {
      nextSlide();
    }, 5000);
    
    return () => {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current);
      }
    };
  }, [currentIndex, paginationImages.length]);
  
  // If we have no images, display placeholder content
  if (fallbackMode || paginationImages.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gray-900/60 border border-gray-800/50">
        <div className="h-[360px] md:h-[400px] flex items-center justify-center">
          <div className="text-center p-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-900/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-white mb-2">Image Gallery</h3>
            <p className="text-gray-400 max-w-md mx-auto">Explore our collection of premium assets for your creative projects</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Pre-calculate visible images to prevent layout shifts
  const visibleImages = [
    paginationImages[(currentIndex - 1 + paginationImages.length) % paginationImages.length],
    paginationImages[currentIndex],
    paginationImages[(currentIndex + 1) % paginationImages.length],
    paginationImages[(currentIndex + 2) % paginationImages.length]
  ].filter(Boolean); // Filter out any undefined images
  
  // Only render when images are loaded
  if (!imagesLoaded) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gray-900/60 border border-gray-800/50">
        <div className="h-[360px] md:h-[400px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Carousel Controls */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-gray-900/60 hover:bg-gray-900/80 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all backdrop-blur-sm border border-gray-700/50"
        aria-label="Previous image"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-gray-900/60 hover:bg-gray-900/80 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all backdrop-blur-sm border border-gray-700/50"
        aria-label="Next image"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      {/* Fixed height container to prevent layout shifts */}
      <div 
        ref={containerRef} 
        className="h-[360px] md:h-[400px] relative flex items-center justify-center overflow-hidden bg-gray-900/60 border border-gray-800/50"
      >
        {/* Main Carousel */}
        <div className="flex gap-4 transition-all duration-500 ease-in-out px-4">
          {visibleImages.map((image, index) => {
            const isActive = index === 1;
            return (
              <Link 
                href={`/gallery/${image.id}`}
                key={image.id} 
                className={`relative overflow-hidden rounded-xl group 
                  transition-all duration-500 transform h-[300px] md:h-[350px]
                  ${isActive 
                    ? 'w-[280px] md:w-[400px] shadow-xl z-10 scale-105 border-2 border-indigo-500/50' 
                    : 'w-[200px] md:w-[280px] opacity-50 hover:opacity-80 border border-gray-700/30'
                  }`}
              >
                <div className="absolute inset-0 bg-gray-800">
                  {/* Fallback to regular Image component if ImageWithPattern causes issues */}
                  {image.imageType ? (
                    <ImageWithPattern
                      src={image.imageUrl}
                      alt={image.title}
                      fill
                      sizes="(max-width: 768px) 280px, 400px"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      imageType={image.imageType}
                    />
                  ) : (
                    <Image
                      src={image.imageUrl}
                      alt={image.title}
                      fill
                      sizes="(max-width: 768px) 280px, 400px"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={() => console.error(`Failed to load image: ${image.imageUrl}`)}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent opacity-60"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-medium text-lg truncate">
                    {image.title}
                  </h3>
                  {isActive && (
                    <p className="text-sm text-gray-300 mt-1 line-clamp-1">
                      By {image.user.name || image.user.email.split('@')[0]}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* Modern Pagination Indicators */}
      <div className="flex justify-center mt-6 gap-2">
        {paginationImages.map((_, index: number) => (
          <button
            key={index}
            onClick={() => {
              setIsAnimating(true);
              setCurrentIndex(index);
              setTimeout(() => setIsAnimating(false), 500);
            }}
            aria-label={`Go to slide ${index + 1}`}
            className={`relative h-1.5 transition-all duration-300 ${
              index === currentIndex
                ? 'w-10 bg-indigo-500' 
                : 'w-5 bg-gray-600 hover:bg-gray-500'
            } rounded-full overflow-hidden`}
          >
            {index === currentIndex && (
              <span 
                className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse"
                style={{ animationDuration: '1.5s' }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
} 