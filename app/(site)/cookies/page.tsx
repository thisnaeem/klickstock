const cookieTypes = [
  {
    name: "Essential Cookies",
    description: "Required for basic site functionality. Cannot be disabled.",
    examples: [
      "Authentication status",
      "Shopping cart contents",
      "Security features",
      "Load balancing"
    ]
  },
  {
    name: "Functional Cookies",
    description: "Enable enhanced functionality and personalization.",
    examples: [
      "Language preferences",
      "User interface customization",
      "Recently viewed items",
      "Location-based content"
    ]
  },
  {
    name: "Analytics Cookies",
    description: "Help us understand how visitors interact with our site.",
    examples: [
      "Page views and navigation",
      "Time spent on pages",
      "Error encounters",
      "User behavior patterns"
    ]
  },
  {
    name: "Marketing Cookies",
    description: "Used to deliver relevant advertisements and track campaign performance.",
    examples: [
      "Ad personalization",
      "Campaign tracking",
      "Social media integration",
      "Retargeting"
    ]
  }
];

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/10 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              Cookie Policy
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Understanding how we use cookies to improve your experience
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-invert prose-indigo max-w-none">
          <h2 className="text-white">What Are Cookies?</h2>
          <p className="text-gray-400">
            Cookies are small text files that are placed on your device when you visit our website. 
            They help us provide you with a better experience by remembering your preferences, 
            analyzing site usage, and assisting with our marketing efforts.
          </p>

          <h2 className="text-white">Types of Cookies We Use</h2>
          <div className="not-prose space-y-8 mt-8">
            {cookieTypes.map((type, index) => (
              <div key={index} className="bg-gray-900/60 rounded-2xl p-8 border border-gray-800/50">
                <h3 className="text-xl font-semibold text-white mb-3">
                  {type.name}
                </h3>
                <p className="text-gray-400 mb-4">
                  {type.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {type.examples.map((example, i) => (
                    <div key={i} className="flex items-center text-sm text-gray-400">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                      {example}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-white mt-12">Managing Cookies</h2>
          <p className="text-gray-400">
            You can control and/or delete cookies as you wish. You can delete all cookies that are 
            already on your computer and you can set most browsers to prevent them from being placed. 
            However, if you do this, you may have to manually adjust some preferences every time you 
            visit our site and some features may not work as intended.
          </p>

          <h3 className="text-white">Browser Settings</h3>
          <p className="text-gray-400">
            Most browsers allow you to:
          </p>
          <ul className="text-gray-400">
            <li>View cookies stored on your device</li>
            <li>Allow or block all cookies</li>
            <li>Set preferences for specific websites</li>
            <li>Delete cookies periodically</li>
          </ul>

          <h2 className="text-white">Third-Party Cookies</h2>
          <p className="text-gray-400">
            We use some third-party services that may set their own cookies. We do not control 
            these cookies and they are subject to the third parties' own privacy policies.
          </p>

          <h2 className="text-white">Updates to Cookie Policy</h2>
          <p className="text-gray-400">
            We may update this Cookie Policy from time to time. Any changes will be posted on this page 
            and, where appropriate, notified to you by email or when you next visit our website.
          </p>

          <h2 className="text-white">Questions?</h2>
          <p className="text-gray-400">
            If you have any questions about our use of cookies, please contact us at:
          </p>
          <p className="not-prose">
            <a href="mailto:privacy@klickstock.com" className="text-indigo-400 hover:text-indigo-300">
              privacy@klickstock.com
            </a>
          </p>

          <div className="mt-8 p-4 bg-gray-900/60 rounded-2xl border border-gray-800/50">
            <p className="text-sm text-gray-400">
              Last updated: February 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 