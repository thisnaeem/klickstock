"use client";

import { useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { 
  ClockIcon, 
  EyeIcon, 
  InformationCircleIcon,
  TrashIcon 
} from "@heroicons/react/24/solid";
import { toast } from "sonner";
import { withdrawSubmission } from "@/actions/contributor";
import { useRouter } from "next/navigation";
import { ContributorItemStatus } from "@prisma/client";

interface UnderReviewItemsProps {
  items: {
    id: string;
    title: string;
    description: string;
    status: string;
    imageUrl: string;
    createdAt: Date;
    tags: string[];
    downloads?: number;
    views?: number;
  }[];
}

export function UnderReviewItems({ items }: UnderReviewItemsProps) {
  const router = useRouter();
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpandItem = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleWithdraw = async (id: string) => {
    if (!confirm("Are you sure you want to withdraw this submission? It will be moved back to drafts.")) {
      return;
    }

    try {
      setWithdrawingId(id);
      await withdrawSubmission(id);
      toast.success("Item withdrawn successfully and moved to drafts");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to withdraw submission");
    } finally {
      setWithdrawingId(null);
    }
  };

  // For mobile/card view
  const renderCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
      {items.map((item) => {
        const timeAgo = formatDistanceToNow(new Date(item.createdAt), { addSuffix: true });
        const isExpanded = expandedItems[item.id] || false;

        return (
          <div 
            key={item.id} 
            className="bg-gray-800/50 border border-gray-700/50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all"
          >
            <div className="relative h-48">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
              <div className="absolute top-3 right-3">
                <span className="px-3 py-1 inline-flex items-center rounded-full text-xs font-medium bg-amber-500/20 text-amber-300">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  <span>Under Review</span>
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-medium text-white line-clamp-1">{item.title}</h3>
              <p className="text-gray-400 text-sm mt-2 line-clamp-2">{item.description}</p>
              
              <div className="flex flex-wrap gap-1 mt-3 mb-3">
                {item.tags.slice(0, 3).map((tag, i) => (
                  <span key={i} className="px-2 py-1 bg-indigo-900/40 text-indigo-300 rounded-full text-xs font-medium">
                    {tag}
                  </span>
                ))}
                {item.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
                    +{item.tags.length - 3}
                  </span>
                )}
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="text-xs text-gray-400">
                  {timeAgo}
                </div>
                <button 
                  className="px-3 py-1 bg-red-900/50 text-red-300 text-xs rounded-md font-medium hover:bg-red-800/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  disabled={withdrawingId === item.id}
                  onClick={() => handleWithdraw(item.id)}
                >
                  {withdrawingId === item.id ? (
                    "Withdrawing..."
                  ) : (
                    <>
                      <TrashIcon className="w-3 h-3 mr-1" />
                      Withdraw
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  // For desktop/table view
  const renderTable = () => (
    <div className="hidden md:block">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-800/50">
          <thead>
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Content
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Submitted
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {items.map((item) => {
              const timeAgo = formatDistanceToNow(new Date(item.createdAt), { addSuffix: true });
              return (
                <tr key={item.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden relative">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white line-clamp-1">{item.title}</div>
                        <div className="text-sm text-gray-400 line-clamp-1 mt-1">{item.description}</div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.tags.slice(0, 2).map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 bg-indigo-900/40 text-indigo-300 rounded-full text-xs">
                              {tag}
                            </span>
                          ))}
                          {item.tags.length > 2 && (
                            <span className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded-full text-xs">
                              +{item.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 inline-flex items-center rounded-full text-xs font-medium bg-amber-500/20 text-amber-300">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      <span>Under Review</span>
                    </span>
                    <p className="text-xs text-gray-400 mt-2">
                      Our team is reviewing this content
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {timeAgo}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      className="px-3 py-1 bg-red-900/50 text-red-300 text-xs rounded-md font-medium hover:bg-red-800/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center ml-auto"
                      disabled={withdrawingId === item.id}
                      onClick={() => handleWithdraw(item.id)}
                    >
                      {withdrawingId === item.id ? (
                        "Withdrawing..."
                      ) : (
                        <>
                          <TrashIcon className="w-3 h-3 mr-1" />
                          Withdraw
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <ClockIcon className="w-5 h-5 text-amber-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Under Review</h2>
        </div>
        
        <div className="text-xs text-gray-400 flex items-center">
          <InformationCircleIcon className="w-4 h-4 mr-1 text-gray-500" />
          <span>Average review time: 1-2 days</span>
        </div>
      </div>
      
      {renderCards()}
      {renderTable()}
    </div>
  );
} 