import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default async function RejectionsPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  // Fetch only REJECTED items uploaded by the user
  const rejectedItems = await db.contributorItem.findMany({
    where: { 
      userId: session.user.id,
      status: "REJECTED"
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
      views: true,
      reviewNote: true,
      license: true,
      categories: true
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Rejected Content</h1>
        <p className="mt-1 text-base text-gray-500">
          Content that did not meet our guidelines. Review feedback to understand why.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-gray-700">Recent Uploads</h2>
          {rejectedItems.length > 0 && (
            <Link href="/contributor/upload" className="text-sm text-blue-600 hover:text-blue-800">
              Try uploading again
            </Link>
          )}
        </div>

        {rejectedItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center border">
            <div className="flex flex-col items-center">
              <ExclamationCircleIcon className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No rejected content</h3>
              <p className="text-gray-500 mb-4">You don't have any rejected uploads yet.</p>
              <Link 
                href="/contributor/upload" 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Upload new content
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-2 text-sm font-medium text-red-600">
                <ExclamationCircleIcon className="w-5 h-5" />
                <span>Rejected content</span>
              </div>
            </div>

            <table className="min-w-full">
              <thead>
                <tr className="bg-white border-b">
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tags
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rejectedItems.map((item) => (
                  <>
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-100 relative">
                          {item.imageUrl && (
                            <Image 
                              src={item.imageUrl} 
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[250px]">{item.title}</div>
                        <div className="text-xs text-gray-500 mt-1 truncate max-w-[250px]">ID: {item.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                          Rejected
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                            {item.license}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 truncate max-w-[180px]">
                          {item.categories && `Categories: ${item.categories.join(", ")}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 2).map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                              {tag}
                            </span>
                          ))}
                          {item.tags.length > 2 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                              +{item.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href="/contributor/upload"
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Try again
                        </Link>
                      </td>
                    </tr>
                    <tr key={`${item.id}-reason`} className="bg-red-50">
                      <td colSpan={7} className="px-6 py-3">
                        <div className="border border-red-200 rounded-lg p-4 shadow-sm bg-white">
                          <div className="flex items-start">
                            <ExclamationCircleIcon className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900">Rejection Reason:</h4>
                              <p className="text-sm text-gray-700 mt-1">{item.reviewNote || "No specific reason provided."}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 