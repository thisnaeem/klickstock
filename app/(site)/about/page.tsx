import { Camera } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              About KlickStock
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Empowering creativity with high-quality stock photos and resources.
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-gray-900">KlickStock</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              At KlickStock, we believe in making high-quality visual content accessible to everyone. 
              Our platform serves as a bridge between talented creators and those who need exceptional 
              visual resources for their projects.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                  </div>
                </div>
                <p className="ml-4 text-gray-600">
                  Curated collection of high-quality images
                </p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                  </div>
                </div>
                <p className="ml-4 text-gray-600">
                  Supporting creative professionals worldwide
                </p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                  </div>
                </div>
                <p className="ml-4 text-gray-600">
                  Fair compensation for contributors
                </p>
              </div>
            </div>
          </div>
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 opacity-10"></div>
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-4 p-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="rounded-lg bg-white/90 shadow-sm"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">1M+</div>
              <div className="mt-2 text-gray-600">Stock Photos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">100K+</div>
              <div className="mt-2 text-gray-600">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">50K+</div>
              <div className="mt-2 text-gray-600">Contributors</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 