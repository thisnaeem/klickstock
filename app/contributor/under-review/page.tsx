import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { UploadedItems } from "@/components/contributor/UploadedItems";

export default async function UnderReviewPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  // Fetch only PENDING items uploaded by the user
  const pendingItems = await db.contributorItem.findMany({
    where: { 
      userId: session.user.id,
      status: "PENDING"
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Items Under Review</h1>
        <p className="mt-1 text-sm text-gray-500">
          Content waiting for approval by our moderation team
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <UploadedItems items={pendingItems} />
      </div>
    </div>
  );
} 