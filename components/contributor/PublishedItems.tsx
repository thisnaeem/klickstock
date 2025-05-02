"use client";

import { useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { 
  CheckCircleIcon, 
  EyeIcon, 
  ArrowDownTrayIcon,
  PencilIcon,
  TrashIcon,
  ChevronRightIcon
} from "@heroicons/react/24/solid";
import Link from "next/link";

interface PublishedItemsProps {
  items: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    createdAt: Date;
    downloads: number;
    views: number;
    tags: string[];
    license?: string;
    category?: string;
  }[];
}

export function PublishedItems({ items }: PublishedItemsProps) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpandItem = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // For mobile/card view
  const renderCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
      {items.map((item) => {
        const timeAgo = formatDistanceToNow(new Date(item.createdAt), { addSuffix: true });
        
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
                <span className="px-3 py-1 inline-flex items-center rounded-full text-xs font-medium bg-green-500/20 text-green-300">
                  <CheckCircleIcon className="w-4 h-4 mr-1" />
                  <span>Approved</span>
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex justify-between">
                <div className="flex items-center space-x-2 text-white">
                  <div className="flex items-center">
                    <EyeIcon className="w-4 h-4 mr-1 text-indigo-300" />
                    <span className="text-xs">{item.views}</span>
                  </div>
                  <div className="flex items-center">
                    <ArrowDownTrayIcon className="w-4 h-4 mr-1 text-indigo-300" />
                    <span className="text-xs">{item.downloads}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-medium text-white line-clamp-1">{item.title}</h3>
              <p className="text-gray-400 text-sm mt-2 line-clamp-2">{item.description}</p>
              
              <div className="flex justify-between items-center mt-4">
                <div className="text-xs text-gray-400">
                  {timeAgo}
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="w-8 h-8 bg-gray-700/50 text-gray-300 rounded-md flex items-center justify-center hover:bg-gray-700 transition-colors"
                    onClick={() => toggleExpandItem(item.id)}
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button 
                    className="w-8 h-8 bg-red-900/20 text-red-300 rounded-md flex items-center justify-center hover:bg-red-900/40 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
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
                Metrics
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
                        {(item.license || item.category) && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.license && (
                              <span className="px-2 py-0.5 bg-indigo-900/40 text-indigo-300 rounded-md text-xs">
                                {item.license}
                              </span>
                            )}
                            {item.category && (
                              <span className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded-md text-xs">
                                {item.category}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 inline-flex items-center rounded-full text-xs font-medium bg-green-500/20 text-green-300">
                      <CheckCircleIcon className="w-4 h-4 mr-1" />
                      <span>Approved</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <EyeIcon className="w-4 h-4 mr-1.5 text-indigo-400" />
                        <span className="text-sm text-gray-300">{item.views}</span>
                      </div>
                      <div className="flex items-center">
                        <ArrowDownTrayIcon className="w-4 h-4 mr-1.5 text-indigo-400" />
                        <span className="text-sm text-gray-300">{item.downloads}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {timeAgo}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        className="w-8 h-8 bg-gray-700/50 text-gray-300 rounded-md flex items-center justify-center hover:bg-gray-700 transition-colors"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button 
                        className="w-8 h-8 bg-red-900/20 text-red-300 rounded-md flex items-center justify-center hover:bg-red-900/40 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
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
          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
            <CheckCircleIcon className="w-5 h-5 text-green-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Recent Uploads</h2>
        </div>
        
        <Link 
          href="/contributor/content" 
          className="text-sm text-indigo-400 flex items-center hover:text-indigo-300 transition-colors"
        >
          View all <ChevronRightIcon className="ml-1 w-4 h-4" />
        </Link>
      </div>
      
      {renderCards()}
      {renderTable()}
    </div>
  );
} 