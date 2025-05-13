"use client";

import { useState } from "react";
import { Settings, Users, Image, ServerIcon, Shield } from "lucide-react";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general");
  
  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralSettings />;
      case "users":
        return <UserSettings />;
      case "content":
        return <ContentSettings />;
      case "api":
        return <ApiSettings />;
      case "security":
        return <SecuritySettings />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-base text-gray-400">
          Configure platform settings and preferences
        </p>
      </div>

      <div className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl border border-gray-700/50">
        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full translate-x-1/4 -translate-y-1/4 blur-3xl"></div>
        
        <div className="flex border-b border-gray-700/50 overflow-x-auto">
          <button
            onClick={() => setActiveTab("general")}
            className={`px-4 py-4 text-sm font-medium flex items-center ${
              activeTab === "general"
                ? "text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/10"
                : "text-gray-400 hover:text-white hover:bg-gray-800/60"
            }`}
          >
            <Settings className="w-5 h-5 mr-2" />
            General
          </button>
          
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-4 text-sm font-medium flex items-center ${
              activeTab === "users"
                ? "text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/10"
                : "text-gray-400 hover:text-white hover:bg-gray-800/60"
            }`}
          >
            <Users className="w-5 h-5 mr-2" />
            Users
          </button>
          
          <button
            onClick={() => setActiveTab("content")}
            className={`px-4 py-4 text-sm font-medium flex items-center ${
              activeTab === "content"
                ? "text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/10"
                : "text-gray-400 hover:text-white hover:bg-gray-800/60"
            }`}
          >
            <Image className="w-5 h-5 mr-2" />
            Content
          </button>
          
          <button
            onClick={() => setActiveTab("api")}
            className={`px-4 py-4 text-sm font-medium flex items-center ${
              activeTab === "api"
                ? "text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/10"
                : "text-gray-400 hover:text-white hover:bg-gray-800/60"
            }`}
          >
            <ServerIcon className="w-5 h-5 mr-2" />
            API
          </button>
          
          <button
            onClick={() => setActiveTab("security")}
            className={`px-4 py-4 text-sm font-medium flex items-center ${
              activeTab === "security"
                ? "text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/10"
                : "text-gray-400 hover:text-white hover:bg-gray-800/60"
            }`}
          >
            <Shield className="w-5 h-5 mr-2" />
            Security
          </button>
        </div>
        
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

function GeneralSettings() {
  return (
    <div className="space-y-6">
      <form className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-white">Platform Settings</h3>
          <p className="mt-1 text-sm text-gray-400">
            Manage general platform settings and configuration.
          </p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="platform-name" className="block text-sm font-medium text-gray-300">
              Platform Name
            </label>
            <input
              type="text"
              id="platform-name"
              defaultValue="KlickStock"
              className="mt-1 block w-full border border-gray-700 bg-gray-800 rounded-lg shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="platform-description" className="block text-sm font-medium text-gray-300">
              Platform Description
            </label>
            <textarea
              id="platform-description"
              rows={3}
              defaultValue="A stock photography platform for contributors and users"
              className="mt-1 block w-full border border-gray-700 bg-gray-800 rounded-lg shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
            />
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="maintenance-mode"
                type="checkbox"
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-700 rounded bg-gray-800"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="maintenance-mode" className="font-medium text-gray-300">
                Maintenance Mode
              </label>
              <p className="text-gray-400">
                Enable maintenance mode to temporarily disable public access to the site
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-lg text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

function UserSettings() {
  return (
    <div className="space-y-6">
      <form className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-white">User Settings</h3>
          <p className="mt-1 text-sm text-gray-400">
            Configure user registration, roles, and permissions.
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="allow-registration"
                type="checkbox"
                defaultChecked
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-700 rounded bg-gray-800"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="allow-registration" className="font-medium text-gray-300">
                Allow User Registration
              </label>
              <p className="text-gray-400">
                Enable or disable new user registration
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="email-verification"
                type="checkbox"
                defaultChecked
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-700 rounded bg-gray-800"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="email-verification" className="font-medium text-gray-300">
                Require Email Verification
              </label>
              <p className="text-gray-400">
                Require users to verify their email before they can log in
              </p>
            </div>
          </div>
          
          <div>
            <label htmlFor="default-role" className="block text-sm font-medium text-gray-300">
              Default User Role
            </label>
            <select
              id="default-role"
              defaultValue="USER"
              className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
            >
              <option value="USER">User</option>
              <option value="CONTRIBUTOR">Contributor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-lg text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

function ContentSettings() {
  return (
    <div className="space-y-6">
      <form className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-white">Content Settings</h3>
          <p className="mt-1 text-sm text-gray-400">
            Configure content upload settings and restrictions.
          </p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="max-upload-size" className="block text-sm font-medium text-gray-300">
              Maximum Upload Size (MB)
            </label>
            <input
              type="number"
              id="max-upload-size"
              defaultValue={10}
              min={1}
              max={50}
              className="mt-1 block w-full border border-gray-700 bg-gray-800 rounded-lg shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="allowed-formats" className="block text-sm font-medium text-gray-300">
              Allowed File Formats
            </label>
            <div className="mt-1 flex flex-wrap gap-2">
              {["JPG", "PNG", "GIF", "WEBP"].map((format) => (
                <div key={format} className="flex items-center">
                  <input
                    id={`format-${format}`}
                    name="formats"
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-indigo-600 border-gray-700 rounded focus:ring-indigo-500 bg-gray-800"
                  />
                  <label htmlFor={`format-${format}`} className="ml-2 block text-sm text-gray-300">
                    {format}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="auto-approve"
                type="checkbox"
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-700 rounded bg-gray-800"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="auto-approve" className="font-medium text-gray-300">
                Auto-Approve Trusted Contributors
              </label>
              <p className="text-gray-400">
                Automatically approve content from contributors with a good track record
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-lg text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

function ApiSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white">API Settings</h3>
        <p className="mt-1 text-sm text-gray-400">
          Manage API keys and external integrations.
        </p>
      </div>
      
      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/70">
        <h4 className="text-base font-medium text-white">Cloudinary Integration</h4>
        <div className="mt-3 space-y-4">
          <div>
            <label htmlFor="cloudinary-cloud-name" className="block text-sm font-medium text-gray-300">
              Cloud Name
            </label>
            <input
              type="text"
              id="cloudinary-cloud-name"
              defaultValue="your-cloud-name"
              className="mt-1 block w-full border border-gray-700 bg-gray-800 rounded-lg shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="cloudinary-api-key" className="block text-sm font-medium text-gray-300">
              API Key
            </label>
            <input
              type="password"
              id="cloudinary-api-key"
              defaultValue="••••••••••••••••"
              className="mt-1 block w-full border border-gray-700 bg-gray-800 rounded-lg shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="cloudinary-api-secret" className="block text-sm font-medium text-gray-300">
              API Secret
            </label>
            <input
              type="password"
              id="cloudinary-api-secret"
              defaultValue="••••••••••••••••"
              className="mt-1 block w-full border border-gray-700 bg-gray-800 rounded-lg shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
            />
          </div>
        </div>
        
        <button
          type="button"
          className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-lg text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
        >
          Update Cloudinary Settings
        </button>
      </div>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white">Security Settings</h3>
        <p className="mt-1 text-sm text-gray-400">
          Configure platform security settings and access controls.
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="two-factor"
              type="checkbox"
              defaultChecked
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-700 rounded bg-gray-800"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="two-factor" className="font-medium text-gray-300">
              Require Two-Factor Authentication for Admins
            </label>
            <p className="text-gray-400">
              Enforce two-factor authentication for all administrator accounts
            </p>
          </div>
        </div>
        
        <div>
          <label htmlFor="session-duration" className="block text-sm font-medium text-gray-300">
            Session Duration (hours)
          </label>
          <input
            type="number"
            id="session-duration"
            defaultValue={24}
            min={1}
            max={720}
            className="mt-1 block w-full border border-gray-700 bg-gray-800 rounded-lg shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
          />
        </div>
        
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="rate-limiting"
              type="checkbox"
              defaultChecked
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-700 rounded bg-gray-800"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="rate-limiting" className="font-medium text-gray-300">
              Enable API Rate Limiting
            </label>
            <p className="text-gray-400">
              Limit the number of API requests per user to prevent abuse
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="button"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-lg text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
        >
          Save Security Settings
        </button>
      </div>
    </div>
  );
} 