import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { ContributorItemStatus } from "@prisma/client";
import { 
  ArrowTopRightOnSquareIcon, 
  UsersIcon, 
  PhotoIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon 
} from "@heroicons/react/24/solid";

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
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-base text-gray-500">
            Manage platform content and users
          </p>
        </div>
        <Link 
          href="/admin/submissions"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ClockIcon className="w-5 h-5 mr-2" />
          Review Submissions
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Pending Review</p>
              <p className="text-2xl font-bold">{pendingCount}</p>
            </div>
            <span className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="w-5 h-5 text-yellow-600" />
            </span>
          </div>
          <div className="mt-2">
            <Link href="/admin/submissions" className="text-xs text-blue-600 hover:underline">
              View all pending
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Approved Content</p>
              <p className="text-2xl font-bold">{approvedCount}</p>
            </div>
            <span className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
            </span>
          </div>
          <div className="mt-2">
            <Link href="/admin/approved" className="text-xs text-blue-600 hover:underline">
              View approved
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Rejected Content</p>
              <p className="text-2xl font-bold">{rejectedCount}</p>
            </div>
            <span className="p-2 bg-red-100 rounded-lg">
              <ExclamationCircleIcon className="w-5 h-5 text-red-600" />
            </span>
          </div>
          <div className="mt-2">
            <Link href="/admin/rejected" className="text-xs text-blue-600 hover:underline">
              View rejected
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Contributors</p>
              <p className="text-2xl font-bold">{contributorCount}</p>
            </div>
            <span className="p-2 bg-blue-100 rounded-lg">
              <UsersIcon className="w-5 h-5 text-blue-600" />
            </span>
          </div>
          <div className="mt-2">
            <Link href="/admin/users" className="text-xs text-blue-600 hover:underline">
              Manage users
            </Link>
          </div>
        </div>
      </div>

      {/* Platform Metrics */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Platform Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-100 rounded-full">
              <PhotoIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Content</p>
              <p className="text-2xl font-bold">{approvedCount + pendingCount + rejectedCount}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-purple-600">
                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Views</p>
              <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-600">
                <path d="M12 1.5a.75.75 0 01.75.75V7.5h-1.5V2.25A.75.75 0 0112 1.5zM11.25 7.5v5.69l-1.72-1.72a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l3-3a.75.75 0 10-1.06-1.06l-1.72 1.72V7.5h3.75a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9a3 3 0 013-3h3.75z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Downloads</p>
              <p className="text-2xl font-bold">{totalDownloads.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent submissions */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Submissions</h2>
          <Link href="/admin/submissions" className="text-sm text-blue-600 flex items-center hover:text-blue-800 transition-colors">
            View all <ArrowTopRightOnSquareIcon className="ml-1 w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contributor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentSubmissions.map((submission) => {
                const statusInfo = getStatusInfo(submission.status);
                
                return (
                  <tr key={submission.id} className="hover:bg-gray-50">
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
                      <Link href={`/admin/submissions/${submission.id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                        {submission.title}
                      </Link>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{submission.description}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {submission.user.name || submission.user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex items-center rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.icon}
                        <span className="ml-1">{statusInfo.text}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
        icon: <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9z" /></svg>,
        text: "Draft",
        color: "text-blue-600 bg-blue-100"
      };
    case "PENDING":
      return {
        icon: <ClockIcon className="w-4 h-4" />,
        text: "Pending Review",
        color: "text-yellow-600 bg-yellow-100"
      };
    case "APPROVED":
      return {
        icon: <CheckCircleIcon className="w-4 h-4" />,
        text: "Approved",
        color: "text-green-600 bg-green-100"
      };
    case "REJECTED":
      return {
        icon: <ExclamationCircleIcon className="w-4 h-4" />,
        text: "Rejected",
        color: "text-red-600 bg-red-100"
      };
    default:
      return {
        icon: <ClockIcon className="w-4 h-4" />,
        text: "Unknown",
        color: "text-gray-600 bg-gray-100"
      };
  }
} 