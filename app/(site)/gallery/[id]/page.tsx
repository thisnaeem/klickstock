import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/prisma";
import { 
  ArrowLeft,
  Calendar, 
  Tag
} from "lucide-react";
import { ImageDetailActions } from "@/components/gallery/ImageDetailActions";

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

export default async function ImageDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  
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
    take: 4
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/gallery" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Gallery
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Image Column */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <div className="aspect-[4/3] relative">
              <Image 
                src={image.imageUrl}
                alt={image.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
                className="object-contain bg-gray-50"
              />
            </div>
          </div>
        </div>
        
        {/* Details Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{image.title}</h1>
            
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative">
                {image.user.image ? (
                  <Image 
                    src={image.user.image}
                    alt={image.user.name || "User"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 text-xl font-bold">
                    {(image.user.name || image.user.email)[0].toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium">{image.user.name || image.user.email.split('@')[0]}</p>
                <Link href={`/creator/${image.user.id}`} className="text-sm text-blue-600 hover:underline">
                  View all resources
                </Link>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">{image.description}</p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Published {new Date(image.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Tag className="w-4 h-4 mr-2" />
                <span>{image.license}</span>
              </div>
            </div>
            
            {/* Tags */}
            {image.tags && image.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {image.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <ImageDetailActions 
              imageId={image.id} 
              imageUrl={image.imageUrl} 
              title={image.title}
              currentDownloads={image.downloads || 0}
              currentViews={image.views || 0}
            />
          </div>
        </div>
      </div>
      
      {/* More from this contributor */}
      {relatedImages.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">More from this contributor</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedImages.map((item) => (
              <Link 
                key={item.id} 
                href={`/gallery/${item.id}`}
                className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all"
              >
                <div className="aspect-square relative overflow-hidden">
                  <Image 
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 30vw, 25vw"
                    className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
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