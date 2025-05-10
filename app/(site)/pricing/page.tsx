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
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/10 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              Simple, transparent pricing
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
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
              className={`rounded-2xl ${
                tier.mostPopular 
                  ? 'border-indigo-600 bg-indigo-600/10' 
                  : 'border-gray-800/50 bg-gray-900/60'
              } border shadow-xl overflow-hidden`}
            >
              <div className="p-8">
                <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
                <div className="mt-4 flex items-baseline">
                  {tier.price === 'Custom' ? (
                    <span className="text-4xl font-bold text-white">Custom</span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold text-white">${tier.price}</span>
                      <span className="ml-1 text-xl text-gray-400">/month</span>
                    </>
                  )}
                </div>
                <p className="mt-5 text-gray-400">{tier.description}</p>
              </div>
              <div className="px-8 pb-8">
                <ul className="space-y-4">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-6 w-6 text-indigo-400" />
                      </div>
                      <p className="ml-3 text-gray-400">{feature}</p>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <button
                    className={`w-full rounded-lg px-4 py-3 text-sm font-semibold ${
                      tier.mostPopular
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-800 text-white hover:bg-gray-700'
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
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
              <div className="bg-gray-900/60 rounded-2xl p-8 border border-gray-800/50">
                <h3 className="text-lg font-semibold text-white">
                  What payment methods do you accept?
                </h3>
                <p className="mt-2 text-gray-400">
                  We accept all major credit cards, PayPal, and bank transfers for enterprise customers.
                </p>
              </div>
              <div className="bg-gray-900/60 rounded-2xl p-8 border border-gray-800/50">
                <h3 className="text-lg font-semibold text-white">
                  Can I cancel my subscription anytime?
                </h3>
                <p className="mt-2 text-gray-400">
                  Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
                </p>
              </div>
            </div>
            <div className="space-y-8">
              <div className="bg-gray-900/60 rounded-2xl p-8 border border-gray-800/50">
                <h3 className="text-lg font-semibold text-white">
                  What happens to my downloads if I cancel?
                </h3>
                <p className="mt-2 text-gray-400">
                  Any content you've downloaded during your subscription remains yours to use under the terms of the license at the time of download.
                </p>
              </div>
              <div className="bg-gray-900/60 rounded-2xl p-8 border border-gray-800/50">
                <h3 className="text-lg font-semibold text-white">
                  Do you offer refunds?
                </h3>
                <p className="mt-2 text-gray-400">
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