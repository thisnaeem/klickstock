export default function TermsPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="relative py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Terms of Use
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Please read these terms carefully before using KlickStock
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-blue max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using KlickStock, you accept and agree to be bound by the terms and provision of this agreement.
          </p>

          <h2>2. User Account</h2>
          <p>
            To access certain features of the platform, you must register for an account. You agree to:
          </p>
          <ul>
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Promptly update any changes to your information</li>
            <li>Accept responsibility for all activities that occur under your account</li>
          </ul>

          <h2>3. Content Usage</h2>
          <p>
            All content downloaded from KlickStock must be used in accordance with the purchased license terms. You may not:
          </p>
          <ul>
            <li>Use content without a valid license</li>
            <li>Redistribute or resell content</li>
            <li>Use content in a way that violates applicable laws</li>
            <li>Remove or alter any copyright notices</li>
          </ul>

          <h2>4. User Content</h2>
          <p>
            When uploading content to KlickStock, you:
          </p>
          <ul>
            <li>Retain your rights to your content</li>
            <li>Grant us a license to display and distribute your content</li>
            <li>Are responsible for ensuring you have necessary rights</li>
            <li>Must comply with our content guidelines</li>
          </ul>

          <h2>5. Prohibited Activities</h2>
          <p>
            Users may not engage in any of the following:
          </p>
          <ul>
            <li>Unauthorized access to our systems</li>
            <li>Interference with platform functionality</li>
            <li>Upload of malicious content</li>
            <li>Violation of intellectual property rights</li>
            <li>Harassment or abuse of other users</li>
          </ul>

          <h2>6. Payment Terms</h2>
          <p>
            All purchases are subject to the following terms:
          </p>
          <ul>
            <li>Prices are in USD unless otherwise specified</li>
            <li>Payments are processed securely through our payment providers</li>
            <li>Refunds are subject to our refund policy</li>
            <li>We reserve the right to modify pricing</li>
          </ul>

          <h2>7. Termination</h2>
          <p>
            We reserve the right to terminate or suspend accounts that violate these terms. Upon termination:
          </p>
          <ul>
            <li>Access to the platform will be revoked</li>
            <li>Previously purchased licenses remain valid</li>
            <li>You remain bound by relevant terms</li>
          </ul>

          <h2>8. Changes to Terms</h2>
          <p>
            We may modify these terms at any time. Continued use of the platform after changes constitutes acceptance of new terms.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            If you have any questions about these Terms of Use, please contact us at:
          </p>
          <p className="not-prose">
            <a href="mailto:legal@klickstock.com" className="text-blue-600 hover:text-blue-800">
              legal@klickstock.com
            </a>
          </p>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Last updated: February 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 