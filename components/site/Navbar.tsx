import Link from 'next/link';
import { User, Menu, Camera } from 'lucide-react';
import { Button } from '../ui/button';
import { auth } from '@/auth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export const Navbar = async () => {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <nav className="border-b backdrop-blur-lg bg-white/90 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">KlickStock</span>
            </Link>
            <div className="hidden md:block ml-12">
              <div className="flex items-center space-x-10">
                <Link href="/gallery" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium text-[15px]">
                  Gallery
                </Link>
                <Link href="/images" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium text-[15px]">
                  Images
                </Link>
                <Link href="/pngs" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium text-[15px]">
                  PNG's
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-5">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full p-0 w-11 h-11 hover:bg-gray-100">
                    <Avatar>
                      <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                        {session.user.name ? session.user.name[0] : <User className="h-5 w-5" />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-1 rounded-xl p-1">
                  <DropdownMenuLabel className="px-3 py-2">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="rounded-lg">
                    <Link href="/profile" className="w-full py-0.5">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg">
                    <Link href="/downloads" className="w-full py-0.5">My Downloads</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg">
                    <Link href="/collections" className="w-full py-0.5">Collections</Link>
                  </DropdownMenuItem>
                  {(session.user.role === "CONTRIBUTOR" || session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN") && (
                    <DropdownMenuItem className="rounded-lg">
                      <Link href="/contributor" className="w-full py-0.5">Contributor Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  {(session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN") && (
                    <DropdownMenuItem className="rounded-lg">
                      <Link href="/admin" className="w-full py-0.5">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="rounded-lg text-red-500 focus:text-red-500 focus:bg-red-50">
                    <Link href="/api/auth/signout" className="w-full py-0.5">Sign out</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="font-medium text-gray-700 hover:text-indigo-600 px-5 rounded-full h-11">Login</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-6 rounded-full h-11 shadow-md hover:shadow-lg transition-all">Sign up</Button>
                </Link>
              </>
            )}
            <Button variant="ghost" className="md:hidden rounded-full h-11 w-11 p-0 flex items-center justify-center">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}; 