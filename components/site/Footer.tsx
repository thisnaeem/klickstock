import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Content */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Content</h3>
            <ul className="space-y-2">
              <li><Link href="/vectors" className="text-gray-600 hover:text-gray-900">Vectors</Link></li>
              <li><Link href="/photos" className="text-gray-600 hover:text-gray-900">Photos</Link></li>
              <li><Link href="/videos" className="text-gray-600 hover:text-gray-900">Videos</Link></li>
              <li><Link href="/music" className="text-gray-600 hover:text-gray-900">Music</Link></li>
              <li><Link href="/psd" className="text-gray-600 hover:text-gray-900">PSD</Link></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Information</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link></li>
              <li><Link href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link></li>
              <li><Link href="/support" className="text-gray-600 hover:text-gray-900">Support</Link></li>
              <li><Link href="/terms" className="text-gray-600 hover:text-gray-900">Terms</Link></li>
              <li><Link href="/privacy" className="text-gray-600 hover:text-gray-900">Privacy</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/license" className="text-gray-600 hover:text-gray-900">License</Link></li>
              <li><Link href="/terms" className="text-gray-600 hover:text-gray-900">Terms of use</Link></li>
              <li><Link href="/privacy" className="text-gray-600 hover:text-gray-900">Privacy policy</Link></li>
              <li><Link href="/cookies" className="text-gray-600 hover:text-gray-900">Cookie policy</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Social</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <p className="text-center text-gray-500">
            © {new Date().getFullYear()} Freepik Company S.L. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}; 