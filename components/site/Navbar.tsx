import Link from 'next/link';
import { User, Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { auth } from '@/auth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';



export const Navbar = async () => {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <nav className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
              Freepik
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-6">
                <Link href="/gallery" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Gallery
                </Link>
                <Link href="/vectors" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Vectors
                </Link>
                <Link href="/photos" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Photos
                </Link>
                <Link href="/videos" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Videos
                </Link>
                <Link href="/music" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Music
                </Link>
                <Link href="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Pricing
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full p-0 w-10 h-10">
                    <Avatar>
                      <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
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
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">Sign up</Button>
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