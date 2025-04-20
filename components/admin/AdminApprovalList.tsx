"use client";

import { useState } from "react";
import Image from "next/image";
import { Clock, CheckCircle, XCircle, Search, Filter, Eye } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

// Type definitions
interface UserInfo {
  id: string;
  name: string | null;
  email: string | null;
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
  category: string;
}

interface AdminApprovalListProps {
  items: PendingItem[];
}

export const AdminApprovalList = ({ items: initialItems }: AdminApprovalListProps) => {
  const [items, setItems] = useState(initialItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get unique categories from all items
  const allCategories = [...new Set(items.map(item => item.category).filter(Boolean))].sort();

  // Filter items based on search and category
  const filteredItems = items.filter(item => {
    const matchesSearch = searchTerm === "" || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === null || 
      item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

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

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Filters */}
      <div className="p-4 border-b">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by title, description, tags, or contributor"
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={selectedCategory || ""}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
            >
              <option value="">All Categories</option>
              {allCategories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* List */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No pending items match your criteria</div>
          {(searchTerm || selectedCategory) && (
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory(null);
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="divide-y">
          {filteredItems.map((item) => (
            <div key={item.id} className="p-4 md:p-6 flex flex-col md:flex-row gap-6">
              <div className="relative w-full md:w-48 h-48 flex-shrink-0">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover rounded-lg"
                />
                <Link 
                  href={`/admin/content/${item.id}`}
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-lg text-gray-800 hover:text-blue-600 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </Link>
              </div>
              <div className="flex-1">
                <div className="flex justify-between flex-wrap gap-2 mb-3">
                  <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                  <div className="flex items-center text-yellow-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">
                      {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 mb-4">
                  {item.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-4">
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 mb-1">CATEGORY</h4>
                    <div className="flex flex-wrap gap-1">
                      {item.category && (
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                          {item.category}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 mb-1">TAGS</h4>
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={item.user.image || ""} alt={item.user.name || "User"} />
                      <AvatarFallback>{item.user.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{item.user.name}</div>
                      <div className="text-xs text-gray-500">{item.user.email}</div>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Button 
                      variant="outline" 
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                      onClick={() => handleReject(item.id)}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprove(item.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 