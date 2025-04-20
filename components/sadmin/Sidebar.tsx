"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Users, 
  UserCog, 
  ShieldCheck, 
  LayoutDashboard,
  LogOut
} from "lucide-react";
import { signOut } from "next-auth/react";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/sadmin",
    active: (path: string) => path === "/sadmin"
  },
  {
    label: "Users",
    icon: Users,
    href: "/sadmin/users",
    active: (path: string) => path === "/sadmin/users"
  },
  {
    label: "Contributors",
    icon: UserCog,
    href: "/sadmin/contributors",
    active: (path: string) => path === "/sadmin/contributors"
  },
  {
    label: "Admins",
    icon: ShieldCheck,
    href: "/sadmin/admins",
    active: (path: string) => path === "/sadmin/admins"
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white h-screen border-r sticky top-0 overflow-y-auto hidden md:block">
      <div className="p-6">
        <h1 className="text-xl font-bold text-blue-600">SuperAdmin</h1>
      </div>
      <div className="mt-2">
        <nav className="space-y-1 px-3">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`flex items-center px-3 py-3 text-sm rounded-md transition-colors ${
                route.active(pathname)
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <route.icon className={`h-5 w-5 mr-3 ${
                route.active(pathname)
                  ? "text-blue-600"
                  : "text-gray-400"
              }`} />
              {route.label}
            </Link>
          ))}
          
          <button
            onClick={() => signOut()}
            className="w-full flex items-center px-3 py-3 text-sm rounded-md transition-colors text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="h-5 w-5 mr-3 text-gray-400" />
            Logout
          </button>
        </nav>
      </div>
    </div>
  );
} 