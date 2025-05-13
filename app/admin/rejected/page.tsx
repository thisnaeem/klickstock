import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { ContributorItemStatus } from "@prisma/client";
import { XCircle, ArrowUpRight } from "lucide-react";

export default async function RejectedContent() {
  // Fetch rejected content with pagination
  const rejectedItems = await db.contributorItem.findMany({
    where: { 
      status: ContributorItemStatus.REJECTED 
    },
    orderBy: { 
      updatedAt: "desc" 
    },
    include: { 
      user: true 
    },
    take: 20,
  });

  // Get total count
  const totalCount = await db.contributorItem.count({
    where: { 
      status: ContributorItemStatus.REJECTED 
    }
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Rejected Content</h1>
          <p className="mt-1 text-base text-gray-400">
            Reviewing {totalCount} rejected items
          </p>
        </div>
      </div>

      {/* Content listing */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl border border-gray-700/50">
        <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl"></div>
        
        <div className="p-4 border-b border-gray-700/50 bg-gray-800/30">
          <div className="flex items-center space-x-2 text-sm font-medium text-red-400">
            <XCircle className="w-5 h-5" />
            <span>Rejected content</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
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
                  Rejection Reason
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Rejected
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {rejectedItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-800/50 transition-colors">
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
                    <div className="text-sm font-medium text-white">{item.title}</div>
                    <div className="text-xs text-gray-400 mt-1 line-clamp-1">{item.description}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-0.5 text-xs bg-blue-900/30 text-blue-400 rounded-full">
                          {tag}
                        </span>
                      ))}
                      {item.tags.length > 3 && (
                        <span className="px-2 py-0.5 text-xs bg-gray-800 text-gray-400 rounded-full">
                          +{item.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{item.user.name}</div>
                    <div className="text-xs text-gray-500">{item.user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-red-400">
                      {item.reviewNote || "No specific reason provided"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col space-y-2">
                      <Link 
                        href={`/admin/approve/${item.id}`} 
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Approve
                      </Link>
                      <Link 
                        href={`/admin/submissions/${item.id}`} 
                        className="flex items-center text-gray-400 hover:text-gray-300 transition-colors"
                      >
                        Review <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}

              {rejectedItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    No rejected content found
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