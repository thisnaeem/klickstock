import { auth } from "@/auth";
import { UploadedItems } from "@/components/contributor/UploadedItems";
import { ContributorLevel } from "@/components/contributor/ContributorLevel";
import { db } from "@/lib/prisma";
import { ArrowUpTrayIcon, ChartBarIcon, PhotoIcon } from "@heroicons/react/24/solid";
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
    <div className="w-full max-w-full overflow-x-hidden space-y-8">
      {/* Dashboard Header with Dark Gradient */}
      <div className="relative rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-gray-900 to-indigo-950 px-4 sm:px-6 py-6 sm:py-8 md:px-8 md:py-12 rounded-xl shadow-lg border border-gray-800/50">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/5 rounded-full -mt-20 -mr-20 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/10 rounded-full -mb-10 -ml-10 blur-2xl pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative">
            <div className="text-white">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                Contributor Dashboard
              </h1>
              <p className="mt-2 text-gray-400 max-w-lg">
                Track your content performance and manage your contributions
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-8">
                <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-gray-700/30">
                  <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-sm font-medium text-gray-300">Total Items</p>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                      <PhotoIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-300" />
                    </div>
                  </div>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white mt-2">{itemsCount}</p>
                </div>
                
                <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-gray-700/30">
                  <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-sm font-medium text-gray-300">Downloads</p>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                      <ArrowUpTrayIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-300 rotate-180" />
                    </div>
                  </div>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white mt-2">{totalDownloads.toLocaleString()}</p>
                </div>
                
                <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-gray-700/30">
                  <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-sm font-medium text-gray-300">Views</p>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                      <ChartBarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-300" />
                    </div>
                  </div>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white mt-2">{totalViews.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <Link 
              href="/contributor/upload"
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-lg shadow-indigo-900/40 font-medium group"
            >
              <ArrowUpTrayIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
              <span>Upload New</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-8">
          {/* Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-900/50 backdrop-blur-sm p-5 rounded-xl border border-gray-800/40">
              <h3 className="text-sm font-medium text-gray-300 mb-1">Approved</h3>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-white">{approvedCount}</p>
                <span className="px-2 py-1 text-xs rounded-md bg-emerald-500/20 text-emerald-400">
                  {itemsCount > 0 ? Math.round((approvedCount / itemsCount) * 100) : 0}%
                </span>
              </div>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-sm p-5 rounded-xl border border-gray-800/40">
              <h3 className="text-sm font-medium text-gray-300 mb-1">Pending</h3>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-white">{pendingCount}</p>
                <span className="px-2 py-1 text-xs rounded-md bg-blue-500/20 text-blue-400">
                  {itemsCount > 0 ? Math.round((pendingCount / itemsCount) * 100) : 0}%
                </span>
              </div>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-sm p-5 rounded-xl border border-gray-800/40">
              <h3 className="text-sm font-medium text-gray-300 mb-1">Rejected</h3>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-white">{rejectedCount}</p>
                <span className="px-2 py-1 text-xs rounded-md bg-red-500/20 text-red-400">
                  {itemsCount > 0 ? Math.round((rejectedCount / itemsCount) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
          
          {/* Uploaded Items Section */}
          <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800/40">
            <UploadedItems items={latestItems} />
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-8">
          {/* Contributor Level Card */}
          <ContributorLevel approvedImages={approvedCount} />
        </div>
      </div>
    </div>
  );
}
