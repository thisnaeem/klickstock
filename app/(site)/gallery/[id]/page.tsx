import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/prisma";
import { 
  ArrowLeft,
  Calendar, 
  Tag,
  Download,
  Eye,
  UserCircle2,
  ShieldCheck,
  FileType,
  Palette
} from "lucide-react";
import { ImageDetailActions } from "@/components/gallery/ImageDetailActions";
import { Badge } from "@/components/ui/badge";
import { ImageWithPattern } from "@/components/ui/image-with-pattern";

// Server action to increment view count
async function incrementViewCount(id: string) {
  'use server';
  
  await db.contributorItem.update({
    where: { id },
    data: {
      views: { increment: 1 }
    }
  });
}

export default async function ImageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Increment view count
  await incrementViewCount(id);
  
  // Fetch the image details
  const image = await db.contributorItem.findUnique({
    where: { 
      id,
      status: "APPROVED" // Only show approved images
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      }
    }
  });
  
  // If image not found or not approved, return 404
  if (!image) {
    notFound();
  }
  
  // Fetch related images by the same user
  const relatedImages = await db.contributorItem.findMany({
    where: {
      userId: image.userId,
      status: "APPROVED",
      id: { not: image.id } // Exclude current image
    },
    orderBy: { createdAt: 'desc' },
    take: 6
  });
  
  // Also fetch similar images by category or tags
  const similarImages = await db.contributorItem.findMany({
    where: {
      id: { not: image.id }, // Exclude current image
      status: "APPROVED",
      OR: [
        { category: image.category },
        { tags: { hasSome: image.tags } }
      ]
    },
    orderBy: { downloads: 'desc' },
    take: 6
  });

  // Format image type for display
  const imageType = image.imageType || 'JPG';
  const isAiGenerated = image.aiGeneratedStatus === 'AI_GENERATED';
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white">
      {/* Top navigation with breadcrumbs */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-sm">
          <Link href="/gallery" className="text-gray-500 hover:text-blue-600 transition-colors">
            Gallery
          </Link>
          <span className="text-gray-400">/</span>
          <Link 
            href={`/gallery?category=${image.category}`} 
            className="text-gray-500 hover:text-blue-600 transition-colors"
          >
            {image.category}
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-700 truncate max-w-[200px]">{image.title}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Image Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Image Display */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <div className="relative">
              {/* Download Count Badge */}
              <div className="absolute top-4 right-4 z-10 bg-black bg-opacity-70 text-white text-xs px-3 py-1.5 rounded-full flex items-center">
                <Download className="w-3.5 h-3.5 mr-1.5" />
                <span>{image.downloads || 0} downloads</span>
              </div>
              
              {/* AI Badge if applicable */}
              {isAiGenerated && (
                <div className="absolute top-4 left-4 z-10 bg-purple-100 border border-purple-200 text-purple-800 text-xs px-3 py-1.5 rounded-full">
                  AI Generated
                </div>
              )}
              
              {/* Main Image */}
              <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center relative">
                <ImageWithPattern 
                  src={image.imageUrl}
                  alt={image.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
                  className="object-contain h-full w-full"
                  imageType={imageType}
                />
              </div>
            </div>
          </div>
          
          {/* Image Description */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Description</h2>
            <p className="text-gray-700">{image.description || 'No description provided'}</p>
          </div>
          
          {/* Similar Content */}
          {similarImages.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Similar content</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {similarImages.map((item) => (
                  <Link 
                    key={item.id} 
                    href={`/gallery/${item.id}`}
                    className="group block aspect-square relative rounded-lg overflow-hidden"
                  >
                    <Image 
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 33vw, 20vw"
                      className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end">
                      <div className="p-3">
                        <p className="text-white text-xs font-medium line-clamp-2">
                          {item.title}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Image Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{image.title}</h1>
              
              {/* Author info with avatar */}
              <Link href={`/creator/${image.userId}`} className="flex items-center space-x-3 mb-6 group">
                <div className="h-10 w-10 rounded-full bg-gray-100 overflow-hidden relative flex-shrink-0">
                  {image.user.image ? (
                    <Image 
                      src={image.user.image}
                      alt={image.user.name || "Creator"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                      <UserCircle2 className="h-full w-full" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {image.user.name || image.user.email.split('@')[0]}
                  </p>
                  <p className="text-sm text-gray-500">View profile</p>
                </div>
              </Link>
              
              {/* Action Buttons */}
              <ImageDetailActions 
                imageId={image.id} 
                imageUrl={image.imageUrl} 
                title={image.title}
                currentDownloads={image.downloads || 0}
                currentViews={image.views || 0}
              />
            </div>
            
            {/* Image details section */}
            <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 space-y-4">
              <div className="flex">
                <div className="w-1/3 text-sm text-gray-500">License</div>
                <div className="w-2/3 text-sm text-gray-900 flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-2 text-emerald-500" />
                  {image.license || 'Standard License'}
                </div>
              </div>
              
              <div className="flex">
                <div className="w-1/3 text-sm text-gray-500">File type</div>
                <div className="w-2/3 text-sm text-gray-900 flex items-center">
                  <FileType className="w-4 h-4 mr-2 text-blue-500" />
                  {imageType}
                </div>
              </div>
              
              <div className="flex">
                <div className="w-1/3 text-sm text-gray-500">Resolution</div>
                <div className="w-2/3 text-sm text-gray-900 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-orange-500">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18" />
                    <path d="M9 21V9" />
                  </svg>
                  High Quality Image
                </div>
              </div>
              
              <div className="flex">
                <div className="w-1/3 text-sm text-gray-500">Category</div>
                <div className="w-2/3 text-sm text-gray-900">
                  <Link 
                    href={`/gallery?category=${image.category}`}
                    className="flex items-center hover:text-blue-600 transition-colors"
                  >
                    <Palette className="w-4 h-4 mr-2 text-purple-500" />
                    {image.category}
                  </Link>
                </div>
              </div>
              
              <div className="flex">
                <div className="w-1/3 text-sm text-gray-500">Date added</div>
                <div className="w-2/3 text-sm text-gray-900 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-amber-500" />
                  {new Date(image.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
          
          {/* Tags */}
          {image.tags && image.tags.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-base font-semibold text-gray-800 mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {image.tags.map((tag, index) => (
                  <Link 
                    key={index} 
                    href={`/gallery?q=${tag}`}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs transition-colors"
                  >
                    <Tag className="w-3 h-3 mr-1.5" />
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* Legal Info */}
          <div className="rounded-xl p-4 bg-gray-50 border border-gray-200 text-xs text-gray-500">
            <p className="mb-3">
              This resource can be used for personal and commercial projects with attribution.
            </p>
            <p>
              &copy; {new Date().getFullYear()} {image.user.name || 'Creator'} / KlickStock 
            </p>
          </div>
        </div>
      </div>
      
      {/* More from this contributor */}
      {relatedImages.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">More from this creator</h2>
            <Link href={`/creator/${image.userId}`} className="text-blue-600 hover:underline text-sm font-medium">
              View all
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {relatedImages.map((item) => (
              <Link 
                key={item.id} 
                href={`/gallery/${item.id}`}
                className="group bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="aspect-square relative overflow-hidden">
                  <Image 
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                    className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}