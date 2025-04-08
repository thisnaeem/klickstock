"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { 
  ClockIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  ArrowTopRightOnSquareIcon, 
  EllipsisHorizontalIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon,
  DocumentIcon
} from "@heroicons/react/24/solid";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

// Type for contributor items
type ContributorItemStatus = "PENDING" | "APPROVED" | "REJECTED" | "DRAFT";

interface ContributorItem {
  id: string;
  title: string;
  description: string;
  status: ContributorItemStatus;
  imageUrl: string;
  createdAt: Date;
  tags: string[];
  downloads: number;
  views: number;
  reviewNote?: string;
}

interface UploadedItemsProps {
  items: ContributorItem[];
}

export const UploadedItems = ({ items }: UploadedItemsProps) => {
  const [displayItems, setDisplayItems] = useState(items);
  const [expandedReasons, setExpandedReasons] = useState<Record<string, boolean>>({});

  const toggleReasonExpand = (id: string) => {
    setExpandedReasons(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getStatusInfo = (status: ContributorItemStatus) => {
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

  if (items.length === 0) {
    return (
      <div className="text-center py-12 border rounded-xl bg-gray-50">
        <div className="text-gray-500">No uploads yet</div>
        <Link 
          href="/contributor/upload" 
          className="mt-3 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Upload your first image
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-gray-900">Recent Uploads</h2>
        <Link href="/contributor/content" className="text-sm text-blue-600 flex items-center hover:text-blue-800 transition-colors">
          View all <ArrowTopRightOnSquareIcon className="ml-1 w-4 h-4" />
        </Link>
      </div>

      <div className="bg-white rounded-xl border shadow-lg overflow-hidden">
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
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metrics
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tags
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayItems.map((item) => {
                const statusInfo = getStatusInfo(item.status);
                const isRejected = item.status === "REJECTED";
                const hasRejectionReason = isRejected && item.reviewNote;

                return (
                  <>
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex-shrink-0 h-20 w-20 rounded-lg overflow-hidden relative shadow-sm">
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">{item.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{item.description}</div>
                        {isRejected && hasRejectionReason && (
                          <button
                            onClick={() => toggleReasonExpand(item.id)}
                            className="mt-1 text-xs text-red-600 hover:text-red-800 font-medium flex items-center underline"
                          >
                            View rejection reason
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex items-center rounded-full text-xs font-medium ${statusInfo.color}`}>
                          {statusInfo.icon}
                          <span className="ml-1">{statusInfo.text}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {item.status === "APPROVED" ? (
                          <div className="space-y-2">
                            <div className="flex items-center text-gray-700">
                              <EyeIcon className="w-4 h-4 mr-2 text-blue-600" />
                              <span className="text-sm">{item.views.toLocaleString()} views</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                              <ArrowDownTrayIcon className="w-4 h-4 mr-2 text-green-600" />
                              <span className="text-sm">{item.downloads.toLocaleString()} downloads</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500 italic">No metrics yet</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
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
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 rounded-full hover:bg-gray-100">
                              <EllipsisHorizontalIcon className="w-5 h-5 text-gray-500" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem>
                              <Link href={`/contributor/content/${item.id}`} className="w-full flex items-center">
                                <ChartBarIcon className="w-4 h-4 mr-2" />
                                Analytics
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link href={`/contributor/content/${item.id}/edit`} className="w-full flex items-center">
                                <PencilIcon className="w-4 h-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <button 
                                className="w-full text-left text-red-600 flex items-center"
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this item?')) {
                                    // Delete logic would go here
                                    setDisplayItems(displayItems.filter(i => i.id !== item.id));
                                  }
                                }}
                              >
                                <TrashIcon className="w-4 h-4 mr-2" />
                                Delete
                              </button>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                    {isRejected && hasRejectionReason && expandedReasons[item.id] && (
                      <tr key={`${item.id}-reason`} className="bg-red-50">
                        <td colSpan={7} className="px-6 py-3">
                          <div className="bg-white border border-red-200 rounded-lg p-3 shadow-sm">
                            <div className="flex items-start">
                              <ExclamationCircleIcon className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">Rejection Reason:</h4>
                                <p className="text-sm text-gray-700 mt-1">{item.reviewNote}</p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}; 