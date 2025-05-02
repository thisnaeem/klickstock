import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ExclamationCircleIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import React from "react";
import { ContributorItemStatus } from "@prisma/client";

export default async function RejectionsPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  // Fetch only REJECTED items uploaded by the user
  const rejectedItems = await db.contributorItem.findMany({
    where: { 
      userId: session.user.id,
      status: ContributorItemStatus.REJECTED
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
      views: true,
      reviewNote: true,
      license: true,
      category: true
    }
  });

  return (
    <div className="space-y-6 min-h-screen pb-10">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-red-900/40 via-purple-900/40 to-red-900/40 p-6 rounded-lg shadow-lg mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Rejected Content</h1>
        <p className="text-gray-300">
          Content that did not meet our guidelines. Review feedback to understand why.
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-gray-900/50 border border-gray-800/40 p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
              <ExclamationCircleIcon className="w-5 h-5 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Rejection Feedback</h2>
          </div>

          {rejectedItems.length > 0 && (
            <Link 
              href="/contributor/upload" 
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              Upload New Content
            </Link>
          )}
        </div>

        {rejectedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-red-900/30 text-red-400 rounded-full flex items-center justify-center mb-4">
              <ExclamationCircleIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-200 mb-2">No Rejected Content</h3>
            <p className="text-gray-400 mb-6 max-w-md">You don't have any rejected uploads. This is good news! Keep submitting quality content.</p>
            <Link 
              href="/contributor/upload" 
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              Upload New Content
            </Link>
          </div>
        ) : (
          <div className="bg-gray-800/40 rounded-xl border border-gray-700/50 overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700/50">
                <thead>
                  <tr className="bg-gray-800/70">
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Image
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Details
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {rejectedItems.map((item) => (
                    <React.Fragment key={item.id}>
                      <tr className="bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                        <td className="w-32 p-4">
                          <div className="h-20 w-20 rounded-lg overflow-hidden relative">
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-white line-clamp-1">{item.title}</div>
                          <div className="text-xs text-gray-400 mt-1 truncate max-w-[250px]">ID: {item.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/30 text-red-300">
                            <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                            Rejected
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-300">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-900/40 text-indigo-300 mr-2">
                              {item.license}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400 mt-1 truncate max-w-[180px]">
                            {item.category && `Category: ${item.category}`}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href="/contributor/upload"
                            className="w-10 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors inline-flex items-center justify-center"
                            title="Try Again"
                          >
                            <ArrowPathIcon className="w-5 h-5" />
                          </Link>
                        </td>
                      </tr>
                      {item.reviewNote && (
                        <tr className="bg-red-900/10 border-t border-red-900/30">
                          <td colSpan={6} className="p-4">
                            <div className="flex items-start gap-3">
                              <ExclamationCircleIcon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                              <div>
                                <h4 className="font-medium text-red-300 mb-1">Rejection Reason:</h4>
                                <p className="text-red-200/80 text-sm">{item.reviewNote}</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 