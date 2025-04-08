"use client";

import { useState } from "react";
import Image from "next/image";
import { Clock, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

// Type definitions
interface UserInfo {
  name: string | null;
  image: string | null;
}

interface PendingItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
  user: UserInfo;
  tags: string[];
}

interface AdminPendingItemsProps {
  items: PendingItem[];
}

export const AdminPendingItems = ({ items: initialItems }: AdminPendingItemsProps) => {
  const [items, setItems] = useState(initialItems);

  const handleApprove = async (id: string) => {
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/admin/approve/${id}`, { method: 'POST' });
      
      // For demo, we'll just update the state
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error("Failed to approve item:", error);
      alert("Failed to approve item. Please try again.");
    }
  };

  const handleReject = async (id: string) => {
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/admin/reject/${id}`, { method: 'POST' });
      
      // For demo, we'll just update the state
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error("Failed to reject item:", error);
      alert("Failed to reject item. Please try again.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm h-full">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Pending Approvals</h2>
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No pending items</div>
          <Link href="/admin/approval" className="text-blue-600 font-medium">
            View approval history
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Pending Approvals</h2>
        <Link href="/admin/approval" className="text-sm text-blue-600 flex items-center">
          View all <ExternalLink className="ml-1 w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 flex flex-col sm:flex-row gap-4">
            <div className="relative w-full sm:w-32 h-32 flex-shrink-0">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between flex-wrap gap-2">
                <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                <div className="flex items-center text-yellow-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="text-sm">
                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                {item.description}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {item.tags.slice(0, 3).map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
                {item.tags.length > 3 && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                    +{item.tags.length - 3}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center">
                  <Avatar className="h-7 w-7 mr-2">
                    <AvatarImage src={item.user.image || ""} alt={item.user.name || "User"} />
                    <AvatarFallback>{item.user.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{item.user.name}</span>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                    onClick={() => handleReject(item.id)}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleApprove(item.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 