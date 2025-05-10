import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/10 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              Contact Us
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Have questions? We're here to help.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="bg-gray-900/60 rounded-2xl p-8 border border-gray-800/50">
            <h2 className="text-2xl font-bold text-white mb-8">Send us a message</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="mt-1 block w-full rounded-lg bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="mt-1 block w-full rounded-lg bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  className="mt-1 block w-full rounded-lg bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="mt-1 block w-full rounded-lg bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Your message..."
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-8">Get in touch</h2>
            <div className="space-y-8">
              <div className="flex items-start bg-gray-900/60 rounded-2xl p-6 border border-gray-800/50">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-indigo-600/20 text-indigo-400">
                    <Mail className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-white">Email</h3>
                  <p className="mt-2 text-gray-400">
                    Our friendly team is here to help.
                  </p>
                  <a href="mailto:support@klickstock.com" className="mt-3 text-indigo-400 hover:text-indigo-300 block">
                    support@klickstock.com
                  </a>
                </div>
              </div>

              <div className="flex items-start bg-gray-900/60 rounded-2xl p-6 border border-gray-800/50">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-indigo-600/20 text-indigo-400">
                    <MapPin className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-white">Office</h3>
                  <p className="mt-2 text-gray-400">
                    Come say hello at our office HQ.
                  </p>
                  <p className="mt-3 text-gray-400">
                    123 Market Street<br />
                    Suite 456<br />
                    San Francisco, CA 94105
                  </p>
                </div>
              </div>

              <div className="flex items-start bg-gray-900/60 rounded-2xl p-6 border border-gray-800/50">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-indigo-600/20 text-indigo-400">
                    <Phone className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-white">Phone</h3>
                  <p className="mt-2 text-gray-400">
                    Mon-Fri from 8am to 5pm.
                  </p>
                  <a href="tel:+1-555-123-4567" className="mt-3 text-indigo-400 hover:text-indigo-300 block">
                    +1 (555) 123-4567
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 