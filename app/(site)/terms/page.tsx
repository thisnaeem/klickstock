import { Scale } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/10 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600/20 mb-6">
              <Scale className="w-8 h-8 text-indigo-400" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-6">
              Terms of Use
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Please read these terms carefully before using our platform.
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="bg-gray-900/60 rounded-2xl p-8 border border-gray-800/50">
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-400">
                By accessing or using KlickStock, you agree to be bound by these Terms of Use and all applicable laws and regulations.
              </p>
            </div>

            <div className="bg-gray-900/60 rounded-2xl p-8 border border-gray-800/50">
              <h2 className="text-2xl font-bold text-white mb-4">2. User Accounts</h2>
              <div className="text-gray-400 space-y-4">
                <p>When creating an account, you must provide accurate and complete information.</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You are responsible for maintaining the security of your account</li>
                  <li>You must not share your account credentials</li>
                  <li>You must notify us of any unauthorized access</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-900/60 rounded-2xl p-8 border border-gray-800/50">
              <h2 className="text-2xl font-bold text-white mb-4">3. Content Usage</h2>
              <div className="text-gray-400 space-y-4">
                <p>All content downloaded from KlickStock is subject to our license terms:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Content may be used for personal and commercial projects</li>
                  <li>Attribution may be required for certain assets</li>
                  <li>Reselling or redistributing content is prohibited</li>
                  <li>Content cannot be used in trademark or logo designs</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-900/60 rounded-2xl p-8 border border-gray-800/50">
              <h2 className="text-2xl font-bold text-white mb-4">4. Prohibited Activities</h2>
              <div className="text-gray-400 space-y-4">
                <p>Users must not engage in any of the following:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Violating intellectual property rights</li>
                  <li>Uploading malicious content</li>
                  <li>Attempting to breach platform security</li>
                  <li>Harassing other users</li>
                  <li>Scraping or data mining</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-900/60 rounded-2xl p-8 border border-gray-800/50">
              <h2 className="text-2xl font-bold text-white mb-4">5. Termination</h2>
              <p className="text-gray-400">
                We reserve the right to terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever.
              </p>
            </div>

            <div className="mt-12 text-gray-400 text-sm">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
              <p className="mt-2">
                For questions about these terms, please contact{' '}
                <a href="mailto:legal@klickstock.com" className="text-indigo-400 hover:text-indigo-300">
                  legal@klickstock.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 