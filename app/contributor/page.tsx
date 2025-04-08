import { auth } from "@/auth";
import { ContributorStats } from "@/components/contributor/ContributorStats";
import { UploadedItems } from "@/components/contributor/UploadedItems";
import { db } from "@/lib/prisma";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default async function ContributorDashboard() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  // Fetch contributor stats
  const itemsCount = await db.contributorItem.count({
    where: { userId: session.user.id }
  });

  const approvedCount = await db.contributorItem.count({
    where: { 
      userId: session.user.id,
      status: "APPROVED"
    }
  });

  const pendingCount = await db.contributorItem.count({
    where: { 
      userId: session.user.id,
      status: "PENDING"
    }
  });

  const rejectedCount = await db.contributorItem.count({
    where: { 
      userId: session.user.id,
      status: "REJECTED"
    }
  });

  // Calculate total downloads and views
  const downloadAndViewStats = await db.contributorItem.aggregate({
    where: {
      userId: session.user.id,
      status: "APPROVED"
    },
    _sum: {
      downloads: true,
      views: true
    }
  });

  const totalDownloads = downloadAndViewStats?._sum?.downloads || 0;
  const totalViews = downloadAndViewStats?._sum?.views || 0;

  // Fetch latest uploaded items with downloads and views
  const latestItems = await db.contributorItem.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contributor Dashboard</h1>
          <p className="mt-1 text-base text-gray-500">
            Manage and track your content performance
          </p>
        </div>
        <Link 
          href="/contributor/upload"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
          Upload New
        </Link>
      </div>

      <ContributorStats 
        totalUploads={itemsCount}
        approved={approvedCount}
        pending={pendingCount}
        rejected={rejectedCount}
        totalDownloads={totalDownloads}
        totalViews={totalViews}
      />

      <UploadedItems items={latestItems} />
    </div>
  );
}
