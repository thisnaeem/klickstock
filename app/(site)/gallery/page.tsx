import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/prisma";
import { Download, Eye, Search } from "lucide-react";

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const searchQuery = searchParams.q || "";

  // Fetch all approved items with optional search filter
  const approvedItems = await db.contributorItem.findMany({
    where: { 
      status: "APPROVED",
      OR: searchQuery ? [
        { title: { contains: searchQuery, mode: 'insensitive' } },
        { description: { contains: searchQuery, mode: 'insensitive' } },
        { tags: { has: searchQuery } }
      ] : undefined
    },
    orderBy: [
      { views: 'desc' },
      { createdAt: 'desc' }
    ],
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Image Gallery</h1>
        <p className="mt-2 text-lg text-gray-600">
          Browse through our collection of beautiful images
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <form action="/gallery" className="flex max-w-xl">
          <div className="relative flex-grow">
            <input
              type="text"
              name="q"
              defaultValue={searchQuery}
              placeholder="Search for images..."
              className="w-full px-6 py-4 rounded-full border-0 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white"
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

      {/* Filters and sorting (can be expanded later) */}
      <div className="flex flex-wrap gap-4 mb-8 pb-4 border-b">
        <div className="bg-white rounded-full px-4 py-2 text-sm font-medium border shadow-sm">
          Most Popular
        </div>
        <div className="rounded-full px-4 py-2 text-sm font-medium text-gray-600 hover:bg-white hover:shadow-sm hover:border cursor-pointer">
          Newest
        </div>
        <div className="rounded-full px-4 py-2 text-sm font-medium text-gray-600 hover:bg-white hover:shadow-sm hover:border cursor-pointer">
          Most Downloaded
        </div>
      </div>

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

      {approvedItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {approvedItems.map((item) => (
            <div key={item.id} className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all">
              <Link href={`/gallery/${item.id}`} className="block aspect-square relative overflow-hidden">
                <Image 
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-70 transition-opacity flex items-end">
                  <div className="p-4 w-full">
                    <div className="flex justify-between text-white">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">{item.views || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="w-4 h-4" />
                        <span className="text-sm">{item.downloads || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                <div className="flex justify-between items-center mt-3">
                  <p className="text-xs text-gray-500">By {item.user.name || item.user.email.split('@')[0]}</p>
                  <Link href={`/gallery/${item.id}`} className="text-xs text-blue-600 hover:underline">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-lg font-medium text-gray-900">No images available yet</h3>
          <p className="mt-2 text-gray-500">Check back soon for new content</p>
        </div>
      )}
    </div>
  );
}