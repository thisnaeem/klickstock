import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { UnderReviewItems } from "@/components/contributor/UnderReviewItems";
import { ContributorItemStatus } from "@prisma/client";

export default async function UnderReviewPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  // Fetch only PENDING items uploaded by the user
  const pendingItems = await db.contributorItem.findMany({
    where: { 
      userId: session.user.id,
      status: ContributorItemStatus.PENDING
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      imageUrl: true,
      createdAt: true,
      tags: true,
      downloads: true,
      views: true
    }
  });

  return (
    <div className="space-y-6 min-h-screen pb-10">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-indigo-900/40 p-6 rounded-lg shadow-lg mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Items Under Review</h1>
        <p className="text-gray-300">
          Content waiting for approval by our moderation team
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-gray-900/50 border border-gray-800/40 p-6 rounded-lg shadow-lg">
        {pendingItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-indigo-900/30 text-indigo-400 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-200 mb-2">No Items Under Review</h3>
            <p className="text-gray-400 mb-6 max-w-md">You don't have any content that's currently under review. Submit some of your drafts to see them here.</p>
            <a 
              href="/contributor/drafts" 
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              Go to Drafts
            </a>
          </div>
        ) : (
          <UnderReviewItems items={pendingItems} />
        )}
      </div>
    </div>
  );
} 