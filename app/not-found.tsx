"use client";

import React from "react";
import Link from "next/link";
import { Camera, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-center">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Content wrapper */}
      <div className="relative z-10 max-w-xl">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Camera className="w-8 h-8 text-white" />
          </div>
        </div>
        
        {/* 404 text */}
        <h1 className="text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 mb-6">
          404
        </h1>
        
        {/* Message */}
        <h2 className="text-2xl font-bold text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          
          <Link 
            href="/help"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl shadow-lg transition-all border border-gray-700"
          >
            Need Help?
          </Link>
        </div>
        
        {/* Decorative elements */}
        <div className="mt-12 border-t border-gray-800/70 pt-6">
          <p className="text-gray-500 text-sm">
            KlickStock © {new Date().getFullYear()} 
          </p>
        </div>
      </div>
    </div>
  );
} 