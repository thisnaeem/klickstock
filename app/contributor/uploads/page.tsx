import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { 
  EyeIcon, 
  ArrowDownTrayIcon, 
  CheckCircleIcon, 
  ClockIcon,
  ExclamationCircleIcon,
  DocumentIcon
} from "@heroicons/react/24/solid";

export default async function UploadsPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  // Fetch all items uploaded by the user
  const items = await db.contributorItem.findMany({
    where: { userId: session.user.id },
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

  const getStatusInfo = (status: "PENDING" | "APPROVED" | "REJECTED" | "DRAFT") => {
    switch (status) {
      case "DRAFT":
        return {
          icon: <DocumentIcon className="w-4 h-4" />,
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
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Uploads</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage all your uploaded content
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Uploaded Content</h2>
          <Link 
            href="/contributor/upload" 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Upload New
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12 border rounded-xl bg-gray-50">
            <div className="text-gray-500">No uploads yet</div>
            <Link 
              href="/contributor/upload" 
              className="mt-3 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Upload your first image
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((item) => {
              const statusInfo = getStatusInfo(item.status as "PENDING" | "APPROVED" | "REJECTED" | "DRAFT");
              
              return (
                <div key={item.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative aspect-square">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 line-clamp-1">{item.title}</h3>
                      <span className={`px-2 py-1 inline-flex items-center rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.icon}
                        <span className="ml-1">{statusInfo.text}</span>
                      </span>
                    </div>
                    
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{item.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                      {item.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          +{item.tags.length - 3}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <div>
                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                      </div>
                      
                      {item.status === "APPROVED" && (
                        <div className="flex space-x-3">
                          <div className="flex items-center">
                            <EyeIcon className="w-3.5 h-3.5 mr-1 text-blue-600" />
                            <span>{item.views}</span>
                          </div>
                          <div className="flex items-center">
                            <ArrowDownTrayIcon className="w-3.5 h-3.5 mr-1 text-green-600" />
                            <span>{item.downloads}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 