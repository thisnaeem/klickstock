import { Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/10 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600/20 mb-6">
              <Shield className="w-8 h-8 text-indigo-400" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              We take your privacy seriously. Learn how we collect, use, and protect your personal information.
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-invert prose-gray max-w-none">
            <div className="bg-gray-900/60 rounded-2xl p-8 border border-gray-800/50 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
              <p className="text-gray-400 mb-4">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 text-gray-400 space-y-2">
                <li>Name and contact information</li>
                <li>Account credentials</li>
                <li>Payment information</li>
                <li>Content you upload or share</li>
                <li>Communications with us</li>
              </ul>
            </div>

            <div className="bg-gray-900/60 rounded-2xl p-8 border border-gray-800/50 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
              <p className="text-gray-400 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-gray-400 space-y-2">
                <li>Provide and maintain our services</li>
                <li>Process your transactions</li>
                <li>Send you updates and marketing communications</li>
                <li>Improve our services</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>

            <div className="bg-gray-900/60 rounded-2xl p-8 border border-gray-800/50 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Information Sharing</h2>
              <p className="text-gray-400 mb-4">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="list-disc pl-6 text-gray-400 space-y-2">
                <li>Service providers who assist in our operations</li>
                <li>Law enforcement when required by law</li>
                <li>Other users when you choose to share content publicly</li>
              </ul>
            </div>

            <div className="bg-gray-900/60 rounded-2xl p-8 border border-gray-800/50">
              <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
              <p className="text-gray-400 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-400 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of marketing communications</li>
                <li>Lodge a complaint with supervisory authorities</li>
              </ul>
            </div>

            <div className="mt-12 text-gray-400 text-sm">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
              <p className="mt-2">
                If you have any questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:privacy@klickstock.com" className="text-indigo-400 hover:text-indigo-300">
                  privacy@klickstock.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 