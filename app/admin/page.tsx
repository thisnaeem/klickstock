import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { ContributorItemStatus } from "@prisma/client";
import { CheckCircle, Clock, XCircle, Users, Images, Download, Eye, ArrowUpRight } from "lucide-react";

export default async function AdminDashboard() {
  // Fetch summary stats
  const pendingCount = await db.contributorItem.count({
    where: { status: ContributorItemStatus.PENDING }
  });

  const approvedCount = await db.contributorItem.count({
    where: { status: ContributorItemStatus.APPROVED }
  });

  const rejectedCount = await db.contributorItem.count({
    where: { status: ContributorItemStatus.REJECTED }
  });

  const totalUsers = await db.user.count();
  const contributorCount = await db.user.count({
    where: { role: "CONTRIBUTOR" }
  });

  // Fetch recent submissions
  const recentSubmissions = await db.contributorItem.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: true }
  });

  // Calculate download and view metrics
  const downloadAndViewStats = await db.contributorItem.aggregate({
    where: {
      status: ContributorItemStatus.APPROVED
    },
    _sum: {
      downloads: true,
      views: true
    }
  });

  const totalDownloads = downloadAndViewStats?._sum?.downloads || 0;
  const totalViews = downloadAndViewStats?._sum?.views || 0;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="mt-1 text-base text-gray-400">
            Manage platform content and users
          </p>
        </div>
        <Link 
          href="/admin/submissions"
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/20"
        >
          <Clock className="w-5 h-5 mr-2" />
          Review Submissions
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-xl border border-gray-700/50">
          <div className="absolute inset-0 bg-yellow-500/5"></div>
          <div className="absolute right-0 top-0 w-20 h-20 bg-yellow-500/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl"></div>
          <div className="flex justify-between items-start">
            <div className="relative">
              <p className="text-sm text-gray-400">Pending Review</p>
              <p className="text-3xl font-bold text-white mt-1">{pendingCount}</p>
            </div>
            <span className="p-2 bg-yellow-500/10 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-400" />
            </span>
          </div>
          <div className="mt-4">
            <Link href="/admin/approval" className="text-xs text-blue-400 hover:text-blue-300 flex items-center">
              View all pending <ArrowUpRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-xl border border-gray-700/50">
          <div className="absolute inset-0 bg-green-500/5"></div>
          <div className="absolute right-0 top-0 w-20 h-20 bg-green-500/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl"></div>
          <div className="flex justify-between items-start">
            <div className="relative">
              <p className="text-sm text-gray-400">Approved Content</p>
              <p className="text-3xl font-bold text-white mt-1">{approvedCount}</p>
            </div>
            <span className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </span>
          </div>
          <div className="mt-4">
            <Link href="/admin/approved" className="text-xs text-blue-400 hover:text-blue-300 flex items-center">
              View approved <ArrowUpRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-xl border border-gray-700/50">
          <div className="absolute inset-0 bg-red-500/5"></div>
          <div className="absolute right-0 top-0 w-20 h-20 bg-red-500/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl"></div>
          <div className="flex justify-between items-start">
            <div className="relative">
              <p className="text-sm text-gray-400">Rejected Content</p>
              <p className="text-3xl font-bold text-white mt-1">{rejectedCount}</p>
            </div>
            <span className="p-2 bg-red-500/10 rounded-lg">
              <XCircle className="w-6 h-6 text-red-400" />
            </span>
          </div>
          <div className="mt-4">
            <Link href="/admin/rejected" className="text-xs text-blue-400 hover:text-blue-300 flex items-center">
              View rejected <ArrowUpRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-xl border border-gray-700/50">
          <div className="absolute inset-0 bg-blue-500/5"></div>
          <div className="absolute right-0 top-0 w-20 h-20 bg-blue-500/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl"></div>
          <div className="flex justify-between items-start">
            <div className="relative">
              <p className="text-sm text-gray-400">Contributors</p>
              <p className="text-3xl font-bold text-white mt-1">{contributorCount}</p>
            </div>
            <span className="p-2 bg-blue-500/10 rounded-lg">
              <Users className="w-6 h-6 text-blue-400" />
            </span>
          </div>
          <div className="mt-4">
            <Link href="/admin/users" className="text-xs text-blue-400 hover:text-blue-300 flex items-center">
              Manage users <ArrowUpRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Platform Metrics */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-xl border border-gray-700/50">
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full translate-x-1/4 -translate-y-1/4 blur-3xl"></div>
        <h2 className="text-xl font-semibold mb-6 text-white relative">Platform Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl">
              <Images className="h-6 w-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Content</p>
              <p className="text-2xl font-bold text-white">{approvedCount + pendingCount + rejectedCount}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <Eye className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Views</p>
              <p className="text-2xl font-bold text-white">{totalViews.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-500/10 rounded-xl">
              <Download className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Downloads</p>
              <p className="text-2xl font-bold text-white">{totalDownloads.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent submissions */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-xl border border-gray-700/50">
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/10 rounded-full -translate-x-1/4 translate-y-1/4 blur-3xl"></div>
        <div className="flex justify-between items-center mb-6 relative">
          <h2 className="text-xl font-semibold text-white">Recent Submissions</h2>
          <Link href="/admin/approval" className="text-sm text-blue-400 flex items-center hover:text-blue-300 transition-colors">
            View all <ArrowUpRight className="ml-1 w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto relative">
          <table className="min-w-full">
            <thead>
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Image
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Contributor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Submitted
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {recentSubmissions.map((submission) => {
                const statusInfo = getStatusInfo(submission.status);
                
                return (
                  <tr key={submission.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex-shrink-0 h-12 w-12 rounded-lg overflow-hidden relative">
                        <Image
                          src={submission.imageUrl}
                          alt={submission.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/submissions/${submission.id}`} className="text-sm font-medium text-white hover:text-blue-400">
                        {submission.title}
                      </Link>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-1">{submission.description}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {submission.user.name || submission.user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex items-center rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.icon}
                        <span className="ml-1">{statusInfo.text}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function getStatusInfo(status: string) {
  switch (status) {
    case "DRAFT":
      return {
        icon: <Images className="w-4 h-4" />,
        text: "Draft",
        color: "text-blue-400 bg-blue-900/30"
      };
    case "PENDING":
      return {
        icon: <Clock className="w-4 h-4" />,
        text: "Pending Review",
        color: "text-yellow-400 bg-yellow-900/30"
      };
    case "APPROVED":
      return {
        icon: <CheckCircle className="w-4 h-4" />,
        text: "Approved",
        color: "text-green-400 bg-green-900/30"
      };
    case "REJECTED":
      return {
        icon: <XCircle className="w-4 h-4" />,
        text: "Rejected",
        color: "text-red-400 bg-red-900/30"
      };
    default:
      return {
        icon: <Clock className="w-4 h-4" />,
        text: "Unknown",
        color: "text-gray-400 bg-gray-900/30"
      };
  }
} 