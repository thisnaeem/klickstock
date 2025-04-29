import { Check } from 'lucide-react';

const tiers = [
  {
    name: 'Free',
    price: '0',
    description: 'Perfect for personal projects and small needs.',
    features: [
      '5 downloads per day',
      'Basic license',
      'Standard quality images',
      'Personal use only',
      'Email support'
    ],
    cta: 'Get Started',
    mostPopular: false
  },
  {
    name: 'Pro',
    price: '12',
    description: 'Best for professional creators and small teams.',
    features: [
      'Unlimited downloads',
      'Extended license',
      'High quality images',
      'Commercial use',
      'Priority support',
      'API access',
      'No attribution required'
    ],
    cta: 'Start Pro',
    mostPopular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations with specific needs.',
    features: [
      'Everything in Pro',
      'Custom license terms',
      'Dedicated support',
      'Custom API limits',
      'Team management',
      'Usage analytics',
      'SLA guarantees'
    ],
    cta: 'Contact Sales',
    mostPopular: false
  }
];

export default function PricingPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="relative py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Simple, transparent pricing
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Choose the perfect plan for your needs. Always know what you'll pay.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div 
              key={tier.name}
              className={`rounded-2xl border ${
                tier.mostPopular 
                  ? 'border-blue-600 shadow-blue-100' 
                  : 'border-gray-200'
              } shadow-xl overflow-hidden`}
            >
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900">{tier.name}</h3>
                <div className="mt-4 flex items-baseline">
                  {tier.price === 'Custom' ? (
                    <span className="text-4xl font-bold text-gray-900">Custom</span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold text-gray-900">${tier.price}</span>
                      <span className="ml-1 text-xl text-gray-500">/month</span>
                    </>
                  )}
                </div>
                <p className="mt-5 text-gray-500">{tier.description}</p>
              </div>
              <div className="px-8 pb-8">
                <ul className="space-y-4">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-6 w-6 text-blue-500" />
                      </div>
                      <p className="ml-3 text-gray-600">{feature}</p>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <button
                    className={`w-full rounded-lg px-4 py-3 text-sm font-semibold ${
                      tier.mostPopular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    } transition-colors duration-200`}
                  >
                    {tier.cta}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  What payment methods do you accept?
                </h3>
                <p className="mt-2 text-gray-600">
                  We accept all major credit cards, PayPal, and bank transfers for enterprise customers.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Can I cancel my subscription anytime?
                </h3>
                <p className="mt-2 text-gray-600">
                  Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
                </p>
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  What happens to my downloads if I cancel?
                </h3>
                <p className="mt-2 text-gray-600">
                  Any content you've downloaded during your subscription remains yours to use under the terms of the license at the time of download.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Do you offer refunds?
                </h3>
                <p className="mt-2 text-gray-600">
                  We offer a 30-day money-back guarantee if you're not satisfied with our service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 