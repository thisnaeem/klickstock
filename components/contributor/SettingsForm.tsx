"use client";

import { useState } from "react";
import { User } from "next-auth";
import { toast } from "sonner";

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
    notifications: {
      email: true,
      content: true,
      marketing: false
    }
  });

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
        <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
        <p className="mt-1 text-sm text-gray-500">
          Update your account profile information
        </p>
        
        <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500">Your email cannot be changed</p>
          </div>
          
          <div className="sm:col-span-2">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself and your work"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-lg font-medium text-gray-900">Payment Information</h2>
        <p className="mt-1 text-sm text-gray-500">
          Configure your payment settings
        </p>
        
        <div className="mt-4">
          <label htmlFor="paymentEmail" className="block text-sm font-medium text-gray-700">
            Payment Email
          </label>
          <input
            type="email"
            id="paymentEmail"
            name="paymentEmail"
            value={formData.paymentEmail}
            onChange={handleChange}
            placeholder="Email for receiving payments"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-lg font-medium text-gray-900">Notification Preferences</h2>
        <p className="mt-1 text-sm text-gray-500">
          Choose how and when you'd like to be notified
        </p>
        
        <div className="mt-4 space-y-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="email"
                name="email"
                type="checkbox"
                checked={formData.notifications.email}
                onChange={handleNotificationChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="email" className="font-medium text-gray-700">
                Email Notifications
              </label>
              <p className="text-gray-500">Get notified via email for important updates</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="content"
                name="content"
                type="checkbox"
                checked={formData.notifications.content}
                onChange={handleNotificationChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="content" className="font-medium text-gray-700">
                Content Status Updates
              </label>
              <p className="text-gray-500">Receive notifications when your content status changes</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="marketing"
                name="marketing"
                type="checkbox"
                checked={formData.notifications.marketing}
                onChange={handleNotificationChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="marketing" className="font-medium text-gray-700">
                Marketing Communications
              </label>
              <p className="text-gray-500">Receive tips, trends and promotional content</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="ml-3 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}; 