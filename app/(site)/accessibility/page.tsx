import { Eye, Keyboard, Layout, Monitor, MousePointer, Zap } from 'lucide-react';

const accessibilityFeatures = [
  {
    icon: Keyboard,
    title: "Keyboard Navigation",
    description: "Full keyboard support for all features, with visible focus indicators and intuitive tab order."
  },
  {
    icon: Eye,
    title: "Visual Accessibility",
    description: "High contrast mode, adjustable text sizes, and support for screen readers and zoom tools."
  },
  {
    icon: MousePointer,
    title: "Input Methods",
    description: "Support for various input devices including mouse, keyboard, touch, and voice commands."
  },
  {
    icon: Monitor,
    title: "Screen Readers",
    description: "ARIA labels, semantic HTML, and descriptive alt text for all images and interactive elements."
  },
  {
    icon: Layout,
    title: "Responsive Design",
    description: "Fully responsive layout that adapts to different screen sizes and orientations."
  },
  {
    icon: Zap,
    title: "Performance",
    description: "Fast loading times and efficient performance for users with slower connections."
  }
];

export default function AccessibilityPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="relative py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Accessibility
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Making KlickStock accessible to everyone
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Commitment Statement */}
        <div className="prose prose-blue max-w-none mb-16">
          <h2>Our Commitment to Accessibility</h2>
          <p>
            At KlickStock, we believe that everyone should have access to high-quality stock photography. 
            We are committed to ensuring our platform is accessible to users of all abilities and 
            continuously work to improve the accessibility of our services.
          </p>
          <p>
            Our platform follows WCAG 2.1 guidelines and we regularly test our features with various 
            assistive technologies to ensure a seamless experience for all users.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {accessibilityFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Information */}
        <div className="prose prose-blue max-w-none">
          <h2>Accessibility Guidelines</h2>
          <p>
            Our platform adheres to the following accessibility guidelines:
          </p>
          <ul>
            <li>WCAG 2.1 Level AA compliance</li>
            <li>Section 508 compliance</li>
            <li>WAI-ARIA 1.1 implementation</li>
            <li>Regular accessibility audits and testing</li>
          </ul>

          <h2>Assistive Technology Support</h2>
          <p>
            KlickStock is tested with popular assistive technologies including:
          </p>
          <ul>
            <li>NVDA and JAWS screen readers</li>
            <li>VoiceOver for iOS and macOS</li>
            <li>TalkBack for Android</li>
            <li>Various browser zoom tools</li>
            <li>Speech recognition software</li>
          </ul>

          <h2>Known Issues</h2>
          <p>
            We maintain a list of known accessibility issues and actively work to resolve them. 
            Our development team prioritizes accessibility fixes and enhancements in our regular 
            update cycle.
          </p>

          <h2>Feedback and Support</h2>
          <p>
            We welcome your feedback on the accessibility of KlickStock. Please let us know if you 
            encounter any accessibility barriers or have suggestions for improvement:
          </p>
          <ul>
            <li>
              Email: {' '}
              <a href="mailto:accessibility@klickstock.com" className="text-blue-600 hover:text-blue-800">
                accessibility@klickstock.com
              </a>
            </li>
            <li>Phone: 1-800-123-4567</li>
            <li>Feedback Form: Available in our Help Center</li>
          </ul>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Last updated: February 2024
            </p>
            <p className="text-sm text-gray-600 mt-2">
              We are committed to maintaining an accessible platform and will continue to enhance 
              these features based on user feedback and emerging technologies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 