import Link from "next/link";
import { HelpCircle, ArrowRight, Shield, CheckSquare, Users, ClipboardList } from "lucide-react";

export default function AdminHelpPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <div className="mr-4 p-3 bg-indigo-500/10 rounded-xl">
          <HelpCircle className="h-8 w-8 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Help Center</h1>
          <p className="text-gray-400 mt-1">Resources and guides for managing the platform</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Content Moderation */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-xl border border-gray-700/50">
          <div className="absolute right-0 top-0 w-20 h-20 bg-blue-500/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl"></div>
          <div className="flex items-start mb-4">
            <div className="p-2 mr-3 bg-blue-500/10 rounded-lg">
              <CheckSquare className="h-6 w-6 text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Content Moderation</h2>
          </div>
          <ul className="space-y-3 ml-2">
            <li className="text-gray-300">
              <Link href="/admin/approval" className="flex items-center hover:text-blue-400 transition-colors">
                <ArrowRight className="h-4 w-4 mr-2 text-blue-400" />
                Reviewing submitted content
              </Link>
            </li>
            <li className="text-gray-300">
              <Link href="/admin/approval" className="flex items-center hover:text-blue-400 transition-colors">
                <ArrowRight className="h-4 w-4 mr-2 text-blue-400" />
                Approval guidelines
              </Link>
            </li>
            <li className="text-gray-300">
              <Link href="/admin/rejected" className="flex items-center hover:text-blue-400 transition-colors">
                <ArrowRight className="h-4 w-4 mr-2 text-blue-400" />
                Managing rejected content
              </Link>
            </li>
          </ul>
        </div>

        {/* User Management */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-xl border border-gray-700/50">
          <div className="absolute right-0 top-0 w-20 h-20 bg-purple-500/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl"></div>
          <div className="flex items-start mb-4">
            <div className="p-2 mr-3 bg-purple-500/10 rounded-lg">
              <Users className="h-6 w-6 text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">User Management</h2>
          </div>
          <ul className="space-y-3 ml-2">
            <li className="text-gray-300">
              <Link href="/admin/users" className="flex items-center hover:text-purple-400 transition-colors">
                <ArrowRight className="h-4 w-4 mr-2 text-purple-400" />
                Managing user accounts
              </Link>
            </li>
            <li className="text-gray-300">
              <Link href="/admin/users" className="flex items-center hover:text-purple-400 transition-colors">
                <ArrowRight className="h-4 w-4 mr-2 text-purple-400" />
                Approving new contributors
              </Link>
            </li>
            <li className="text-gray-300">
              <Link href="/admin/users" className="flex items-center hover:text-purple-400 transition-colors">
                <ArrowRight className="h-4 w-4 mr-2 text-purple-400" />
                User permissions
              </Link>
            </li>
          </ul>
        </div>

        {/* Platform Settings */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-xl border border-gray-700/50">
          <div className="absolute right-0 top-0 w-20 h-20 bg-green-500/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl"></div>
          <div className="flex items-start mb-4">
            <div className="p-2 mr-3 bg-green-500/10 rounded-lg">
              <ClipboardList className="h-6 w-6 text-green-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Content Management</h2>
          </div>
          <ul className="space-y-3 ml-2">
            <li className="text-gray-300">
              <Link href="/admin/content" className="flex items-center hover:text-green-400 transition-colors">
                <ArrowRight className="h-4 w-4 mr-2 text-green-400" />
                Managing content library
              </Link>
            </li>
            <li className="text-gray-300">
              <Link href="/admin/content" className="flex items-center hover:text-green-400 transition-colors">
                <ArrowRight className="h-4 w-4 mr-2 text-green-400" />
                Content categories
              </Link>
            </li>
            <li className="text-gray-300">
              <Link href="/admin/content" className="flex items-center hover:text-green-400 transition-colors">
                <ArrowRight className="h-4 w-4 mr-2 text-green-400" />
                Featured content
              </Link>
            </li>
          </ul>
        </div>

        {/* Admin Privileges */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-xl border border-gray-700/50">
          <div className="absolute right-0 top-0 w-20 h-20 bg-red-500/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl"></div>
          <div className="flex items-start mb-4">
            <div className="p-2 mr-3 bg-red-500/10 rounded-lg">
              <Shield className="h-6 w-6 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Admin Privileges</h2>
          </div>
          <ul className="space-y-3 ml-2">
            <li className="text-gray-300">
              <Link href="/admin/settings" className="flex items-center hover:text-red-400 transition-colors">
                <ArrowRight className="h-4 w-4 mr-2 text-red-400" />
                Admin roles and permissions
              </Link>
            </li>
            <li className="text-gray-300">
              <Link href="/admin/settings" className="flex items-center hover:text-red-400 transition-colors">
                <ArrowRight className="h-4 w-4 mr-2 text-red-400" />
                Platform security
              </Link>
            </li>
            <li className="text-gray-300">
              <Link href="/admin/settings" className="flex items-center hover:text-red-400 transition-colors">
                <ArrowRight className="h-4 w-4 mr-2 text-red-400" />
                Access controls
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-xl border border-gray-700/50 mt-8">
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/10 rounded-full -translate-x-1/4 translate-y-1/4 blur-3xl"></div>
        <h2 className="text-xl font-semibold text-white mb-4 relative">Need More Help?</h2>
        <p className="text-gray-300 mb-4">
          If you have questions or need additional assistance, please contact the platform administrator
          or refer to the detailed documentation.
        </p>
        <div className="flex flex-wrap gap-4">
          <a 
            href="mailto:admin@klickstock.com" 
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/20"
          >
            Contact Support
          </a>
          <Link 
            href="/admin/settings" 
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all border border-gray-600"
          >
            Admin Settings
          </Link>
        </div>
      </div>
    </div>
  );
} 