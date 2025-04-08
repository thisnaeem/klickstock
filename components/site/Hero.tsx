import { Search } from 'lucide-react';
import Image from 'next/image';

export const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-40 -right-20 w-80 h-80 rounded-full bg-purple-500"></div>
        <div className="absolute top-40 -left-20 w-60 h-60 rounded-full bg-blue-500"></div>
        <div className="absolute bottom-40 right-20 w-40 h-40 rounded-full bg-indigo-500"></div>
      </div>
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
          All the assets you need,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            in one place
          </span>
        </h1>
        <p className="text-xl text-blue-100 mb-12 max-w-3xl">
          Find and download the best high-quality photos, designs, and mockups for your next creative project
        </p>
        
        {/* Search Bar */}
        <div className="w-full max-w-4xl mx-auto">
          <div className="flex items-center bg-white rounded-full shadow-2xl overflow-hidden p-1">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Search for images, vectors, videos, and music"
                className="w-full px-6 py-4 text-lg border-none focus:ring-0 focus:outline-none text-gray-800"
              />
            </div>
            <button className="px-8 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all flex items-center font-medium shadow-lg">
              <Search className="w-5 h-5 mr-2" />
              Search
            </button>
          </div>
          
          {/* Popular searches */}
          <div className="mt-6 text-white flex flex-wrap justify-center">
            <span className="text-sm mr-3 text-blue-200">Popular:</span>
            {['background', 'business', 'nature', 'food', 'technology'].map((term) => (
              <button
                key={term}
                className="text-sm mr-3 px-3 py-1 bg-white bg-opacity-10 rounded-full hover:bg-opacity-20 transition-all capitalize text-white"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
        
        {/* Decorative graphics */}
        <div className="absolute left-4 -bottom-16 w-40 h-40 opacity-50 hidden md:block">
          <Image 
            src="/shape1.svg" 
            alt="Decorative shape" 
            width={160} 
            height={160}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="absolute right-4 -bottom-16 w-40 h-40 opacity-50 hidden md:block">
          <Image 
            src="/shape2.svg" 
            alt="Decorative shape" 
            width={160} 
            height={160}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}; 