import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { UploadedItems } from "@/components/contributor/UploadedItems";

export default async function PublishedPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  // Fetch only APPROVED items uploaded by the user
  const publishedItems = await db.contributorItem.findMany({
    where: { 
      userId: session.user.id,
      status: "APPROVED"
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
      views: true
    }
  });

  // Calculate total views and downloads
  const totalViews = publishedItems.reduce((sum, item) => sum + item.views, 0);
  const totalDownloads = publishedItems.reduce((sum, item) => sum + item.downloads, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Published Content</h1>
        <p className="mt-1 text-sm text-gray-500">
          Your approved content that is live on the platform
        </p>
      </div>

      {publishedItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
            <div className="text-sm text-gray-500">Total Published</div>
            <div className="text-2xl font-bold">{publishedItems.length}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
            <div className="text-sm text-gray-500">Total Views</div>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
            <div className="text-sm text-gray-500">Total Downloads</div>
            <div className="text-2xl font-bold">{totalDownloads.toLocaleString()}</div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <UploadedItems items={publishedItems} />
      </div>
    </div>
  );
} 