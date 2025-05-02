import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { PublishedItems } from "@/components/contributor/PublishedItems";
import { ContributorItemStatus } from "@prisma/client";

export default async function PublishedPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  // Fetch only APPROVED items uploaded by the user
  const publishedItems = await db.contributorItem.findMany({
    where: { 
      userId: session.user.id,
      status: ContributorItemStatus.APPROVED
    },
    orderBy: [
      { downloads: "desc" },
      { views: "desc" },
      { createdAt: "desc" }
    ],
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      imageUrl: true,
      createdAt: true,
      tags: true,
      downloads: true,
      views: true,
      license: true,
      category: true
    }
  });

  // Calculate total views and downloads
  const totalViews = publishedItems.reduce((sum, item) => sum + item.views, 0);
  const totalDownloads = publishedItems.reduce((sum, item) => sum + item.downloads, 0);

  return (
    <div className="space-y-6 min-h-screen pb-10">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-green-900/40 via-indigo-900/40 to-green-900/40 p-6 rounded-lg shadow-lg mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Published Content</h1>
        <p className="text-gray-300">
          Your approved content that is live on the platform
        </p>
      </div>

      {/* Stats Cards */}
      {publishedItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800/60 p-6 rounded-lg shadow-md border-l-4 border-indigo-500 hover:bg-gray-800/80 transition-colors">
            <div className="text-sm text-gray-400">Total Published</div>
            <div className="text-3xl font-bold text-white mt-1">{publishedItems.length}</div>
          </div>
          <div className="bg-gray-800/60 p-6 rounded-lg shadow-md border-l-4 border-green-500 hover:bg-gray-800/80 transition-colors">
            <div className="text-sm text-gray-400">Total Views</div>
            <div className="text-3xl font-bold text-white mt-1">{totalViews.toLocaleString()}</div>
          </div>
          <div className="bg-gray-800/60 p-6 rounded-lg shadow-md border-l-4 border-purple-500 hover:bg-gray-800/80 transition-colors">
            <div className="text-sm text-gray-400">Total Downloads</div>
            <div className="text-3xl font-bold text-white mt-1">{totalDownloads.toLocaleString()}</div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-gray-900/50 border border-gray-800/40 p-6 rounded-lg shadow-lg">
        {publishedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-green-900/30 text-green-400 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-200 mb-2">No Published Content Yet</h3>
            <p className="text-gray-400 mb-6 max-w-md">When your content is approved by our team, it will appear here. Keep submitting quality content for review.</p>
            <a 
              href="/contributor/upload" 
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              Upload New Content
            </a>
          </div>
        ) : (
          <PublishedItems items={publishedItems} />
        )}
      </div>
    </div>
  );
} 