import { Sparkles, ArrowRight, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/prisma";

export default async function HomePage() {
  // Fetch approved contributor items
  const approvedItems = await db.contributorItem.findMany({
    where: { 
      status: "APPROVED" 
    },
    orderBy: [
      { views: 'desc' },
      { createdAt: 'desc' }
    ],
    take: 8,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Discover Premium Creative Resources
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Find high-quality images for your next creative project
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <form action="/gallery" className="flex">
              <div className="relative flex-grow">
                <input
                  type="text"
                  name="q"
                  placeholder="Search for images..."
                  className="w-full px-6 py-4 rounded-full text-gray-800 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 h-[calc(100%-0.5rem)] aspect-square flex items-center justify-center rounded-full bg-blue-800 hover:bg-blue-900 transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
          
          <Link href="/gallery" className="px-8 py-4 bg-white text-blue-600 rounded-full font-medium shadow-lg hover:shadow-xl transition-all inline-block">
            Explore Gallery
          </Link>
        </div>
      </div>
      
      {/* Popular Resources */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Popular Resources</h2>
              <p className="mt-4 text-lg text-gray-600">
                Discover trending assets our community loves
              </p>
            </div>
            <Link href="/gallery" className="text-blue-600 font-medium flex items-center">
              View all <ArrowRight className="ml-2 w-4 h-4"/>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {approvedItems.length > 0 ? (
              approvedItems.map((item) => (
                <div key={item.id} className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all">
                  <Link href={`/gallery/${item.id}`} className="block aspect-square relative overflow-hidden">
                    <Image 
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-50 transition-opacity"/>
                    <div className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                    </div>
                  </Link>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                      {item.title}
                    </h3>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-gray-500">
                        By <Link href={`/creator/${item.user.id}`} className="hover:text-blue-600 hover:underline">
                          {item.user.name || item.user.email.split('@')[0]}
                        </Link>
                      </p>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <span>{item.views || 0}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                          <path d="M12 9.5a2.5 2.5 0 0 0 0 5 2.5 2.5 0 0 0 0-5z"/>
                          <path d="M12 15a5.5 5.5 0 0 1-5.5-5.5 5.5 5.5 0 0 1 11 0A5.5 5.5 0 0 1 12 15zm0-13C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No approved images available yet.</p>
                <Link href="/contributor/upload" className="mt-2 text-blue-600 hover:underline inline-block">
                  Submit your content
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Call to action */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to create something amazing?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Join our community of creators and discover premium resources
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="px-8 py-4 bg-blue-600 text-white rounded-lg font-medium shadow-lg hover:bg-blue-700 transition-all">
              Sign up for free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}