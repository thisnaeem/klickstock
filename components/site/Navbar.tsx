import Link from 'next/link';
import { User, Menu, Camera, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { auth } from '@/auth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export const Navbar = async () => {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <nav className="border-b border-gray-800/50 backdrop-blur-xl bg-black/95 sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-white flex items-center gap-2 transition-all duration-300 hover:scale-105">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg hover:shadow-indigo-500/20 transition-all duration-300">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">KlickStock</span>
            </Link>
            <div className="hidden md:block ml-16">
              <div className="flex items-center space-x-12">
                <Link 
                  href="/gallery" 
                  className="text-gray-200 hover:text-white transition-all duration-300 font-semibold text-base relative group px-4 py-2"
                >
                  <span className="relative z-10">Gallery</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-xl opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 ease-out"></span>
                </Link>
                <Link 
                  href="/images" 
                  className="text-gray-200 hover:text-white transition-all duration-300 font-semibold text-base relative group px-4 py-2"
                >
                  <span className="relative z-10">Images</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-xl opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 ease-out"></span>
                </Link>
                <Link 
                  href="/pngs" 
                  className="text-gray-200 hover:text-white transition-all duration-300 font-semibold text-base relative group px-4 py-2"
                >
                  <span className="relative z-10">PNG's</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-xl opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 ease-out"></span>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-gray-200 hover:text-white transition-all duration-300 font-semibold text-base relative group px-4 py-2 flex items-center gap-1 focus:outline-none">
                      <span className="relative z-10 flex items-center gap-1">
                        More <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-xl opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 ease-out"></span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="center" 
                    className="w-52 mt-2 rounded-xl p-2 animate-in fade-in-80 zoom-in-95 bg-black/95 backdrop-blur-lg border border-indigo-500/20 shadow-[0_0_15px_rgba(79,70,229,0.15)] after:content-[''] after:absolute after:top-0 after:left-1/2 after:-translate-x-1/2 after:-translate-y-2 after:w-3 after:h-3 after:rotate-45 after:bg-black/95 after:border-t after:border-l after:border-indigo-500/20"
                  >
                    <DropdownMenuItem className="rounded-lg hover:bg-gradient-to-r hover:from-indigo-600/10 hover:to-purple-600/10 focus:bg-gradient-to-r focus:from-indigo-600/10 focus:to-purple-600/10 transition-all duration-300 my-1 group">
                      <Link href="/about" className="w-full py-1.5 text-gray-200 font-medium group-hover:translate-x-1 transition-transform duration-300">About Us</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg hover:bg-gradient-to-r hover:from-indigo-600/10 hover:to-purple-600/10 focus:bg-gradient-to-r focus:from-indigo-600/10 focus:to-purple-600/10 transition-all duration-300 my-1 group">
                      <Link href="/pricing" className="w-full py-1.5 text-gray-200 font-medium group-hover:translate-x-1 transition-transform duration-300">Pricing</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg hover:bg-gradient-to-r hover:from-indigo-600/10 hover:to-purple-600/10 focus:bg-gradient-to-r focus:from-indigo-600/10 focus:to-purple-600/10 transition-all duration-300 my-1 group">
                      <Link href="/contact" className="w-full py-1.5 text-gray-200 font-medium group-hover:translate-x-1 transition-transform duration-300">Contact</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg hover:bg-gradient-to-r hover:from-indigo-600/10 hover:to-purple-600/10 focus:bg-gradient-to-r focus:from-indigo-600/10 focus:to-purple-600/10 transition-all duration-300 my-1 group">
                      <Link href="/blog" className="w-full py-1.5 text-gray-200 font-medium group-hover:translate-x-1 transition-transform duration-300">Blog</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-5">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full px-2 h-12 hover:bg-gradient-to-r hover:from-indigo-600/10 hover:to-purple-600/10 transition-all duration-300 hover:shadow-[0_0_15px_rgba(79,70,229,0.15)] border border-transparent hover:border-indigo-500/20 group flex items-center gap-2">
                    <Avatar className="transition-transform duration-300 group-hover:scale-105">
                      <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                        {session.user.name ? session.user.name[0] : <User className="h-5 w-5" />}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-gray-200 font-medium hidden md:block">{session.user.name || "User"}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400 transition-transform duration-300 group-hover:rotate-180 hidden md:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-60 mt-2 rounded-xl p-2 animate-in fade-in-80 zoom-in-95 bg-black/95 backdrop-blur-lg border border-indigo-500/20 shadow-[0_0_15px_rgba(79,70,229,0.15)] after:content-[''] after:absolute after:top-0 after:right-[20px] after:-translate-y-2 after:w-3 after:h-3 after:rotate-45 after:bg-black/95 after:border-t after:border-l after:border-indigo-500/20"
                >
                  <DropdownMenuLabel className="px-4 py-3 text-gray-200 text-sm">
                    <div className="font-bold text-base">{session.user.name || "User"}</div>
                    <div className="text-xs text-gray-400 mt-1 truncate">{session.user.email}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 my-1" />
                  
                  <DropdownMenuItem className="rounded-lg hover:bg-gradient-to-r hover:from-indigo-600/10 hover:to-purple-600/10 focus:bg-gradient-to-r focus:from-indigo-600/10 focus:to-purple-600/10 transition-all duration-300 my-1 group">
                    <Link href="/profile" className="w-full py-1.5 text-gray-200 font-medium group-hover:translate-x-1 transition-transform duration-300">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg hover:bg-gradient-to-r hover:from-indigo-600/10 hover:to-purple-600/10 focus:bg-gradient-to-r focus:from-indigo-600/10 focus:to-purple-600/10 transition-all duration-300 my-1 group">
                    <Link href="/downloads" className="w-full py-1.5 text-gray-200 font-medium group-hover:translate-x-1 transition-transform duration-300">
                      My Downloads
                    </Link>
                  </DropdownMenuItem>
                  
                  {(session.user.role === "CONTRIBUTOR" || session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN") && (
                    <DropdownMenuItem className="rounded-lg hover:bg-gradient-to-r hover:from-indigo-600/10 hover:to-purple-600/10 focus:bg-gradient-to-r focus:from-indigo-600/10 focus:to-purple-600/10 transition-all duration-300 my-1 group">
                      <Link href="/contributor" className="w-full py-1.5 text-gray-200 font-medium group-hover:translate-x-1 transition-transform duration-300">
                        Contributor Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {(session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN") && (
                    <DropdownMenuItem className="rounded-lg hover:bg-gradient-to-r hover:from-indigo-600/10 hover:to-purple-600/10 focus:bg-gradient-to-r focus:from-indigo-600/10 focus:to-purple-600/10 transition-all duration-300 my-1 group">
                      <Link href="/admin" className="w-full py-1.5 text-gray-200 font-medium group-hover:translate-x-1 transition-transform duration-300">
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuSeparator className="bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 my-1" />
                  
                  <DropdownMenuItem className="rounded-lg text-red-400 hover:text-red-300 hover:bg-gradient-to-r hover:from-red-900/20 hover:to-red-800/20 focus:bg-gradient-to-r focus:from-red-900/20 focus:to-red-800/20 transition-all duration-300 my-1 group">
                    <Link href="/api/auth/signout" className="w-full py-1.5 font-medium group-hover:translate-x-1 transition-transform duration-300">
                      Sign out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="font-medium text-gray-200 hover:text-white px-6 py-6 h-12 rounded-xl hover:bg-gradient-to-r hover:from-indigo-600/10 hover:to-purple-600/10 transition-all duration-300 border border-transparent hover:border-indigo-500/20 hover:shadow-[0_0_15px_rgba(79,70,229,0.15)]">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium px-6 py-6 h-12 rounded-xl shadow-md hover:shadow-[0_5px_15px_rgba(79,70,229,0.4)] transition-all duration-300 hover:-translate-y-0.5">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
            <Button variant="ghost" className="md:hidden rounded-xl h-12 w-12 p-0 flex items-center justify-center hover:bg-gradient-to-r hover:from-indigo-600/10 hover:to-purple-600/10 text-gray-200 transition-all duration-300 border border-transparent hover:border-indigo-500/20 hover:shadow-[0_0_15px_rgba(79,70,229,0.15)]">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}; 