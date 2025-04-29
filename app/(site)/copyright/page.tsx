import { AlertCircle, FileCheck, Scale, Shield } from 'lucide-react';

const copyrightSections = [
  {
    icon: Shield,
    title: "Copyright Protection",
    content: "All images on KlickStock are protected by copyright law. When you purchase a license, you receive specific usage rights while the original creator retains the copyright."
  },
  {
    icon: FileCheck,
    title: "Content Verification",
    content: "We verify that uploaded content meets our copyright requirements. Contributors must have necessary rights or permissions for all content they submit."
  },
  {
    icon: Scale,
    title: "Fair Use",
    content: "While we protect creators' rights, we acknowledge fair use provisions under copyright law. However, most commercial uses require proper licensing."
  },
  {
    icon: AlertCircle,
    title: "Infringement Claims",
    content: "We take copyright infringement seriously and promptly respond to valid takedown notices. We have processes in place to handle disputes and claims."
  }
];

export default function CopyrightPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="relative py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Copyright Information
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Understanding image rights and protections on KlickStock
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Key Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {copyrightSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {section.title}
                    </h3>
                    <p className="mt-2 text-gray-600">
                      {section.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Information */}
        <div className="prose prose-blue max-w-none">
          <h2>Copyright Ownership</h2>
          <p>
            All images available on KlickStock are protected by international copyright laws. 
            When you purchase a license, you're acquiring specific usage rights while the original 
            creator retains the copyright to their work.
          </p>

          <h2>For Content Creators</h2>
          <h3>Protecting Your Work</h3>
          <ul>
            <li>Your copyright is automatically protected when you create your work</li>
            <li>You retain full rights to your images when uploading to KlickStock</li>
            <li>You can choose which license types to offer for your content</li>
            <li>We provide tools to track and manage your content usage</li>
          </ul>

          <h3>Content Requirements</h3>
          <ul>
            <li>You must own the copyright or have explicit permission to upload content</li>
            <li>Content must be original or properly licensed</li>
            <li>Model and property releases must be obtained when necessary</li>
            <li>Trademarks and logos must be removed unless authorized</li>
          </ul>

          <h2>For Content Users</h2>
          <h3>License Compliance</h3>
          <ul>
            <li>Always review and comply with the license terms</li>
            <li>Purchase appropriate licenses for your intended use</li>
            <li>Keep records of your licenses and usage</li>
            <li>Respect usage limitations and restrictions</li>
          </ul>

          <h2>Copyright Infringement</h2>
          <h3>Reporting Violations</h3>
          <p>
            If you believe your copyright has been infringed, you can submit a DMCA takedown notice. 
            Please include:
          </p>
          <ul>
            <li>Identification of the copyrighted work</li>
            <li>Identification of the infringing material</li>
            <li>Your contact information</li>
            <li>A statement of good faith belief in the infringement</li>
            <li>A statement of accuracy under penalty of perjury</li>
          </ul>

          <h3>Counter Notices</h3>
          <p>
            If you believe your content was removed in error, you may submit a counter notice. 
            We will review all counter notices and restore content when appropriate.
          </p>

          <h2>Contact Information</h2>
          <p>
            For copyright-related inquiries or to report infringement, please contact our copyright team at:
          </p>
          <p className="not-prose">
            <a href="mailto:copyright@klickstock.com" className="text-blue-600 hover:text-blue-800">
              copyright@klickstock.com
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