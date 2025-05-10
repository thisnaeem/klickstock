import { Camera, Users, Shield, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/10 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              About KlickStock
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              We're building the future of creative resources, empowering creators with high-quality assets for their projects.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-gray-400 text-lg mb-6">
                At KlickStock, we believe in making premium creative resources accessible to everyone. Our platform connects talented contributors with creators who need high-quality assets for their projects.
              </p>
              <p className="text-gray-400 text-lg">
                We're committed to fostering a community where creativity thrives and artists can showcase their work to a global audience.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                {
                  icon: <Camera className="w-8 h-8 text-indigo-400" />,
                  title: "Premium Assets",
                  description: "Curated high-quality images and resources"
                },
                {
                  icon: <Users className="w-8 h-8 text-purple-400" />,
                  title: "Creator Community",
                  description: "A thriving network of talented artists"
                },
                {
                  icon: <Shield className="w-8 h-8 text-emerald-400" />,
                  title: "Secure Platform",
                  description: "Safe and reliable content delivery"
                },
                {
                  icon: <Sparkles className="w-8 h-8 text-pink-400" />,
                  title: "Innovation",
                  description: "Cutting-edge features and tools"
                }
              ].map((item, index) => (
                <div key={index} className="bg-gray-900/60 p-6 rounded-xl border border-gray-800/50">
                  <div className="mb-4">{item.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Team</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We're a passionate team of creators, developers, and innovators working together to build the best platform for creative resources.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-2xl p-8 md:p-12 backdrop-blur-xl border border-indigo-500/20">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Join Our Community</h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Be part of our growing community of creators and get access to premium resources.
              </p>
              <Link 
                href="/register" 
                className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 