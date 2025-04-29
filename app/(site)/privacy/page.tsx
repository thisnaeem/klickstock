export default function PrivacyPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="relative py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Privacy Policy
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              How we collect, use, and protect your data
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-blue max-w-none">
          <h2>1. Information We Collect</h2>
          <h3>Personal Information</h3>
          <p>We collect information that you provide directly to us, including:</p>
          <ul>
            <li>Name and contact information</li>
            <li>Account credentials</li>
            <li>Payment information</li>
            <li>Profile information</li>
            <li>Content you upload</li>
          </ul>

          <h3>Automatically Collected Information</h3>
          <p>We automatically collect certain information when you use our platform:</p>
          <ul>
            <li>Device information</li>
            <li>Usage data</li>
            <li>IP address</li>
            <li>Browser type</li>
            <li>Cookies and similar technologies</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the collected information for:</p>
          <ul>
            <li>Providing and improving our services</li>
            <li>Processing your transactions</li>
            <li>Communicating with you</li>
            <li>Personalizing your experience</li>
            <li>Ensuring platform security</li>
            <li>Analytics and research</li>
          </ul>

          <h2>3. Information Sharing</h2>
          <p>We may share your information with:</p>
          <ul>
            <li>Service providers and partners</li>
            <li>Legal authorities when required</li>
            <li>Other users (based on your privacy settings)</li>
            <li>During business transactions (e.g., merger or acquisition)</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information, including:
          </p>
          <ul>
            <li>Encryption of sensitive data</li>
            <li>Regular security assessments</li>
            <li>Access controls</li>
            <li>Secure data storage</li>
          </ul>

          <h2>5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to data processing</li>
            <li>Data portability</li>
            <li>Withdraw consent</li>
          </ul>

          <h2>6. International Data Transfers</h2>
          <p>
            We may transfer your data to servers located outside your country. We ensure appropriate safeguards are in place for these transfers.
          </p>

          <h2>7. Children's Privacy</h2>
          <p>
            Our services are not intended for children under 13. We do not knowingly collect information from children under 13.
          </p>

          <h2>8. Changes to Privacy Policy</h2>
          <p>
            We may update this privacy policy periodically. We will notify you of any material changes through our platform.
          </p>

          <h2>9. Contact Information</h2>
          <p>
            For privacy-related inquiries, please contact our Data Protection Officer at:
          </p>
          <p className="not-prose">
            <a href="mailto:privacy@klickstock.com" className="text-blue-600 hover:text-blue-800">
              privacy@klickstock.com
            </a>
          </p>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Last updated: February 2024
            </p>
            <p className="text-sm text-gray-600 mt-2">
              KlickStock is committed to protecting your privacy and ensuring the security of your personal information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 