"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ImageWithPatternProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  isPNG?: boolean;
  imageType?: string;
  showResolution?: boolean;
}

export function ImageWithPattern({
  src,
  alt,
  fill = false,
  width,
  height,
  className,
  sizes,
  priority = false,
  quality,
  isPNG,
  imageType,
  showResolution = false,
  ...props
}: ImageWithPatternProps) {
  // Determine if the image is PNG based on props or file extension
  const [shouldShowPattern, setShouldShowPattern] = useState<boolean>(
    isPNG || imageType === "PNG" || src?.toLowerCase().endsWith(".png")
  );
  
  const [imageResolution, setImageResolution] = useState<string>("");

  // Get image resolution
  useEffect(() => {
    if (showResolution && typeof window !== 'undefined') {
      const imgElement = document.createElement('img');
      imgElement.onload = () => {
        setImageResolution(`${imgElement.width} × ${imgElement.height}`);
      };
      imgElement.src = src;
    }
  }, [src, showResolution]);

  // Prevent right-click context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  return (
    <div className={cn("relative", className)} onContextMenu={handleContextMenu}>
      {shouldShowPattern && (
        <div 
          className="absolute inset-0 bg-[length:16px_16px] bg-[linear-gradient(45deg,#f0f0f0_25%,transparent_25%,transparent_75%,#f0f0f0_75%,#f0f0f0),linear-gradient(45deg,#f0f0f0_25%,transparent_25%,transparent_75%,#f0f0f0_75%,#f0f0f0)]" 
          style={{ 
            backgroundPosition: "0 0, 8px 8px",
            backgroundSize: "16px 16px",
            backgroundRepeat: "repeat"
          }}
        />
      )}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={cn("object-contain pointer-events-none", className)}
        sizes={sizes}
        priority={priority}
        quality={quality}
        unoptimized={shouldShowPattern}
        {...props}
      />
      
      {showResolution && imageResolution && (
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
          {imageResolution}
        </div>
      )}
    </div>
  );
} 