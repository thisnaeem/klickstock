import { ArrowRight } from 'lucide-react';

const siteStructure = [
  {
    section: "Main",
    links: [
      { title: "Home", url: "/" },
      { title: "About", url: "/about" },
      { title: "Pricing", url: "/pricing" },
      { title: "Contact", url: "/contact" }
    ]
  },
  {
    section: "Images",
    links: [
      { title: "Browse Images", url: "/images" },
      { title: "Categories", url: "/categories" },
      { title: "Collections", url: "/collections" },
      { title: "Featured", url: "/featured" },
      { title: "New Arrivals", url: "/new" }
    ]
  },
  {
    section: "Contributors",
    links: [
      { title: "Become a Contributor", url: "/contribute" },
      { title: "Contributor Guidelines", url: "/guidelines" },
      { title: "Upload Images", url: "/upload" },
      { title: "Earnings", url: "/earnings" }
    ]
  },
  {
    section: "Account",
    links: [
      { title: "Sign In", url: "/signin" },
      { title: "Register", url: "/register" },
      { title: "Dashboard", url: "/dashboard" },
      { title: "Downloads", url: "/downloads" },
      { title: "Settings", url: "/settings" }
    ]
  },
  {
    section: "Legal",
    links: [
      { title: "Terms of Use", url: "/terms" },
      { title: "Privacy Policy", url: "/privacy" },
      { title: "Cookie Policy", url: "/cookies" },
      { title: "License Information", url: "/license" },
      { title: "Copyright Info", url: "/copyright" }
    ]
  },
  {
    section: "Support",
    links: [
      { title: "Help Center", url: "/support" },
      { title: "FAQs", url: "/support#faqs" },
      { title: "Contact Support", url: "/support#contact" },
      { title: "Accessibility", url: "/accessibility" },
      { title: "System Status", url: "/status" }
    ]
  }
];

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/10 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              Sitemap
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Find everything on KlickStock
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {siteStructure.map((section, index) => (
            <div key={index} className="bg-gray-900/60 rounded-2xl p-8 border border-gray-800/50">
              <h2 className="text-xl font-bold text-white mb-4">
                {section.section}
              </h2>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.url}
                      className="group flex items-center text-gray-400 hover:text-indigo-400"
                    >
                      <ArrowRight className="h-4 w-4 mr-2 text-gray-500 group-hover:text-indigo-400" />
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Additional Links */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-8">
            Additional Resources
          </h2>
          <div className="prose prose-invert prose-indigo max-w-none">
            <ul className="text-gray-400">
              <li>
                <strong className="text-white">API Documentation:</strong> Access our API documentation for developers
              </li>
              <li>
                <strong className="text-white">Brand Assets:</strong> Download KlickStock logos and brand guidelines
              </li>
              <li>
                <strong className="text-white">Press Kit:</strong> Media resources and company information
              </li>
              <li>
                <strong className="text-white">Careers:</strong> Join our team and help shape the future of stock photography
              </li>
            </ul>
          </div>
        </div>

        {/* XML Sitemap Note */}
        <div className="mt-16 p-4 bg-gray-900/60 rounded-2xl border border-gray-800/50">
          <p className="text-sm text-gray-400">
            Looking for our XML sitemap? Access it at{' '}
            <a href="/sitemap.xml" className="text-indigo-400 hover:text-indigo-300">
              sitemap.xml
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 