"use client";

import React, { useState, useEffect, JSX } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  CheckCircle, 
  Settings, 
  HelpCircle,
  LogOut,
  Menu,
  X,
  Camera,
  Clock,
  AlertCircle
} from "lucide-react";

export const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [counts, setCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Handle hydration
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    // Fetch the counts from the server
    const fetchCounts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/counts');
        if (response.ok) {
          const data = await response.json();
          setCounts({
            pending: data.pending || 0,
            approved: data.approved || 0,
            rejected: data.rejected || 0
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

  // Close the mobile menu when a route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isMobileMenuOpen]);
  
  const generalItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="w-5 h-5" />
    }
  ];

  const contentItems = [
    {
      label: "Submissions",
      href: "/admin/submissions",
      icon: <Clock className="w-5 h-5" />,
      count: counts.pending
    },
    {
      label: "Approved",
      href: "/admin/approved",
      icon: <CheckCircle className="w-5 h-5" />,
      count: counts.approved
    },
    {
      label: "Rejected",
      href: "/admin/rejected",
      icon: <AlertCircle className="w-5 h-5" />,
      count: counts.rejected
    }
  ];

  const systemItems = [
    {
      label: "Settings",
      href: "/admin/settings",
      icon: <Settings className="w-5 h-5" />
    },
    {
      label: "Help",
      href: "/admin/help",
      icon: <HelpCircle className="w-5 h-5" />
    }
  ];
  
  // Handle navigation
  const handleNavigation = (href: string) => {
    router.push(href);
    setIsMobileMenuOpen(false);
  };

  // Desktop sidebar content
  const SidebarContent = () => (
    <>
      <div className="p-6 relative">
        {/* Logo background glow effect */}
        <div className="absolute -left-2 top-4 w-20 h-20 bg-indigo-500/20 rounded-full blur-xl"></div>
        
        <div className="relative flex items-center">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <div className="ml-3">
            <button 
              onClick={() => handleNavigation("/")}
              className="text-2xl font-bold text-white flex items-center gap-1 relative"
            >
              KlickStock
            </button>
            <div className="text-sm text-indigo-200 font-medium">Admin Portal</div>
          </div>
        </div>
      </div>

      <div className="px-4 py-2 flex-1 overflow-y-auto">
        <div className="mb-6">
          <h3 className="px-3 mb-2 text-xs font-semibold text-indigo-300 uppercase tracking-wider">
            General
          </h3>
          <nav className="space-y-1.5">
            {generalItems.map((item, i) => renderNavItem(item, pathname, i, handleNavigation))}
          </nav>
        </div>

        <div className="mb-6">
          <h3 className="px-3 mb-2 text-xs font-semibold text-indigo-300 uppercase tracking-wider">
            Manage Content
          </h3>
          <nav className="space-y-1.5">
            {contentItems.map((item, i) => renderNavItemWithCount(item, pathname, isLoading, i, handleNavigation))}
          </nav>
        </div>

        <div className="mb-6">
          <h3 className="px-3 mb-2 text-xs font-semibold text-indigo-300 uppercase tracking-wider">
            System
          </h3>
          <nav className="space-y-1.5">
            {systemItems.map((item, i) => renderNavItem(item, pathname, i, handleNavigation))}
          </nav>
        </div>
      </div>

      <div className="p-4 mt-auto">
        <div className="border-t border-gray-700/50 pt-4">
          <button 
            onClick={() => handleNavigation("/api/auth/signout")}
            className="flex items-center px-4 py-3 text-sm font-medium text-gray-300 rounded-xl hover:bg-gray-800/60 hover:text-red-300 transition-all w-full"
          >
            <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center mr-3">
              <LogOut className="w-5 h-5 text-red-300" />
            </div>
            Sign out
          </button>
        </div>
      </div>
    </>
  );

  // For desktop screen sizes
  const DesktopSidebar = () => (
    <div className="hidden lg:flex h-full w-72 bg-gray-900 bg-gradient-to-b from-gray-900 via-gray-900 to-[#161b2e] border-r border-gray-800/50 flex-col">
      <SidebarContent />
    </div>
  );

  // Mobile version with toggle
  const MobileSidebar = () => (
    <div className="lg:hidden">
      {/* Mobile Toggle Button - only show when sidebar is closed */}
      {!isMobileMenuOpen && (
        <button
          id="mobile-toggle"
          onClick={() => setIsMobileMenuOpen(true)}
          className="fixed top-4 left-4 z-50 p-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-blue-500/30 focus:outline-none transition-all duration-200 hover:scale-105"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}
      
      {/* Dark overlay - only visible when sidebar is open */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      
      {/* Mobile Sidebar */}
      <div 
        className={`
          fixed top-0 left-0 z-50 h-full w-80 transform transition-transform duration-300 ease-in-out
          bg-gray-900 bg-gradient-to-b from-gray-900 via-gray-900 to-[#161b2e] border-r border-gray-800/50 flex flex-col
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-6 relative flex flex-col">
          {/* Logo background glow effect */}
          <div className="absolute -left-2 top-4 w-20 h-20 bg-indigo-500/20 rounded-full blur-xl"></div>
          
          {/* Close button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute right-3 top-3 p-2 rounded-full text-gray-300 hover:bg-gray-800/60 hover:text-white transition-all"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="relative flex items-center">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div className="ml-3">
              <button 
                onClick={() => handleNavigation("/")}
                className="text-2xl font-bold text-white flex items-center gap-1 relative"
              >
                KlickStock
              </button>
              <div className="text-sm text-indigo-200 font-medium">Admin Portal</div>
            </div>
          </div>
        </div>

        <div className="px-4 py-2 flex-1 overflow-y-auto">
          <div className="mb-6">
            <h3 className="px-3 mb-2 text-xs font-semibold text-indigo-300 uppercase tracking-wider">
              General
            </h3>
            <nav className="space-y-1.5">
              {generalItems.map((item, i) => renderNavItem(item, pathname, i, handleNavigation))}
            </nav>
          </div>

          <div className="mb-6">
            <h3 className="px-3 mb-2 text-xs font-semibold text-indigo-300 uppercase tracking-wider">
              Manage Content
            </h3>
            <nav className="space-y-1.5">
              {contentItems.map((item, i) => renderNavItemWithCount(item, pathname, isLoading, i, handleNavigation))}
            </nav>
          </div>

          <div className="mb-6">
            <h3 className="px-3 mb-2 text-xs font-semibold text-indigo-300 uppercase tracking-wider">
              System
            </h3>
            <nav className="space-y-1.5">
              {systemItems.map((item, i) => renderNavItem(item, pathname, i, handleNavigation))}
            </nav>
          </div>
        </div>

        <div className="p-4 mt-auto">
          <div className="border-t border-gray-700/50 pt-4">
            <button 
              onClick={() => handleNavigation("/api/auth/signout")}
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-300 rounded-xl hover:bg-gray-800/60 hover:text-red-300 transition-all w-full"
            >
              <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center mr-3">
                <LogOut className="w-5 h-5 text-red-300" />
              </div>
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render both versions without client-side window checks that cause hydration issues
  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

// Helper function to render a nav item
function renderNavItem(
  item: { label: string; href: string; icon: JSX.Element }, 
  pathname: string,
  index: number,
  onNavigate: (href: string) => void
) {
  const isActive = pathname === item.href;
  
  return (
    <button
      key={`${item.href}-${index}`}
      onClick={() => onNavigate(item.href)}
      className={`
        group flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all w-full
        ${isActive 
          ? "bg-gradient-to-r from-blue-600/30 to-indigo-600/30 text-white" 
          : "text-gray-300 hover:bg-gray-800/60 hover:text-white"}
      `}
    >
      <div className={`
        w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all
        ${isActive 
          ? "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md" 
          : "bg-gray-800/60 group-hover:bg-gray-700/50"}
      `}>
        {item.icon}
      </div>
      <span>{item.label}</span>
      
      {/* Active indicator */}
      {isActive && (
        <div className="ml-auto h-2 w-2 rounded-full bg-blue-400"></div>
      )}
    </button>
  );
}

// Helper function to render a nav item with count
function renderNavItemWithCount(
  item: { label: string; href: string; icon: JSX.Element; count: number }, 
  pathname: string,
  isLoading: boolean,
  index: number,
  onNavigate: (href: string) => void
) {
  const isActive = pathname === item.href;
  
  return (
    <button
      key={`${item.href}-${index}`}
      onClick={() => onNavigate(item.href)}
      className={`
        group flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all w-full
        ${isActive 
          ? "bg-gradient-to-r from-blue-600/30 to-indigo-600/30 text-white" 
          : "text-gray-300 hover:bg-gray-800/60 hover:text-white"}
      `}
    >
      <div className={`
        w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all
        ${isActive 
          ? "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md" 
          : "bg-gray-800/60 group-hover:bg-gray-700/50"}
      `}>
        {item.icon}
      </div>
      <span>{item.label}</span>
      
      {isLoading ? (
        <div className="ml-auto w-6 h-6 bg-gray-700/50 rounded-full animate-pulse"></div>
      ) : (
        item.count > 0 && (
          <div className="ml-auto px-2 py-0.5 text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-inner">
            {item.count}
          </div>
        )
      )}
      
      {/* Active indicator */}
      {isActive && item.count === 0 && !isLoading && (
        <div className="ml-auto h-2 w-2 rounded-full bg-blue-400"></div>
      )}
    </button>
  );
} 