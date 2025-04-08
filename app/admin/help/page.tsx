import Link from "next/link";
import { QuestionMarkCircleIcon, BookOpenIcon, AcademicCapIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/solid";

export default function AdminHelp() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Help Center</h1>
        <p className="mt-1 text-base text-gray-500">
          Find answers to common questions and learn how to use the admin dashboard
        </p>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="max-w-3xl mx-auto">
          <label htmlFor="search" className="sr-only">
            Search help articles
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <div className="relative flex items-stretch flex-grow">
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full rounded-l-md border-gray-300 pl-4"
                placeholder="Search for help articles..."
              />
            </div>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpenIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-lg font-medium text-gray-900 ml-3">Documentation</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Comprehensive guides to all features and functionalities of the admin dashboard
          </p>
          <Link 
            href="#" 
            className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
          >
            Browse documentation
            <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <AcademicCapIcon className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-lg font-medium text-gray-900 ml-3">Tutorials</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Step-by-step guides for common admin tasks with detailed instructions
          </p>
          <Link 
            href="#" 
            className="text-green-600 hover:text-green-800 font-medium inline-flex items-center"
          >
            View tutorials
            <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <WrenchScrewdriverIcon className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-lg font-medium text-gray-900 ml-3">Troubleshooting</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Solutions to common problems and steps to resolve technical issues
          </p>
          <Link 
            href="#" 
            className="text-purple-600 hover:text-purple-800 font-medium inline-flex items-center"
          >
            Troubleshoot issues
            <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center mb-4">
          <QuestionMarkCircleIcon className="h-6 w-6 text-gray-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-4">
            <button
              className="flex justify-between items-center w-full text-left font-medium text-gray-900"
            >
              <span>How do I approve contributor submissions?</span>
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="mt-2">
              <p className="text-gray-600">
                Navigate to the "Submissions" page in the admin dashboard. You'll see a list of pending submissions. Click on an item to review it in detail, then use the "Approve" or "Reject" buttons to make your decision. You can add feedback for rejected items.
              </p>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <button
              className="flex justify-between items-center w-full text-left font-medium text-gray-900"
            >
              <span>How do I manage user roles?</span>
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="mt-2">
              <p className="text-gray-600">
                Go to the "Users" section of the admin dashboard. Here, you can see all registered users. Click on a user to view their profile and change their role. Available roles include "User," "Contributor," and "Admin." Changes take effect immediately.
              </p>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <button
              className="flex justify-between items-center w-full text-left font-medium text-gray-900"
            >
              <span>How do I update the platform settings?</span>
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="mt-2">
              <p className="text-gray-600">
                Navigate to the "Settings" page in the admin dashboard. Here you can update various platform settings, including user registration settings, content approval rules, API integrations, and security preferences. Remember to click "Save Changes" after making modifications.
              </p>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <button
              className="flex justify-between items-center w-full text-left font-medium text-gray-900"
            >
              <span>How do I view platform analytics?</span>
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="mt-2">
              <p className="text-gray-600">
                The admin dashboard homepage displays a summary of key metrics including user counts, content statistics, and recent activities. For more detailed analytics, navigate to the specific sections of the dashboard such as "Users" or "Content Library" where you'll find more granular data and insights.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Still need help?</h3>
          <p className="mt-2 text-sm text-gray-500">
            Our support team is available to assist with any questions or issues
          </p>
          <div className="mt-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 