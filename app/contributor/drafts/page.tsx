import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { DraftsList } from "@/components/contributor/DraftsList";
import { ContributorItemStatus } from "@prisma/client";

export default async function DraftsPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  // Fetch only draft items for this user
  const draftItems = await db.contributorItem.findMany({
    where: { 
      userId: session.user.id,
      status: ContributorItemStatus.DRAFT
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      imageUrl: true,
      createdAt: true,
      tags: true,
      category: true
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Draft Content</h1>
        <p className="mt-1 text-sm text-gray-500">
          Content you've uploaded but not yet submitted for review
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <DraftsList items={draftItems} />
      </div>
    </div>
  );
} 