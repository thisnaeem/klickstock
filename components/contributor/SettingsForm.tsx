"use client";

import { useState, useEffect } from "react";
import { User } from "next-auth";
import { toast } from "sonner";
import { KeyRound, UserIcon, CreditCardIcon, BellIcon } from "lucide-react";

import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "../ui/input";

interface SettingsFormProps {
  user: User;
}

export const SettingsForm = ({ user }: SettingsFormProps) => {
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    profileImage: user.image || "",
    bio: "",
    paymentEmail: "",
    geminiApiKey: "",
    notifications: {
      email: true,
      content: true,
      marketing: false
    }
  });

  // Initialize client-side state from localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem("geminiApiKey");
    if (savedApiKey) {
      setFormData(prev => ({
        ...prev,
        geminiApiKey: savedApiKey
      }));
    }
  }, []);

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [name]: checked
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save Gemini API key to localStorage
      if (formData.geminiApiKey) {
        localStorage.setItem("geminiApiKey", formData.geminiApiKey);
      } else {
        localStorage.removeItem("geminiApiKey");
      }
      
      // Mock API call - in a real app, you would send this to your API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Settings updated successfully");
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-900/30 flex items-center justify-center">
            <UserIcon className="h-5 w-5 text-indigo-400" />
          </div>
          <h2 className="text-lg font-medium text-white">Profile Information</h2>
        </div>
        <p className="mb-4 text-sm text-gray-400">
          Update your account profile information
        </p>
        
        <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
          <div>
            <Input 
              id="name"
              name="name"
              label="Full Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Input
              id="email"
              name="email"
              label="Email Address"
              value={formData.email}
              onChange={handleChange}
              disabled
              helperText="Your email cannot be changed"
            />
          </div>
          
          <div className="sm:col-span-2">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself and your work"
              className="block w-full rounded-lg px-4 py-2.5 bg-gray-800/50 border border-gray-700 text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 hover:border-gray-600 transition-all duration-200"
            />
          </div>
        </div>
      </div>
      
      
      {/* AI Integration Settings */}
      <div className="border-t border-gray-800 pt-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-purple-900/30 flex items-center justify-center">
            <KeyRound className="h-5 w-5 text-purple-400" />
          </div>
          <h2 className="text-lg font-medium text-white">AI Integration</h2>
        </div>
        <p className="mb-4 text-sm text-gray-400">
          Configure AI services to help with content creation
        </p>
        
        <div className="mt-4">
          <Input
            type="password"
            id="geminiApiKey"
            name="geminiApiKey"
            label="Gemini API Key"
            value={formData.geminiApiKey}
            onChange={handleChange}
            placeholder="Enter your Gemini API key"
            helperText={
              <>
                Your API key is stored locally and never sent to our servers. Get your API key from{" "}
                <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 hover:underline">
                  Google AI Studio
                </a>
                .
              </>
            }
          />
        </div>
      </div>
      
      <div className="border-t border-gray-800 pt-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-blue-900/30 flex items-center justify-center">
            <BellIcon className="h-5 w-5 text-blue-400" />
          </div>
          <h2 className="text-lg font-medium text-white">Notification Preferences</h2>
        </div>
        <p className="mb-4 text-sm text-gray-400">
          Choose how and when you'd like to be notified
        </p>
        
        <div className="mt-4 space-y-6">
          <Checkbox
            id="email"
            name="email"
            checked={formData.notifications.email}
            onChange={handleNotificationChange}
            label="Email Notifications"
            description="Get notified via email for important updates"
          />
          
          <Checkbox
            id="content"
            name="content"
            checked={formData.notifications.content}
            onChange={handleNotificationChange}
            label="Content Status Updates"
            description="Receive notifications when your content status changes"
          />
          
          <Checkbox
            id="marketing"
            name="marketing"
            checked={formData.notifications.marketing}
            onChange={handleNotificationChange}
            label="Marketing Communications"
            description="Receive tips, trends and promotional content"
          />
        </div>
      </div>
      
      <div className="border-t border-gray-800 pt-8 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative group overflow-hidden"
        >
          <span className="relative z-10">
            {loading ? "Saving..." : "Save Changes"}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>
    </form>
  );
}; 