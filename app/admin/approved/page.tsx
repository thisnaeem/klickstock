import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { ContributorItemStatus } from "@prisma/client";
import { ArrowTopRightOnSquareIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

export default async function ApprovedContent() {
  // Fetch approved content with pagination
  const approvedItems = await db.contributorItem.findMany({
    where: { 
      status: ContributorItemStatus.APPROVED 
    },
    orderBy: { 
      createdAt: "desc" 
    },
    include: { 
      user: true 
    },
    take: 20,
  });

  // Get total count
  const totalCount = await db.contributorItem.count({
    where: { 
      status: ContributorItemStatus.APPROVED 
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Approved Content</h1>
          <p className="mt-1 text-base text-gray-500">
            Managing {totalCount} approved items
          </p>
        </div>
      </div>

      {/* Content listing */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2 text-sm font-medium text-green-600">
            <CheckCircleIcon className="w-5 h-5" />
            <span>All approved content</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
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
                  Stats
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Approved
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {approvedItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex-shrink-0 h-12 w-12 rounded-lg overflow-hidden relative">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                    <div className="text-xs text-gray-500 mt-1 line-clamp-1">{item.description}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                          {tag}
                        </span>
                      ))}
                      {item.tags.length > 3 && (
                        <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full">
                          +{item.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.user.name}</div>
                    <div className="text-xs text-gray-500">{item.user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-4 text-sm">
                      <div>
                        <div className="font-medium">{item.downloads}</div>
                        <div className="text-xs text-gray-500">Downloads</div>
                      </div>
                      <div>
                        <div className="font-medium">{item.views}</div>
                        <div className="text-xs text-gray-500">Views</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <Link 
                        href={`/gallery/${item.id}`} 
                        className="text-blue-600 hover:text-blue-900"
                        target="_blank"
                      >
                        View <ArrowTopRightOnSquareIcon className="inline-block w-3 h-3 ml-1" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}

              {approvedItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No approved content found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 