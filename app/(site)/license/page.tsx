import { Check } from 'lucide-react';

const licenses = [
  {
    name: "Standard License",
    price: "$49",
    description: "Perfect for websites, social media, and small business use",
    features: [
      "Use in digital media",
      "Up to 500,000 impressions",
      "Unlimited time",
      "No attribution required",
      "Non-exclusive use",
      "Web and social media use"
    ]
  },
  {
    name: "Extended License",
    price: "$149",
    description: "Ideal for commercial products, merchandise, and large campaigns",
    features: [
      "All Standard License features",
      "Unlimited impressions",
      "Use in merchandise",
      "Print advertising",
      "TV/Film/Video use",
      "Resale products"
    ]
  },
  {
    name: "Enterprise License",
    price: "Custom",
    description: "For large organizations with specific needs",
    features: [
      "All Extended License features",
      "Multiple user seats",
      "API access",
      "Custom usage rights",
      "Priority support",
      "Volume pricing"
    ]
  }
];

export default function LicensePage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="relative py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Image Licenses
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Choose the right license for your needs
            </p>
          </div>
        </div>
      </div>

      {/* License Types */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {licenses.map((license, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 p-8 hover:border-blue-500 transition-colors"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {license.name}
              </h3>
              <div className="text-3xl font-bold text-blue-600 mb-4">
                {license.price}
              </div>
              <p className="text-gray-600 mb-6">
                {license.description}
              </p>
              <ul className="space-y-4">
                {license.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-8 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                {license.price === "Custom" ? "Contact Sales" : "Choose Plan"}
              </button>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-16 prose prose-blue max-w-none">
          <h2>License Terms Overview</h2>
          <p>
            All licenses are perpetual, meaning you can use the content forever within the terms of the license you purchase. 
            Licenses are non-exclusive, allowing the same image to be licensed by others.
          </p>

          <h3>What's Not Allowed</h3>
          <ul>
            <li>Redistributing or reselling the original files</li>
            <li>Using images in a defamatory, pornographic, or illegal manner</li>
            <li>Claiming ownership of the images</li>
            <li>Using images in logos or trademarks without an Extended or Enterprise license</li>
          </ul>

          <h3>Need Help?</h3>
          <p>
            If you have questions about licensing or need a custom solution, please contact our licensing team. 
            We're here to help you find the right license for your needs.
          </p>
        </div>
      </div>
    </div>
  );
} 