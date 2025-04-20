import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/prisma";
import { 
  Download, 
  Eye, 
  Search, 
  Grid, 
  ArrowLeft, 
  CheckCircle2,
  SortAsc
} from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "downloads", label: "Most Downloaded" },
];

export default async function CreatorProfilePage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ 
    q?: string;
    sort?: string;
  }>
}) {
  const { id } = await params;
  const { q, sort } = await searchParams;
  const searchQuery = q || "";
  const sortOption = sort || "popular";
  
  // Fetch the contributor
  const contributor = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          contributorItems: {
            where: { status: "APPROVED" }
          }
        }
      }
    }
  });
  
  // If user not found, return 404
  if (!contributor) {
    notFound();
  }

  // Fetch the contributor's stats
  const contributorStats = await db.contributorItem.aggregate({
    where: {
      userId: id,
      status: "APPROVED"
    },
    _sum: {
      downloads: true,
      views: true
    }
  });

  const totalDownloads = contributorStats._sum.downloads || 0;
  const totalViews = contributorStats._sum.views || 0;
  
  // Fetch the contributor's approved items
  const approvedItems = await db.contributorItem.findMany({
    where: { 
      userId: id,
      status: "APPROVED",
      // Title, description, or tags contains search query
      ...(searchQuery ? {
        OR: [
          { title: { contains: searchQuery, mode: 'insensitive' } },
          { description: { contains: searchQuery, mode: 'insensitive' } },
          { tags: { has: searchQuery } }
        ]
      } : {})
    },
    orderBy: sortOption === "newest" 
      ? [{ createdAt: 'desc' }] 
      : sortOption === "downloads" 
        ? [{ downloads: 'desc' }] 
        : [{ views: 'desc' }, { createdAt: 'desc' }]
  });

  // Function to generate sort URL with updated params
  const getSortUrl = (value: string) => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('q', searchQuery);
    if (value !== 'popular') params.set('sort', value);
    
    return `/creator/${id}?${params.toString()}`;
  };

  // Function to check if a sort option is active
  const isSortActive = (value: string) => {
    return sortOption === value;
  };

  // Format the contributor name for display
  const displayName = contributor.name || contributor.email.split('@')[0];
  
  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen">
        {/* Hero section with contributor info */}
        <div className="bg-blue-50 py-12 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/gallery" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-6">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Gallery
            </Link>
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Contributor avatar */}
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-200 overflow-hidden relative flex-shrink-0">
                {contributor.image ? (
                  <Image 
                    src={contributor.image}
                    alt={displayName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 text-4xl font-bold">
                    {displayName[0].toUpperCase()}
                  </div>
                )}
              </div>
              
              {/* Contributor info */}
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900">{displayName}</h1>
                
                {contributor.role === "CONTRIBUTOR" && (
                  <div className="inline-flex items-center mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-sm">
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Verified Contributor
                  </div>
                )}
                
                <p className="text-gray-600 mt-2">
                  Member since {new Date(contributor.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                
                <div className="flex flex-wrap gap-6 mt-4">
                  <div className="flex items-center">
                    <Grid className="w-5 h-5 text-gray-500 mr-2" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{contributor._count.contributorItems}</p>
                      <p className="text-sm text-gray-600">Resources</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Download className="w-5 h-5 text-gray-500 mr-2" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{totalDownloads.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Downloads</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Eye className="w-5 h-5 text-gray-500 mr-2" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Views</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and sort controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            {/* Search */}
            <form action={`/creator/${id}`} className="w-full md:w-auto">
              <div className="relative">
                <input
                  type="text"
                  name="q"
                  defaultValue={searchQuery}
                  placeholder="Search resources..."
                  className="px-4 py-2 pr-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
            
            {/* Sort options */}
            <div className="flex flex-wrap items-center">
              <span className="text-sm text-gray-500 mr-3">Sort by:</span>
              <div className="flex flex-wrap gap-2">
                {SORT_OPTIONS.map((option) => (
                  <Link
                    key={option.value}
                    href={getSortUrl(option.value)}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                      isSortActive(option.value)
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          {/* Results count */}
          <div className="mb-6">
            <p className="text-gray-600">
              {approvedItems.length} resources
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>
          
          {/* Image grid */}
          {approvedItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {approvedItems.map((item) => (
                <div key={item.id} className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
                  <Link href={`/gallery/${item.id}`} className="block aspect-square relative overflow-hidden">
                    <Image 
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 16vw"
                      className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* AI badge */}
                    {item.aiGeneratedStatus === 'AI_GENERATED' && (
                      <div className="absolute top-2 left-2 bg-purple-100 border border-purple-200 text-purple-700 text-xs px-2 py-0.5 rounded">
                        AI Generated
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity flex flex-col justify-end">
                      <div className="p-4 w-full">
                        <div className="flex justify-between text-white mb-2">
                          <div className="flex items-center space-x-1 text-xs bg-black bg-opacity-50 px-2 py-1 rounded-full">
                            <Eye className="w-3 h-3" />
                            <span>{item.views || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs bg-black bg-opacity-50 px-2 py-1 rounded-full">
                            <Download className="w-3 h-3" />
                            <span>{item.downloads || 0}</span>
                          </div>
                        </div>
                        <h3 className="text-white font-medium truncate">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                  <div className="p-3">
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                      
                      {/* File type badge */}
                      <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-100 rounded">
                        {item.imageType || 'JPG'}
                      </span>
                    </div>
                    
                    {/* Tags/keywords */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.tags.slice(0, 2).map((tag, index) => (
                          <Link 
                            key={index} 
                            href={`/creator/${id}?q=${tag}`}
                            className="text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </Link>
                        ))}
                        {item.tags.length > 2 && (
                          <span className="text-xs text-gray-600 px-1">
                            +{item.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-2">No resources found</h3>
              {searchQuery ? (
                <>
                  <p className="text-gray-500 mb-4">Try adjusting your search terms</p>
                  <Link 
                    href={`/creator/${id}`} 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
                  >
                    View all resources
                  </Link>
                </>
              ) : (
                <p className="text-gray-500">This contributor has not published any resources yet</p>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
} 