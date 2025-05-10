"use client";

import { useState } from "react";
import React from "react";
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
  DocumentIcon,
  PhotoIcon
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
  previewUrl: string;
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
          color: "bg-blue-500/20 text-blue-300",
          textColor: "text-blue-300"
        };
      case "PENDING":
        return {
          icon: <ClockIcon className="w-4 h-4" />,
          text: "Pending",
          color: "bg-amber-500/20 text-amber-300",
          textColor: "text-amber-300"
        };
      case "APPROVED":
        return {
          icon: <CheckCircleIcon className="w-4 h-4" />,
          text: "Approved",
          color: "bg-green-500/20 text-green-300",
          textColor: "text-green-300"
        };
      case "REJECTED":
        return {
          icon: <ExclamationCircleIcon className="w-4 h-4" />,
          text: "Rejected",
          color: "bg-red-500/20 text-red-300",
          textColor: "text-red-300"
        };
      default:
        return {
          icon: <ClockIcon className="w-4 h-4" />,
          text: "Unknown",
          color: "bg-gray-500/20 text-gray-300",
          textColor: "text-gray-300"
        };
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12 rounded-xl bg-gradient-to-b from-gray-800/50 to-gray-900/70 shadow-lg border border-gray-800/50">
        <div className="p-8 flex flex-col items-center">
          <div className="bg-indigo-500/10 p-4 rounded-xl shadow-inner mb-6">
            <PhotoIcon className="w-12 h-12 text-indigo-400" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">No uploads yet</h3>
          <p className="text-gray-400 mb-6 max-w-sm">Start sharing your content with the community</p>
          <Link 
            href="/contributor/upload" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-700/20 transition-all"
          >
            <ArrowTopRightOnSquareIcon className="w-5 h-5 mr-2" />
            Upload your first image
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800/50 overflow-hidden">
      <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-800/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <PhotoIcon className="w-5 h-5 text-indigo-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Recent Uploads</h2>
        </div>
        <Link 
          href="/contributor/content" 
          className="text-sm text-indigo-400 flex items-center hover:text-indigo-300 transition-colors"
        >
          View all <ArrowTopRightOnSquareIcon className="ml-1 w-4 h-4" />
        </Link>
      </div>

      {/* Mobile view - cards */}
      <div className="md:hidden grid grid-cols-1 gap-4 p-4">
        {displayItems.map((item) => {
          const statusInfo = getStatusInfo(item.status);
          const isRejected = item.status === "REJECTED";
          const hasRejectionReason = isRejected && item.reviewNote;
          const timeAgo = formatDistanceToNow(new Date(item.createdAt), { addSuffix: true });

          return (
            <div key={item.id} className="bg-gray-800/50 rounded-xl overflow-hidden shadow-md border border-gray-700/50 hover:border-gray-600/50 transition-all">
              <div className="relative h-40 w-full bg-gray-800">
                <Image
                  src={item.previewUrl || item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover opacity-90 hover:opacity-100 transition-opacity"
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 inline-flex items-center rounded-full text-xs font-medium ${statusInfo.color}`}>
                    {statusInfo.icon}
                    <span className="ml-1">{statusInfo.text}</span>
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent h-20 pointer-events-none"></div>
              </div>
              
              <div className="p-4">
                <h3 className="font-medium text-white line-clamp-1">{item.title}</h3>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                
                {/* Metrics and timestamp */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {timeAgo}
                  </div>
                  
                  {item.status === "APPROVED" && (
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center text-gray-400">
                        <EyeIcon className="w-3.5 h-3.5 mr-1 text-indigo-400" />
                        <span>{item.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center text-gray-400">
                        <ArrowDownTrayIcon className="w-3.5 h-3.5 mr-1 text-indigo-400" />
                        <span>{item.downloads.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Actions */}
                <div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-700/50 pt-3">
                  {hasRejectionReason && (
                    <button
                      onClick={() => toggleReasonExpand(item.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 text-xs text-red-300 font-medium flex items-center"
                    >
                      <ExclamationCircleIcon className="w-3.5 h-3.5 mr-1.5" />
                      View reason
                    </button>
                  )}
                  
                  <div className="flex gap-2 ml-auto">
                    <Link 
                      href={`/contributor/content/${item.id}/edit`}
                      className="p-2 rounded-lg bg-gray-700/50 text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Link>
                    <Link 
                      href={`/contributor/content/${item.id}`}
                      className="p-2 rounded-lg bg-gray-700/50 text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                      <ChartBarIcon className="w-4 h-4" />
                    </Link>
                    <button 
                      className="p-2 rounded-lg bg-red-500/10 text-red-300 hover:bg-red-500/20 transition-colors"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this item?')) {
                          setDisplayItems(displayItems.filter(i => i.id !== item.id));
                        }
                      }}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Rejection reason (expandable) */}
                {isRejected && hasRejectionReason && expandedReasons[item.id] && (
                  <div className="mt-3 p-3 bg-red-500/10 rounded-lg">
                    <p className="text-xs text-red-300 mb-1 font-medium">Rejection Reason:</p>
                    <p className="text-xs text-red-200">{item.reviewNote}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop view - table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-800/50">
          <thead className="bg-gray-800/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Content
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Metrics
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {displayItems.map((item) => {
              const statusInfo = getStatusInfo(item.status);
              const isRejected = item.status === "REJECTED";
              const hasRejectionReason = isRejected && item.reviewNote;
              const timeAgo = formatDistanceToNow(new Date(item.createdAt), { addSuffix: true });

              return (
                <React.Fragment key={item.id}>
                  <tr className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden relative">
                          <Image
                            src={item.previewUrl || item.imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white line-clamp-1">{item.title}</div>
                          <div className="text-sm text-gray-400 line-clamp-1 mt-1">{item.description}</div>
                          <div className="text-xs text-gray-500 mt-1">{timeAgo}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1.5 inline-flex items-center rounded-lg text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.icon}
                        <span className="ml-1">{statusInfo.text}</span>
                      </span>
                      
                      {hasRejectionReason && (
                        <button
                          onClick={() => toggleReasonExpand(item.id)}
                          className="mt-2 flex items-center text-xs text-red-300 hover:text-red-200"
                        >
                          <ExclamationCircleIcon className="w-3.5 h-3.5 mr-1" />
                          View reason
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {item.status === "APPROVED" ? (
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-300">
                            <EyeIcon className="w-4 h-4 mr-2 text-indigo-400" />
                            <span className="text-sm">{item.views.toLocaleString()} </span>
                          </div>
                          <div className="flex items-center text-gray-300">
                            <ArrowDownTrayIcon className="w-4 h-4 mr-2 text-indigo-400" />
                            <span className="text-sm">{item.downloads.toLocaleString()} </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 italic">No metrics yet</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/contributor/content/${item.id}/edit`}
                          className="p-2 rounded-lg bg-gray-700/50 text-gray-300 hover:bg-gray-700 transition-colors"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/contributor/content/${item.id}`}
                          className="p-2 rounded-lg bg-gray-700/50 text-gray-300 hover:bg-gray-700 transition-colors"
                        >
                          <ChartBarIcon className="w-4 h-4" />
                        </Link>
                        <button
                          className="p-2 rounded-lg bg-red-500/10 text-red-300 hover:bg-red-500/20 transition-colors"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this item?')) {
                              setDisplayItems(displayItems.filter(i => i.id !== item.id));
                            }
                          }}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded row for rejection reason */}
                  {isRejected && hasRejectionReason && expandedReasons[item.id] && (
                    <tr className="bg-red-900/10">
                      <td colSpan={4} className="px-6 py-4">
                        <div className="flex items-start space-x-2">
                          <ExclamationCircleIcon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-red-300 mb-1">Rejection Reason:</p>
                            <p className="text-sm text-red-200">{item.reviewNote}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 