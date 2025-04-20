"use client";

import React, { useState, useEffect, JSX } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  HomeIcon,
  ArrowUpTrayIcon,
  PhotoIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  CameraIcon,
  DocumentCheckIcon,
  ClockIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  DocumentIcon
} from "@heroicons/react/24/solid";

export const Sidebar = () => {
  const pathname = usePathname();
  const [counts, setCounts] = useState({
    drafts: 0,
    pending: 0,
    rejected: 0,
    approved: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch the counts from the server
    const fetchCounts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/contributor/counts');
        if (response.ok) {
          const data = await response.json();
          setCounts({
            drafts: data.drafts || 0,
            pending: data.pending || 0,
            rejected: data.rejected || 0,
            approved: data.approved || 0
          });
        }
      } catch (error) {
        console.error("Failed to fetch counts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
    
    // Add a refresh interval - every 5 minutes
    const interval = setInterval(fetchCounts, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const generalItems = [
    {
      label: "Dashboard",
      href: "/contributor",
      icon: <HomeIcon className="w-5 h-5" />
    },
    {
      label: "Upload Files",
      href: "/contributor/upload",
      icon: <ArrowUpTrayIcon className="w-5 h-5" />
    }
  ];

  const contentItems = [
    {
      label: "Upload",
      href: "/contributor/drafts",
      icon: <DocumentIcon className="w-5 h-5" />,
      count: counts.drafts
    },
    {
      label: "Under Review",
      href: "/contributor/under-review",
      icon: <ClockIcon className="w-5 h-5" />,
      count: counts.pending
    },
    {
      label: "Rejections",
      href: "/contributor/rejections",
      icon: <ExclamationCircleIcon className="w-5 h-5" />,
      count: counts.rejected
    },
    {
      label: "Published",
      href: "/contributor/published",
      icon: <CheckCircleIcon className="w-5 h-5" />,
      count: counts.approved
    }
  ];

  const supportItems = [
    {
      label: "Settings",
      href: "/contributor/settings",
      icon: <Cog6ToothIcon className="w-5 h-5" />
    },
    {
      label: "Help",
      href: "/contributor/help",
      icon: <QuestionMarkCircleIcon className="w-5 h-5" />
    }
  ];

  return (
    <div className="w-64 bg-gray-900 h-full border-r border-gray-800 flex flex-col shadow-xl">
      <div className="p-6">
        <Link href="/" className="text-2xl font-bold text-white flex items-center gap-2">
          <div className="h-9 w-9 rounded-md bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <CameraIcon className="w-5 h-5 text-white" />
          </div>
          <span>KlickStock</span>
        </Link>
        <div className="mt-2 text-sm text-gray-400">Contributor Portal</div>
      </div>

      <div className="px-3 py-2 flex-1">
        <div className="mb-4">
          <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            General
          </h3>
          <nav className="mt-2 space-y-1">
            {generalItems.map((item) => renderNavItem(item, pathname))}
          </nav>
        </div>

        <div className="mb-4">
          <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Manage Content
          </h3>
          <nav className="mt-2 space-y-1">
            {contentItems.map((item) => renderNavItemWithCount(item, pathname, isLoading))}
          </nav>
        </div>

        <div>
          <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Support
          </h3>
          <nav className="mt-2 space-y-1">
            {supportItems.map((item) => renderNavItem(item, pathname))}
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-gray-800">
        <Link 
          href="/api/auth/signout" 
          className="flex items-center px-3 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-red-300 transition-colors"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
          Sign out
        </Link>
      </div>
    </div>
  );
};

// Helper function to render a nav item
function renderNavItem(item: { label: string; href: string; icon: JSX.Element }, pathname: string) {
  const isActive = pathname === item.href;
  
  return (
    <Link
      key={item.href}
      href={item.href}
      className={`
        flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
        ${isActive 
          ? "bg-gray-800 text-blue-400" 
          : "text-gray-300 hover:bg-gray-800 hover:text-blue-300"}
      `}
    >
      <span className="mr-3">{item.icon}</span>
      {item.label}
    </Link>
  );
}

// Helper function to render a nav item with count
function renderNavItemWithCount(
  item: { label: string; href: string; icon: JSX.Element; count: number }, 
  pathname: string,
  isLoading: boolean
) {
  const isActive = pathname === item.href;
  
  return (
    <Link
      key={item.href}
      href={item.href}
      className={`
        flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors
        ${isActive 
          ? "bg-gray-800 text-blue-400" 
          : "text-gray-300 hover:bg-gray-800 hover:text-blue-300"}
      `}
    >
      <div className="flex items-center">
        <span className="mr-3">{item.icon}</span>
        {item.label}
      </div>
      
      {isLoading ? (
        <div className="w-6 h-6 bg-gray-700 rounded-full animate-pulse"></div>
      ) : (
        item.count > 0 && (
          <div className="px-2 py-0.5 text-xs font-bold text-white bg-gray-700 rounded-full">
            {item.count}
          </div>
        )
      )}
    </Link>
  );
} 