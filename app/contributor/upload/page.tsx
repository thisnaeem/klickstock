import { auth } from "@/auth";
import { UploadForm } from "@/components/contributor/UploadForm";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default async function UploadPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return (
    <div className="w-full max-w-full min-h-screen flex flex-col">
      {/* Compact Header */}
      <div className="relative mb-4">
        <div className="bg-gradient-to-r from-gray-900 to-indigo-950 px-4 py-6 rounded-xl shadow-lg border border-gray-800/50">
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Link 
                href="/contributor"
                className="inline-flex items-center justify-center p-2 rounded-full bg-gray-800/40 backdrop-blur-sm text-gray-300 hover:bg-gray-700/60 hover:text-white transition-all duration-200"
              >
                <ArrowLeftIcon className="w-4 h-4" />
              </Link>
              <span className="text-gray-400 text-sm">Back to Dashboard</span>
            </div>
            
            <div className="text-white">
              <h1 className="text-2xl font-bold tracking-tight">
                Submit New Content
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Form Area - Positioned Higher */}
      <div className="flex-1 flex flex-col">
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700/30 overflow-hidden">
          <UploadForm />
        </div>
        
        {/* Upload Instructions */}
        <div className="mt-6 bg-gray-900/50 p-5 rounded-xl border border-gray-800/40">
          <h3 className="text-lg font-medium text-white mb-3">Upload Guidelines</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="flex items-start">
              <span className="text-indigo-400 mr-2">•</span>
              <span>Images must be your original work or properly licensed</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-400 mr-2">•</span>
              <span>Minimum resolution: 1920x1080 pixels</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-400 mr-2">•</span>
              <span>Add descriptive titles and comprehensive tags for better discoverability</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-400 mr-2">•</span>
              <span>Maximum file size: 50MB per image</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-400 mr-2">•</span>
              <span>All uploads are reviewed by our team before being published</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 