"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Images, 
  Users, 
  CheckSquare,
  Settings, 
  ShieldAlert,
  LogOut
} from "lucide-react";

export const AdminSidebar = () => {
  const pathname = usePathname();
  
  const navItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      label: "Content Approval",
      href: "/admin/approval",
      icon: <CheckSquare className="w-5 h-5" />
    },
    {
      label: "Manage Users",
      href: "/admin/users",
      icon: <Users className="w-5 h-5" />
    },
    {
      label: "Content Library",
      href: "/admin/content",
      icon: <Images className="w-5 h-5" />
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: <Settings className="w-5 h-5" />
    },
  ];

  return (
    <div className="w-64 bg-gray-900 h-full flex flex-col text-white">
      <div className="p-6">
        <Link href="/" className="text-2xl font-bold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
          <span>Freepik</span>
        </Link>
        <div className="mt-2 text-sm text-gray-400 flex items-center">
          <ShieldAlert className="w-4 h-4 mr-1" />
          Admin Panel
        </div>
      </div>

      <div className="px-3 py-2 flex-1">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center px-3 py-2 text-sm font-medium rounded-lg
                  ${isActive 
                    ? "bg-gray-800 text-white" 
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"}
                `}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-800">
        <Link 
          href="/api/auth/signout" 
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign out
        </Link>
      </div>
    </div>
  );
}; 