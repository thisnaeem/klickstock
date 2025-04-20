"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ContributorItemStatus } from "@prisma/client";
import { 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon
} from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { approveSubmission, rejectSubmission } from "@/actions/admin";

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
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pending Submissions</h1>
            <p className="mt-1 text-base text-gray-500">
              Loading submissions...
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pending Submissions</h1>
          <p className="mt-1 text-base text-gray-500">
            Review and approve contributor submissions ({totalCount} pending)
          </p>
        </div>
      </div>

      {pendingItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="flex flex-col items-center">
            <CheckCircleIcon className="w-16 h-16 text-green-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">All caught up!</h3>
            <p className="text-gray-500">There are no pending submissions to review.</p>
          </div>
        </div>
      ) : (
        /* Content listing */
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-2 text-sm font-medium text-amber-600">
              <ClockIcon className="w-5 h-5" />
              <span>Waiting for review</span>
            </div>
          </div>

          {/* Responsive card view for small screens */}
          <div className="block sm:hidden">
            {pendingItems.map((item) => (
              <div key={item.id} className="p-4 border-b border-gray-200">
                <div className="flex gap-4">
                  <button 
                    onClick={() => openFullImage(item)}
                    className="block relative w-20 h-20 rounded-md overflow-hidden bg-gray-100 hover:opacity-80 transition-opacity flex-shrink-0"
                  >
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="object-cover w-full h-full"
                      />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{item.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">By: {item.user?.name || "Anonymous"}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.license}
                      </span>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <Button
                        onClick={() => handleApprove(item.id)}
                        disabled={isProcessing}
                        className="bg-green-500 hover:bg-green-600"
                        size="sm"
                      >
                        <CheckCircleIcon className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => openRejectDialog(item)}
                        disabled={isProcessing}
                        variant="destructive"
                        size="sm"
                      >
                        <XCircleIcon className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Table for larger screens */}
          <div className="hidden sm:block">
            <div className="w-full overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="bg-gray-50">
                      <th scope="col" className="w-24 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Image
                      </th>
                      <th scope="col" className="w-1/5 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="w-1/6 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contributor
                      </th>
                      <th scope="col" className="w-1/4 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                      <th scope="col" className="w-1/8 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th scope="col" className="w-1/8 px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-3 py-3 whitespace-nowrap">
                          <button 
                            onClick={() => openFullImage(item)}
                            className="block relative w-16 h-16 rounded-md overflow-hidden bg-gray-100 hover:opacity-80 transition-opacity"
                          >
                            {item.imageUrl && (
                              <div className="relative w-full h-full">
                                <img
                                  src={item.imageUrl}
                                  alt={item.title}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                            )}
                          </button>
                        </td>
                        <td className="px-3 py-3">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                            {item.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 truncate">
                            ID: {item.id}
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                              {item.user?.image ? (
                                <img 
                                  src={item.user.image} 
                                  alt={item.user.name || "User"}
                                  className="h-8 w-8 rounded-full"
                                />
                              ) : (
                                <div className="h-8 w-8 flex items-center justify-center bg-blue-100 text-blue-500 rounded-full">
                                  {(item.user?.name || "U").charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">{item.user?.name || "Anonymous"}</p>
                              <p className="text-xs text-gray-500 truncate max-w-[120px]">{item.user?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="text-sm text-gray-900">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                              {item.license}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 truncate max-w-[180px]">
                            {item.category && `Category: ${item.category}`}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-1">
                            {item.tags && item.tags.slice(0, 2).map((tag: string, index: number) => (
                              <span key={index} className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">
                                {tag}
                              </span>
                            ))}
                            {item.tags && item.tags.length > 2 && (
                              <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">
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
                              className="bg-green-500 hover:bg-green-600"
                              size="sm"
                            >
                              <CheckCircleIcon className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => openRejectDialog(item)}
                              disabled={isProcessing}
                              variant="destructive"
                              size="sm"
                            >
                              <XCircleIcon className="w-4 h-4 mr-1" />
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
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 bg-white rounded-lg shadow-xl">
            <div className="sticky top-0 z-10 bg-white p-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 truncate pr-6">{currentItem.title}</h2>
              <button 
                onClick={() => setIsFullImageOpen(false)} 
                className="rounded-full p-1 hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-0">
              <div className="flex flex-col lg:flex-row">
                <div className="w-full lg:w-3/5 bg-gray-50 flex items-center justify-center p-4">
                  {currentItem.imageUrl && (
                    <img
                      src={currentItem.imageUrl}
                      alt={currentItem.title}
                      className="max-h-[60vh] object-contain rounded shadow-sm"
                    />
                  )}
                </div>
                
                <div className="w-full lg:w-2/5 p-6 overflow-y-auto">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-base font-medium text-gray-900">Details</h3>
                      <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{currentItem.description || "No description provided."}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-base font-medium text-gray-900">Tags</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {currentItem.tags.map((tag: string, index: number) => (
                          <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-base font-medium text-gray-900">License</h3>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700">
                          {currentItem.license}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-base font-medium text-gray-900">Contributor</h3>
                      <div className="mt-2 flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 overflow-hidden flex items-center justify-center">
                          {currentItem.user?.image ? (
                            <img src={currentItem.user.image} alt={currentItem.user.name} className="h-8 w-8" />
                          ) : (
                            <span className="text-blue-600 font-medium">{(currentItem.user?.name || "U").charAt(0)}</span>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">{currentItem.user?.name || "Anonymous"}</p>
                          <p className="text-xs text-gray-500">{currentItem.user?.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 flex justify-between items-center">
              <div className="flex gap-2">
                <Button
                  onClick={() => handleApprove(currentItem.id)}
                  disabled={isProcessing}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => {
                    setIsFullImageOpen(false);
                    openRejectDialog(currentItem);
                  }}
                  disabled={isProcessing}
                  variant="destructive"
                >
                  <XCircleIcon className="w-5 h-5 mr-2" />
                  Reject
                </Button>
              </div>
              <Button variant="outline" onClick={() => setIsFullImageOpen(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Rejection Dialog */}
      {currentItem && (
        <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
          <DialogContent className="sm:max-w-md p-0 bg-black text-gray-300 border-0 rounded-xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center">
                <XCircleIcon className="w-5 h-5 mr-2 text-red-500" />
                <span className="text-lg text-red-500 font-medium">Reject Submission</span>
              </div>
              <button 
                onClick={() => setIsRejectDialogOpen(false)} 
                className="rounded-full p-1 hover:bg-gray-800 transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="px-4 pt-4">
              <div className="flex items-center gap-3 pb-3 mb-4 border-b border-gray-800">
                <div className="w-16 h-16 bg-gray-900 rounded-md overflow-hidden flex-shrink-0">
                  {currentItem.imageUrl && (
                    <img src={currentItem.imageUrl} alt={currentItem.title} className="w-full h-full object-cover" />
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
                          ? "border-red-800 bg-gray-900" 
                          : "border-gray-800 hover:bg-gray-900"
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
                        ? "border-red-800 bg-gray-900" 
                        : "border-gray-800 hover:bg-gray-900"
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
            
            <div className="p-4 flex justify-between border-t border-gray-800">
              <div></div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsRejectDialogOpen(false)}
                  disabled={isProcessing}
                  className="px-5 py-2 bg-transparent border border-gray-700 text-gray-300 rounded-md hover:bg-gray-800 hover:text-gray-100 text-sm font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleReject}
                  disabled={isProcessing || (!selectedReason || (selectedReason === "custom" && !customReason))}
                  className={`px-6 py-2 bg-red-600 text-white rounded-md text-sm font-medium ${
                    isProcessing || (!selectedReason || (selectedReason === "custom" && !customReason))
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-red-700"
                  }`}
                >
                  {isProcessing ? "Rejecting..." : "Reject Submission"}
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg ${
          toast.type === "success" ? "bg-green-500" : "bg-red-500"
        } text-white z-50`}>
          <div className="flex items-center">
            {toast.type === "success" ? (
              <CheckCircleIcon className="w-5 h-5 mr-2" />
            ) : (
              <XCircleIcon className="w-5 h-5 mr-2" />
            )}
            <p>{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
} 