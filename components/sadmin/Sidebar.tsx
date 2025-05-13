"use client";

import React, { useState, useEffect, JSX } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Users, 
  UserCog, 
  ShieldCheck, 
  LayoutDashboard,
  LogOut,
  Camera,
  Menu,
  X
} from "lucide-react";
import { signOut } from "next-auth/react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      href: "/sadmin",
      icon: <LayoutDashboard className="w-5 h-5" />
    }
  ];

  const manageItems = [
    {
      label: "Users",
      href: "/sadmin/users",
      icon: <Users className="w-5 h-5" />
    },
    {
      label: "Contributors",
      href: "/sadmin/contributors",
      icon: <UserCog className="w-5 h-5" />
    },
    {
      label: "Admins",
      href: "/sadmin/admins",
      icon: <ShieldCheck className="w-5 h-5" />
    }
  ];

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
            <Link href="/" className="text-2xl font-bold text-white flex items-center gap-1 relative">
              KlickStock
            </Link>
            <div className="text-sm text-indigo-200 font-medium">SuperAdmin Portal</div>
          </div>
        </div>
      </div>

      <div className="px-4 py-2 flex-1 overflow-y-auto">
        <div className="mb-6">
          <h3 className="px-3 mb-2 text-xs font-semibold text-indigo-300 uppercase tracking-wider">
            General
          </h3>
          <nav className="space-y-1.5">
            {generalItems.map((item, i) => renderNavItem(item, pathname, i))}
          </nav>
        </div>

        <div className="mb-6">
          <h3 className="px-3 mb-2 text-xs font-semibold text-indigo-300 uppercase tracking-wider">
            Manage Users
          </h3>
          <nav className="space-y-1.5">
            {manageItems.map((item, i) => renderNavItem(item, pathname, i))}
          </nav>
        </div>
      </div>

      <div className="p-4 mt-auto">
        <div className="border-t border-gray-700/50 pt-4">
          <button 
            onClick={() => signOut()}
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

  // For desktop, we render a fixed sidebar
  if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
    return (
      <div className="h-full w-72 bg-gray-900 bg-gradient-to-b from-gray-900 via-gray-900 to-[#161b2e] border-r border-gray-800/50 flex flex-col">
        <SidebarContent />
      </div>
    );
  }

  // Mobile version with toggle
  return (
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
              <Link href="/" className="text-2xl font-bold text-white flex items-center gap-1 relative">
                KlickStock
              </Link>
              <div className="text-sm text-indigo-200 font-medium">SuperAdmin Portal</div>
            </div>
          </div>
        </div>

        <div className="px-4 py-2 flex-1 overflow-y-auto">
          <div className="mb-6">
            <h3 className="px-3 mb-2 text-xs font-semibold text-indigo-300 uppercase tracking-wider">
              General
            </h3>
            <nav className="space-y-1.5">
              {generalItems.map((item, i) => renderNavItem(item, pathname, i))}
            </nav>
          </div>

          <div className="mb-6">
            <h3 className="px-3 mb-2 text-xs font-semibold text-indigo-300 uppercase tracking-wider">
              Manage Users
            </h3>
            <nav className="space-y-1.5">
              {manageItems.map((item, i) => renderNavItem(item, pathname, i))}
            </nav>
          </div>
        </div>

        <div className="p-4 mt-auto">
          <div className="border-t border-gray-700/50 pt-4">
            <button 
              onClick={() => signOut()}
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
}

// Helper function to render a nav item
function renderNavItem(
  item: { label: string; href: string; icon: JSX.Element }, 
  pathname: string,
  index: number
) {
  const isActive = pathname === item.href;
  
  return (
    <Link
      key={`${item.href}-${index}`}
      href={item.href}
      className={`
        group flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all
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
    </Link>
  );
} 