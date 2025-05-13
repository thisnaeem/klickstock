"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ContributorItemStatus } from "@prisma/client";
import { 
  Clock,
  CheckCircle, 
  XCircle,
  X,
  ArrowUpRight,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  RotateCw,
  Filter,
  Download,
  ThumbsUp,
  ThumbsDown,
  Move
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { approveSubmission, rejectSubmission } from "@/actions/admin";
import { ImageWithPattern } from "@/components/ui/image-with-pattern";
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  CustomDialog, 
  CustomDialogContent, 
  CustomDialogTrigger 
} from "@/components/ui/custom-dialog";

// Rejection reasons
const REJECTION_REASONS = [
  {
    id: "quality",
    label: "Low image quality",
    description: "The image quality does not meet our standards (low resolution, blurry, pixelated, etc.)."
  },
  {
    id: "duplicate",
    label: "Duplicate content",
    description: "This appears to be a duplicate of existing content in our library."
  },
  {
    id: "copyright",
    label: "Copyright concerns",
    description: "The image may violate copyright or intellectual property rights."
  },
  {
    id: "inappropriate",
    label: "Inappropriate content",
    description: "The content does not comply with our platform guidelines."
  }
];

function getPlaceholderImage(title: string): string {
  // Generate a color based on the title string
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = hash % 360;
  
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="hsl(${hue}, 70%, 20%)" /><text x="50%" y="50%" font-family="Arial" font-size="14" fill="white" text-anchor="middle" dominant-baseline="middle">${title.charAt(0).toUpperCase()}</text></svg>`;
}

export default function PendingSubmissions() {
  const router = useRouter();
  const [pendingItems, setPendingItems] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullImageOpen, setIsFullImageOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  
  // New state variables for enhanced features
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [filterView, setFilterView] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const imageRef = useRef<HTMLDivElement>(null);

  // Add these state variables and functions for panning
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  // Add new state and functions for batch actions
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [showConfirmApproveAll, setShowConfirmApproveAll] = useState(false);
  const [showConfirmRejectAll, setShowConfirmRejectAll] = useState(false);
  const [batchRejectReason, setBatchRejectReason] = useState("");

  // Fetch pending submissions on component mount
  useEffect(() => {
    fetchPendingSubmissions();
  }, []);

  const fetchPendingSubmissions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/submissions');
      if (!response.ok) throw new Error('Failed to fetch submissions');
      const data = await response.json();
      setPendingItems(data.items);
      setTotalCount(data.pagination.total);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setIsProcessing(true);
    try {
      await approveSubmission(id);
      setToast({
        show: true,
        message: "Content approved successfully!",
        type: "success"
      });
      setTimeout(() => {
        setToast({ show: false, message: "", type: "" });
        fetchPendingSubmissions(); // Refresh the data
      }, 2000);
    } catch (error) {
      setToast({
        show: true,
        message: "Failed to approve content. Please try again.",
        type: "error"
      });
      setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!currentItem) return;
    
    setIsProcessing(true);
    const reason = selectedReason === "custom" 
      ? customReason 
      : REJECTION_REASONS.find(r => r.id === selectedReason)?.description || "";
    
    try {
      await rejectSubmission(currentItem.id, reason);
      setIsRejectDialogOpen(false);
      setToast({
        show: true,
        message: "Content rejected successfully!",
        type: "success"
      });
      setTimeout(() => {
        setToast({ show: false, message: "", type: "" });
        fetchPendingSubmissions(); // Refresh the data
      }, 2000);
    } catch (error) {
      setToast({
        show: true,
        message: "Failed to reject content. Please try again.",
        type: "error"
      });
      setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    } finally {
      setIsProcessing(false);
    }
  };

  const openRejectDialog = (item: any) => {
    setCurrentItem(item);
    setSelectedReason("");
    setCustomReason("");
    setIsRejectDialogOpen(true);
  };

  const openFullImage = (item: any) => {
    setCurrentItem(item);
    setIsFullImageOpen(true);
    resetImageView();
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    resetImageView();
  };

  const handleRotateImage = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleDownloadImage = () => {
    if (!currentItem?.imageUrl) return;
    
    const link = document.createElement('a');
    link.href = currentItem.imageUrl;
    link.download = `${currentItem.title || 'image'}.${currentItem.imageType?.toLowerCase() || 'jpg'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filterSubmissions = (status: string) => {
    setFilterView(status);
    // In a real implementation, you would fetch filtered data from the API
    // For now, we'll just simulate this behavior
    setIsLoading(true);
    setTimeout(() => {
      fetchPendingSubmissions();
    }, 500);
  };

  const sortSubmissions = (order: string) => {
    setSortOrder(order);
    // In a real implementation, you would sort based on the API response
    // For now, we'll just simulate this behavior
    setIsLoading(true);
    setTimeout(() => {
      fetchPendingSubmissions();
    }, 500);
  };

  // Add image panning functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return; // Only enable panning when zoomed in
    setIsDragging(true);
    setStartPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  // Update the image panning to be smoother and add mouse wheel zoom support
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    
    // Zoom in/out with mouse wheel
    if (e.deltaY < 0) {
      // Zoom in (scroll up)
      setZoomLevel(prev => Math.min(prev + 0.1, 3));
    } else {
      // Zoom out (scroll down)
      setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
    }
  };

  // Improve mouse move for smoother panning
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomLevel <= 1) return;
    e.preventDefault(); // Prevent unwanted selections while dragging
    
    // Calculate new position with smoother movement
    const newX = e.clientX - startPosition.x;
    const newY = e.clientY - startPosition.y;
    
    // Apply position with bounds to prevent moving too far
    setPosition({
      x: newX,
      y: newY
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Reset position when opening a new image or resetting zoom
  const resetImageView = () => {
    setZoomLevel(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  // Add touch event handlers for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    setStartPosition({
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y
    });
  };

  // Improve touch move for smoother panning
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || zoomLevel <= 1) return;
    e.preventDefault(); // Prevent scrolling while panning
    
    // Calculate new position with smoother movement
    const newX = e.touches[0].clientX - startPosition.x;
    const newY = e.touches[0].clientY - startPosition.y;
    
    // Apply position with bounds to prevent moving too far
    setPosition({
      x: newX,
      y: newY
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Approve all pending submissions
  const handleApproveAll = async () => {
    if (!pendingItems.length) return;
    
    setIsBatchProcessing(true);
    
    try {
      // Process items sequentially to avoid rate limits
      for (const item of pendingItems) {
        await approveSubmission(item.id);
      }
      
      setToast({
        show: true,
        message: `Successfully approved ${pendingItems.length} items`,
        type: "success"
      });
      
      setTimeout(() => {
        setToast({ show: false, message: "", type: "" });
        fetchPendingSubmissions(); // Refresh the data
      }, 2000);
    } catch (error) {
      setToast({
        show: true,
        message: "Failed to approve all items. Please try again.",
        type: "error"
      });
      setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    } finally {
      setIsBatchProcessing(false);
      setShowConfirmApproveAll(false);
    }
  };

  // Reject all pending submissions
  const handleRejectAll = async () => {
    if (!pendingItems.length || !batchRejectReason) return;
    
    setIsBatchProcessing(true);
    
    try {
      // Process items sequentially to avoid rate limits
      for (const item of pendingItems) {
        await rejectSubmission(item.id, batchRejectReason);
      }
      
      setToast({
        show: true,
        message: `Successfully rejected ${pendingItems.length} items`,
        type: "success"
      });
      
      setTimeout(() => {
        setToast({ show: false, message: "", type: "" });
        fetchPendingSubmissions(); // Refresh the data
      }, 2000);
    } catch (error) {
      setToast({
        show: true,
        message: "Failed to reject all items. Please try again.",
        type: "error"
      });
      setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    } finally {
      setIsBatchProcessing(false);
      setShowConfirmRejectAll(false);
      setBatchRejectReason("");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">Pending Submissions</h1>
            <p className="mt-1 text-base text-gray-400">
              Loading submissions...
            </p>
          </div>
        </div>
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-8 rounded-xl shadow-xl border border-gray-700/50 text-center backdrop-blur-sm">
          <div className="absolute inset-0 bg-grid-white/5 bg-[size:20px_20px] opacity-10"></div>
          <div className="animate-pulse flex flex-col items-center relative z-10">
            <div className="w-16 h-16 bg-gray-700/50 rounded-full mb-4 backdrop-blur-sm"></div>
            <div className="h-4 bg-gray-700/50 rounded w-1/2 mb-2 backdrop-blur-sm"></div>
            <div className="h-4 bg-gray-700/50 rounded w-1/3 backdrop-blur-sm"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">Pending Submissions</h1>
          <p className="mt-1 text-base text-gray-400">
            Review and approve contributor submissions ({totalCount} pending)
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex items-center space-x-2">
            <Select value={filterView} onValueChange={filterSubmissions}>
              <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-gray-200">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                <SelectItem value="all">All submissions</SelectItem>
                <SelectItem value="pending">Pending only</SelectItem>
                <SelectItem value="recent">Recently submitted</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortOrder} onValueChange={sortSubmissions}>
              <SelectTrigger className="w-[150px] bg-gray-800 border-gray-700 text-gray-200">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
                <SelectItem value="a-z">A to Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {pendingItems.length > 0 && (
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setShowConfirmApproveAll(true)}
                disabled={isBatchProcessing}
                className="bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                size="sm"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Approve All
              </Button>
              
              <Button
                onClick={() => setShowConfirmRejectAll(true)}
                disabled={isBatchProcessing}
                variant="destructive"
                size="sm"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Reject All
              </Button>
            </div>
          )}
        </div>
      </div>

      {pendingItems.length === 0 ? (
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-8 rounded-xl shadow-xl border border-gray-700/50 text-center backdrop-blur-sm">
          <div className="absolute inset-0 bg-grid-white/5 bg-[size:20px_20px] opacity-10"></div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/10 rounded-full -translate-x-1/3 translate-y-1/3 blur-3xl"></div>
          
          <div className="flex flex-col items-center relative z-10">
            <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
            <h3 className="text-lg font-medium text-white mb-1">All caught up!</h3>
            <p className="text-gray-400">There are no pending submissions to review.</p>
          </div>
        </div>
      ) : (
        /* Content listing */
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl shadow-xl border border-gray-700/50 backdrop-blur-sm">
          <div className="absolute inset-0 bg-grid-white/5 bg-[size:20px_20px] opacity-10"></div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/10 rounded-full -translate-x-1/3 translate-y-1/3 blur-3xl"></div>
          
          <div className="p-4 border-b border-gray-700/50 bg-gray-800/30 relative z-10">
            <div className="flex items-center space-x-2 text-sm font-medium text-yellow-400">
              <Clock className="w-5 h-5" />
              <span>Waiting for review</span>
            </div>
          </div>

          {/* Responsive card view for small screens */}
          <div className="block sm:hidden relative z-10">
            {pendingItems.map((item) => (
              <div key={item.id} className="p-4 border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors">
                <div className="flex gap-4">
                  <button 
                    onClick={() => openFullImage(item)}
                    className="block relative w-20 h-20 rounded-md overflow-hidden bg-gray-800 hover:opacity-80 transition-all flex-shrink-0 ring-1 ring-gray-700/50 hover:ring-2 hover:ring-indigo-500/70 cursor-zoom-in"
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title || "Pending submission"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // If image fails to load, replace with placeholder
                          (e.target as HTMLImageElement).src = getPlaceholderImage(item.title || "Image");
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-700">
                        <span className="text-gray-300 text-xs">No image</span>
                      </div>
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-200 truncate">{item.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">By: {item.user?.name || "Anonymous"}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <Badge variant="outline" className="bg-indigo-900/30 text-indigo-300 border-indigo-800 hover:bg-indigo-900/50">
                        {item.license}
                      </Badge>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <Button
                        onClick={() => handleApprove(item.id)}
                        disabled={isProcessing}
                        variant="default"
                        className="bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                        size="sm"
                        title="Approve this submission"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => openRejectDialog(item)}
                        disabled={isProcessing}
                        variant="destructive"
                        size="sm"
                        title="Reject this submission"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Table for larger screens */}
          <div className="hidden sm:block relative z-10">
            <div className="w-full overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="bg-gray-800/50">
                      <th scope="col" className="w-24 px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Image
                      </th>
                      <th scope="col" className="w-1/5 px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="w-1/6 px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Contributor
                      </th>
                      <th scope="col" className="w-1/4 px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Details
                      </th>
                      <th scope="col" className="w-1/8 px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th scope="col" className="w-1/8 px-3 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {pendingItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="px-3 py-3 whitespace-nowrap">
                          <button 
                            onClick={() => openFullImage(item)}
                            className="block relative w-16 h-16 rounded-md overflow-hidden bg-gray-800 hover:opacity-80 transition-all flex-shrink-0 ring-1 ring-gray-700/50 backdrop-blur-sm hover:ring-2 hover:ring-indigo-500/70 cursor-zoom-in"
                          >
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.title || "Pending submission"}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // If image fails to load, replace with placeholder
                                  (e.target as HTMLImageElement).src = getPlaceholderImage(item.title || "Image");
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-700">
                                <span className="text-gray-300 text-xs">No image</span>
                              </div>
                            )}
                          </button>
                        </td>
                        <td className="px-3 py-3">
                          <div className="text-sm font-medium text-gray-300 truncate max-w-[180px]">
                            {item.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 truncate">
                            ID: {item.id}
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-9 w-9 rounded-full bg-gray-800 overflow-hidden ring-1 ring-gray-700">
                              {item.user?.image ? (
                                <img 
                                  src={item.user.image} 
                                  alt={item.user.name || "User"}
                                  className="h-9 w-9 rounded-full"
                                />
                              ) : (
                                <div className="h-9 w-9 flex items-center justify-center bg-indigo-900/50 text-indigo-300 rounded-full">
                                  {(item.user?.name || "U").charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-300 truncate max-w-[120px]">{item.user?.name || "Anonymous"}</p>
                              <p className="text-xs text-gray-500 truncate max-w-[120px]">{item.user?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="text-sm text-gray-300">
                            <Badge variant="outline" className="bg-indigo-900/30 text-indigo-300 border-indigo-800 hover:bg-indigo-900/50">
                              {item.license}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 truncate max-w-[180px]">
                            {item.category && `Category: ${item.category}`}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-1">
                            {item.tags && item.tags.slice(0, 2).map((tag: string, index: number) => (
                              <span key={index} className="px-1.5 py-0.5 bg-gray-800/50 rounded text-gray-400 ring-1 ring-gray-700/50">
                                {tag}
                              </span>
                            ))}
                            {item.tags && item.tags.length > 2 && (
                              <span className="px-1.5 py-0.5 bg-gray-800/50 rounded text-gray-400 ring-1 ring-gray-700/50">
                                +{item.tags.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                          {item.createdAt && formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Button
                              onClick={() => handleApprove(item.id)}
                              disabled={isProcessing}
                              variant="default"
                              className="bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                              size="sm"
                              title="Approve this submission"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            
                            <Button
                              onClick={() => openRejectDialog(item)}
                              disabled={isProcessing}
                              variant="destructive"
                              size="sm"
                              title="Reject this submission"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Image View Dialog */}
      {currentItem && (
        <Dialog open={isFullImageOpen} onOpenChange={setIsFullImageOpen}>
          <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 bg-gradient-to-br from-gray-900 to-black rounded-lg shadow-2xl border border-gray-800">
            <div className="sticky top-0 z-10 bg-gray-900 p-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-100 truncate pr-6">{currentItem.title}</h2>
              <button 
                onClick={() => setIsFullImageOpen(false)} 
                className="rounded-full p-1 hover:bg-gray-800 transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-0">
              <div className="flex flex-col lg:flex-row">
                <div className="w-full lg:w-3/5 bg-gray-900 flex items-center justify-center p-4 relative">
                  {/* Image viewer with zoom controls */}
                  <div className="absolute top-4 left-4 z-20 flex flex-col space-y-2">
                    <Button
                      onClick={handleZoomIn}
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-full bg-gray-800/80 hover:bg-gray-700 text-gray-300"
                      title="Zoom in"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      onClick={handleZoomOut}
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-full bg-gray-800/80 hover:bg-gray-700 text-gray-300"
                      title="Zoom out"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      onClick={handleResetZoom}
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-full bg-gray-800/80 hover:bg-gray-700 text-gray-300"
                      title="Reset view"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      onClick={handleRotateImage}
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-full bg-gray-800/80 hover:bg-gray-700 text-gray-300"
                      title="Rotate 90°"
                    >
                      <RotateCw className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div 
                    ref={imageRef}
                    className="relative w-full h-[400px] overflow-hidden transition-all duration-200 ease-in-out"
                    style={{
                      cursor: zoomLevel > 1 ? isDragging ? "grabbing" : "grab" : "default"
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onWheel={handleWheel}
                  >
                    <div
                      className="absolute w-full h-full flex items-center justify-center"
                      style={{
                        transform: `scale(${zoomLevel}) rotate(${rotation}deg) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`,
                        transformOrigin: 'center',
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                      }}
                    >
                      {currentItem.imageUrl ? (
                        <img 
                          src={currentItem.imageUrl}
                          alt={currentItem.title || "Image preview"}
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = getPlaceholderImage(currentItem.title || "Image");
                          }}
                          draggable="false"
                        />
                      ) : (
                        <div className="w-64 h-64 flex items-center justify-center bg-gray-800 rounded-lg">
                          <span className="text-gray-400">No image available</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800/80 rounded-full px-3 py-1 text-xs text-gray-300 flex items-center gap-2">
                    <span>{Math.round(zoomLevel * 100)}%</span>
                    <span className="text-gray-500">|</span>
                    <span>{rotation}°</span>
                    {zoomLevel > 1 && (
                      <>
                        <span className="text-gray-500">|</span>
                        <span className="flex items-center text-indigo-300">
                          <Move className="w-3 h-3 mr-1" />
                          <span>Pan available</span>
                        </span>
                      </>
                    )}
                  </div>

                  {/* Add a usage hint for mouse wheel zoom */}
                  <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-800/60 rounded-full px-3 py-1 text-xs text-gray-300 flex items-center gap-2">
                    <span className="text-indigo-300">Tip:</span> Use mouse wheel to zoom in/out
                  </div>
                </div>
                
                <div className="w-full lg:w-2/5 p-6 overflow-y-auto bg-gray-900/50">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-base font-medium text-gray-200 flex items-center">
                        <span className="w-1 h-4 bg-indigo-500 rounded mr-2"></span>
                        Details
                      </h3>
                      <div className="mt-2 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                        <p className="text-sm text-gray-300">{currentItem.description || "No description provided."}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-base font-medium text-gray-200 flex items-center">
                        <span className="w-1 h-4 bg-indigo-500 rounded mr-2"></span>
                        Tags
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {currentItem.tags && currentItem.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="outline" className="bg-indigo-900/30 text-indigo-300 border-indigo-800 hover:bg-indigo-900/50">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-base font-medium text-gray-200 flex items-center">
                        <span className="w-1 h-4 bg-indigo-500 rounded mr-2"></span>
                        License
                      </h3>
                      <div className="mt-2">
                        <Badge className="bg-green-900/30 text-green-300 border-green-800 hover:bg-green-900/50 px-3 py-1">
                          {currentItem.license}
                        </Badge>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-base font-medium text-gray-200 flex items-center">
                        <span className="w-1 h-4 bg-indigo-500 rounded mr-2"></span>
                        Contributor
                      </h3>
                      <div className="mt-2 flex items-center p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-900/50 overflow-hidden flex items-center justify-center border border-gray-700">
                          {currentItem.user?.image ? (
                            <img src={currentItem.user.image} alt={currentItem.user.name} className="h-10 w-10" />
                          ) : (
                            <span className="text-indigo-300 font-medium">{(currentItem.user?.name || "U").charAt(0)}</span>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-200">{currentItem.user?.name || "Anonymous"}</p>
                          <p className="text-xs text-gray-400">{currentItem.user?.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-base font-medium text-gray-200 flex items-center">
                        <span className="w-1 h-4 bg-indigo-500 rounded mr-2"></span>
                        Quick Decision
                      </h3>
                      <div className="mt-2 flex space-x-3">
                        <Button
                          onClick={() => handleApprove(currentItem.id)}
                          disabled={isProcessing} 
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-2"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => {
                            setIsFullImageOpen(false);
                            openRejectDialog(currentItem);
                          }}
                          disabled={isProcessing}
                          variant="destructive"
                          className="flex-1 gap-2"
                        >
                          <ThumbsDown className="w-4 h-4" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-gray-900 border-t border-gray-800 p-4 flex justify-between items-center">
              <div className="text-xs text-gray-500">
                Image {pendingItems.findIndex(item => item.id === currentItem.id) + 1} of {pendingItems.length}
              </div>
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800" onClick={() => setIsFullImageOpen(false)}>
                Close Preview
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Rejection Dialog */}
      {currentItem && (
        <CustomDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
          <CustomDialogContent className="sm:max-w-md p-0 bg-gradient-to-br from-gray-900 to-black text-gray-300 border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl"></div>
            
            <div className="flex items-center p-4 border-b border-gray-800 relative z-10">
              <div className="flex items-center">
                <XCircle className="w-5 h-5 mr-2 text-red-500" />
                <span className="text-lg text-red-400 font-medium">Reject Submission</span>
              </div>
            </div>
            
            <div className="px-4 pt-4 relative z-10">
              <div className="flex items-center gap-3 pb-3 mb-4 border-b border-gray-800">
                <div className="w-16 h-16 bg-gray-900 rounded-md overflow-hidden flex-shrink-0 ring-1 ring-gray-700/50">
                  {currentItem.imageUrl ? (
                    <img 
                      src={currentItem.imageUrl} 
                      alt={currentItem.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getPlaceholderImage(currentItem.title || "Image");
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                      <span className="text-gray-400 text-xs">No image</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-100 truncate max-w-[250px]">{currentItem.title}</h3>
                  <p className="text-gray-400 text-sm mt-0.5">Submitted by {currentItem.user?.name || "Anonymous"}</p>
                </div>
              </div>
              
              <div className="pb-4">
                <p className="text-gray-400 text-sm mb-4">
                  Please select a reason for rejecting this submission. This feedback will be shared with the contributor.
                </p>
                
                <div className="space-y-2.5">
                  {REJECTION_REASONS.map((reason) => (
                    <label 
                      key={reason.id}
                      className={`flex items-start space-x-3 border rounded-lg p-2.5 transition-colors cursor-pointer ${
                        selectedReason === reason.id 
                          ? "border-red-800/70 bg-red-900/10" 
                          : "border-gray-800 hover:bg-gray-800/30"
                      }`}
                    >
                      <div className="mt-0.5">
                        <input
                          type="radio"
                          name="rejection-reason"
                          value={reason.id}
                          checked={selectedReason === reason.id}
                          onChange={() => setSelectedReason(reason.id)}
                          className="text-red-600 bg-gray-900 border-gray-700"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-gray-100">{reason.label}</div>
                        <p className="text-gray-400 text-xs mt-1">{reason.description}</p>
                      </div>
                    </label>
                  ))}
                  
                  <label 
                    className={`flex items-start space-x-3 border rounded-lg p-2.5 transition-colors cursor-pointer ${
                      selectedReason === "custom" 
                        ? "border-red-800/70 bg-red-900/10" 
                        : "border-gray-800 hover:bg-gray-800/30"
                    }`}
                  >
                    <div className="mt-0.5">
                      <input
                        type="radio"
                        name="rejection-reason"
                        value="custom"
                        checked={selectedReason === "custom"}
                        onChange={() => setSelectedReason("custom")}
                        className="text-red-600 bg-gray-900 border-gray-700"
                      />
                    </div>
                    <div className="w-full">
                      <div className="font-medium text-gray-100">Custom reason</div>
                      <Textarea
                        placeholder="Enter a custom rejection reason..."
                        className="mt-2 bg-gray-800 border-gray-700 text-gray-300 placeholder:text-gray-500 text-sm min-h-[80px]"
                        disabled={selectedReason !== "custom"}
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                      />
                    </div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="p-4 flex justify-between border-t border-gray-800 relative z-10">
              <div></div>
              <div className="flex space-x-3">
                <Button
                  onClick={() => setIsRejectDialogOpen(false)}
                  disabled={isProcessing}
                  variant="outline" 
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleReject}
                  disabled={isProcessing || (!selectedReason || (selectedReason === "custom" && !customReason))}
                  variant="destructive"
                  className={`${
                    isProcessing || (!selectedReason || (selectedReason === "custom" && !customReason))
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isProcessing ? "Rejecting..." : "Reject Submission"}
                </Button>
              </div>
            </div>
          </CustomDialogContent>
        </CustomDialog>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 ease-in-out backdrop-blur-sm ${
          toast.type === "success" 
            ? "bg-green-500/90 border border-green-600" 
            : "bg-red-500/90 border border-red-600"
        } text-white`}>
          <div className="flex items-center">
            {toast.type === "success" ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <XCircle className="w-5 h-5 mr-2" />
            )}
            <p>{toast.message}</p>
          </div>
        </div>
      )}

      {/* Confirm Approve All Dialog */}
      <Dialog open={showConfirmApproveAll} onOpenChange={setShowConfirmApproveAll}>
        <DialogContent className="bg-gray-900 text-gray-200 border-gray-800">
          <DialogHeader>
            <DialogTitle>Approve All Submissions</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to approve all {pendingItems.length} pending submissions? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmApproveAll(false)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleApproveAll}
              disabled={isBatchProcessing}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isBatchProcessing ? "Processing..." : "Approve All"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Reject All Dialog */}
      <CustomDialog open={showConfirmRejectAll} onOpenChange={setShowConfirmRejectAll}>
        <CustomDialogContent className="sm:max-w-md p-6 bg-gradient-to-br from-gray-900 to-black text-gray-300 border border-gray-800 rounded-xl shadow-2xl">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-red-400">Reject All Submissions</h3>
            <p className="mt-2 text-sm text-gray-400">
              Are you sure you want to reject all {pendingItems.length} pending submissions?
              This action cannot be undone and will send feedback to all contributors.
            </p>
          </div>
          
          <div className="mt-4 mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Rejection Reason
            </label>
            <Textarea
              placeholder="Enter a reason for rejecting all submissions..."
              className="bg-gray-800 border-gray-700 text-gray-300 placeholder:text-gray-500"
              value={batchRejectReason}
              onChange={(e) => setBatchRejectReason(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end space-x-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowConfirmRejectAll(false)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRejectAll}
              disabled={isBatchProcessing || !batchRejectReason}
              variant="destructive"
            >
              {isBatchProcessing ? "Processing..." : "Reject All"}
            </Button>
          </div>
        </CustomDialogContent>
      </CustomDialog>
    </div>
  );
} 