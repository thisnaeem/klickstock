import Link from 'next/link';
import { User, Menu, Search, Camera } from 'lucide-react';
import { Button } from '../ui/button';
import { auth } from '@/auth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export const Navbar = async () => {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <nav className="border-b backdrop-blur-md bg-white/80 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <div className="h-9 w-9 rounded-md bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <span>KlickStock</span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-8">
                <Link href="/gallery" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Gallery
                </Link>
                <Link href="/images" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Images
                </Link>
                <Link href="/pngs" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  PNG's
                </Link>
                <Link href="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Pricing
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="rounded-full hidden md:flex items-center">
              <Search className="h-4 w-4 mr-2" />
              <span>Search</span>
            </Button>
            
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full p-0 w-10 h-10">
                    <Avatar>
                      <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                        {session.user.name ? session.user.name[0] : <User className="h-5 w-5" />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/profile" className="w-full">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/downloads" className="w-full">My Downloads</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/collections" className="w-full">Collections</Link>
                  </DropdownMenuItem>
                  {(session.user.role === "CONTRIBUTOR" || session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN") && (
                    <DropdownMenuItem>
                      <Link href="/contributor" className="w-full">Contributor Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  {(session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN") && (
                    <DropdownMenuItem>
                      <Link href="/admin" className="w-full">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/api/auth/signout" className="w-full">Sign out</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="font-medium">Login</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium">Sign up</Button>
                </Link>
              </>
            )}
            <Button variant="ghost" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}; 