import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Camera, Mail, MapPin, Phone, Github } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">KlickStock</span>
            </div>
            <p className="text-gray-400 mb-6">
              KlickStock provides high-quality stock photos, vectors, and illustrations for your creative projects. Join our community today!
            </p>
            <div className="flex space-x-5">
              <a href="#" className="h-9 w-9 bg-gray-800/50 hover:bg-indigo-600/20 rounded-lg flex items-center justify-center text-gray-400 hover:text-indigo-400 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="h-9 w-9 bg-gray-800/50 hover:bg-indigo-600/20 rounded-lg flex items-center justify-center text-gray-400 hover:text-indigo-400 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="h-9 w-9 bg-gray-800/50 hover:bg-indigo-600/20 rounded-lg flex items-center justify-center text-gray-400 hover:text-indigo-400 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="h-9 w-9 bg-gray-800/50 hover:bg-indigo-600/20 rounded-lg flex items-center justify-center text-gray-400 hover:text-indigo-400 transition-colors">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Content */}
          <div>
            <h3 className="text-lg font-semibold mb-5 text-white">Content</h3>
            <ul className="space-y-3">
              <li><Link href="/gallery" className="text-gray-400 hover:text-indigo-400 transition-colors">Gallery</Link></li>
              <li><Link href="/images" className="text-gray-400 hover:text-indigo-400 transition-colors">Images</Link></li>
              <li><Link href="/pngs" className="text-gray-400 hover:text-indigo-400 transition-colors">PNG's</Link></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-lg font-semibold mb-5 text-white">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-400 hover:text-indigo-400 transition-colors">About Us</Link></li>
              <li><Link href="/pricing" className="text-gray-400 hover:text-indigo-400 transition-colors">Pricing</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-indigo-400 transition-colors">Contact</Link></li>
              <li><Link href="/careers" className="text-gray-400 hover:text-indigo-400 transition-colors">Careers</Link></li>
              
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-5 text-white">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/license" className="text-gray-400 hover:text-indigo-400 transition-colors">License</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-indigo-400 transition-colors">Terms of Use</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/cookies" className="text-gray-400 hover:text-indigo-400 transition-colors">Cookie Policy</Link></li>
              <li><Link href="/copyright" className="text-gray-400 hover:text-indigo-400 transition-colors">Copyright Info</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800/50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <p className="text-gray-500">
              © {new Date().getFullYear()} KlickStock. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link href="/support" className="text-gray-400 hover:text-indigo-400 transition-colors">Support</Link>
              <Link href="/accessibility" className="text-gray-400 hover:text-indigo-400 transition-colors">Accessibility</Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-indigo-400 transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}; 