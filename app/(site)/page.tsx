import { Sparkles, ArrowRight, Search, Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/prisma";
import { ImageWithPattern } from "@/components/ui/image-with-pattern";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

// Import SimpleCarousel dynamically to prevent hydration errors

const SimpleCarousel = dynamic(() => import("../../components/site/SimpleCarousel"), {
  ssr: true,
  loading: () => (
    <div className="relative overflow-hidden rounded-2xl bg-gray-900/60 border border-gray-800/50">
      <div className="h-[360px] md:h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    </div>
  )
});

// Define the interface locally
interface CarouselImage {
  id: string;
  imageUrl: string;
  previewUrl: string;
  title: string;
  imageType: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  views: number;
}

export default async function HomePage() {
  // Fetch approved contributor items
  let approvedItems: CarouselImage[] = [];
  try {
    const fetchedItems = await db.contributorItem.findMany({
      where: { 
        status: "APPROVED" 
      },
      orderBy: [
        { views: 'desc' },
        { createdAt: 'desc' }
      ],
      take: 12, // Increased to have more items for the carousel
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
    
    // Validate received items and convert to CarouselImage type
    approvedItems = fetchedItems
      .filter(item => 
        item && item.imageUrl && typeof item.imageUrl === 'string' && 
        item.id && item.title
      )
      .map(item => ({
        id: item.id,
        imageUrl: item.imageUrl,
        previewUrl: item.previewUrl,
        title: item.title,
        imageType: item.imageType,
        user: {
          id: item.user.id,
          name: item.user.name,
          email: item.user.email
        },
        views: item.views
      }));
    
    console.log(`Loaded ${approvedItems.length} approved items for carousel`);
  } catch (error) {
    console.error("Error fetching approved items:", error);
    // Provide empty array if items couldn't be fetched
    approvedItems = [];
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <div className="relative text-white py-24 md:py-32 overflow-hidden">
        {/* Pexels background image with overlay */}
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            <Image
              src="https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg"
              alt="Creative background"
              fill
              priority
              sizes="100vw"
              className="object-cover"
              unoptimized={true}
            />
            <div className="absolute inset-0 bg-gray-950/80"></div>
          </div>
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-10"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-block mb-6 bg-gradient-to-r from-indigo-600/20 to-indigo-800/20 backdrop-blur-xl rounded-full px-4 py-1 border border-indigo-600/30">
            <span className="text-indigo-300 text-sm font-medium">Premium Creative Resources</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
            Elevate Your Creative Projects
          </h1>
          
          <p className="text-xl text-indigo-200 mb-10 max-w-3xl mx-auto">
            Discover high-quality images, graphics, and assets for your next masterpiece
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <form action="/gallery" className="flex">
              <div className="relative flex-grow">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 p-0.5 blur-[0px]"></div>
                <input
                  type="text"
                  name="q"
                  placeholder="Search for images..."
                  className="w-full px-6 py-4 rounded-full text-white bg-gray-900/90 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 relative z-10 border border-gray-800"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 h-[calc(100%-0.75rem)] px-6 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all hover:scale-[1.02] z-10 gap-2 font-medium"
                >
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </button>
              </div>
            </form>
          </div>
          
          {/* Modern Image Carousel with controls */}
          <div className="mt-16 max-w-6xl mx-auto">
            <SimpleCarousel items={approvedItems} />
          </div>
        </div>
      </div>
      
      {/* Popular Resources */}
      <section className="py-20 bg-gradient-to-b from-gray-950 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <div className="text-sm font-medium text-indigo-400 mb-2">TRENDING NOW</div>
              <h2 className="text-3xl font-bold text-white">Popular Resources</h2>
              <p className="mt-4 text-lg text-gray-400">
                Discover trending assets our community loves
              </p>
            </div>
            <Link href="/gallery" className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center px-4 py-2 rounded-lg border border-gray-800 bg-gray-900/50 transition-colors group">
              View all <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"/>
            </Link>
          </div>
          
          {approvedItems.length > 0 ? (
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
              {approvedItems.slice(0, 20).map((item, index) => {
                // Create varying heights for better masonry effect
                const aspectRatio = [
                  'aspect-square', // 1:1
                  'aspect-[3/4]',  // Portrait
                  'aspect-[4/3]',  // Landscape
                  'aspect-[2/3]',  // Tall portrait
                  'aspect-[16/9]'  // Widescreen
                ][index % 5];
                
                // Staggered animation delay based on index
                const animationDelay = `${(index % 6) * 0.05}s`;

                return (
                  <div 
                    key={item.id} 
                    className="break-inside-avoid mb-6 transform hover:-translate-y-1 transition-all duration-300 opacity-0 animate-fade-in"
                    style={{ animationDelay, animationFillMode: 'forwards' }}
                  >
                    <div className="group rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all bg-gray-900/60 border border-gray-800/50 hover:border-indigo-500/50 backdrop-blur-sm">
                      <Link 
                        href={`/gallery/${item.id}`} 
                        className="block relative overflow-hidden" 
                      >
                        <div className={`${aspectRatio} w-full relative`}>
                          {/* Add checkered background for PNG images */}
                          {item.imageType?.toUpperCase() === 'PNG' && (
                            <div className="absolute inset-0 bg-[url('/transparent-checkerboard.svg')] bg-repeat bg-[length:20px_20px] opacity-10"></div>
                          )}
                          <Image 
                            src={item.previewUrl || item.imageUrl}
                            alt={item.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out pointer-events-none"
                            unoptimized={true}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300"/>
                          
                          {/* Image type badge */}
                          {item.imageType && (
                            <div className={`absolute top-2 left-2 ${
                              item.imageType.toUpperCase() === 'PNG' 
                                ? 'bg-indigo-900/70 text-indigo-300' 
                                : 'bg-gray-900/70 text-gray-300'
                              } text-xs py-0.5 px-2 rounded-md backdrop-blur-sm flex items-center gap-1`}>
                              {item.imageType.toUpperCase() === 'PNG' && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5h16M4 12h16M4 19h16" />
                                </svg>
                              )}
                              {item.imageType}
                            </div>
                          )}
                          
                          <div className="absolute bottom-3 right-3 bg-indigo-600 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hover:bg-indigo-500">
                            <Download className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </Link>
                      <div className="p-4">
                        <h3 className="font-medium text-white group-hover:text-indigo-400 transition-colors truncate">
                          {item.title}
                        </h3>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-sm text-gray-400 truncate max-w-[150px]">
                            By <Link href={`/creator/${item.user.id}`} className="hover:text-indigo-400 hover:underline">
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
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-900/50 rounded-xl border border-gray-800 p-8">
              <p className="text-gray-400">No approved images available yet.</p>
              <Link href="/contributor/upload" className="mt-4 text-indigo-400 hover:text-indigo-300 hover:underline inline-block">
                Submit your content
              </Link>
            </div>
          )}
        </div>
      </section>
      
      {/* Call to action */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gray-900"></div>
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500 rounded-full filter blur-[120px] opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-purple-500 rounded-full filter blur-[120px] opacity-15"></div>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700/50 rounded-2xl p-10 shadow-xl">
            <div className="inline-flex items-center gap-2 bg-indigo-900/40 rounded-full px-4 py-1 border border-indigo-700/30 mb-6">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-indigo-300 text-sm font-medium">Unlock your creative potential</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to create something amazing?</h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join our community of creators and discover premium resources for your next project
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="group">
                <Button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all">
                  Sign up for free
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/gallery" className="group">
                <Button variant="outline" className="w-full sm:w-auto px-8 py-4 bg-transparent text-white hover:bg-gray-800 border-gray-700 hover:border-gray-600 rounded-xl font-medium transition-colors">
                  Explore resources
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}