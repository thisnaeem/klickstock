"use client";

import { useState, useEffect } from "react";
import { Download, Heart, Share, Eye, Clock } from "lucide-react";
import { toast } from "react-hot-toast";
import { recordDownload } from "@/actions/user";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Server action to save image
async function toggleSaveImage(id: string, isSaved: boolean) {
  const response = await fetch('/api/images/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageId: id, action: isSaved ? 'unsave' : 'save' }),
  });

  if (!response.ok) {
    throw new Error('Failed to save image');
  }

  return await response.json();
}

async function checkIfImageIsSaved(id: string) {
  try {
    const response = await fetch(`/api/images/save/check?imageId=${id}`, {
      method: 'GET',
    });
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    return data.isSaved;
  } catch (error) {
    console.error('Error checking save status:', error);
    return false;
  }
}

interface ImageDetailActionsProps {
  imageId: string;
  imageUrl: string;
  title: string;
  currentDownloads: number;
  currentViews: number;
}

export function ImageDetailActions({ 
  imageId, 
  imageUrl, 
  title,
  currentDownloads,
  currentViews 
}: ImageDetailActionsProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [downloads, setDownloads] = useState(currentDownloads);
  const [views, setViews] = useState(currentViews);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = status === 'authenticated';
  
  // Timer related states
  const [showTimer, setShowTimer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [downloadPrepared, setDownloadPrepared] = useState(false);
  const [downloadData, setDownloadData] = useState<{
    objectUrl?: string;
    fileName: string;
    directUrl?: string; // For fallback method
  }>({ fileName: '' });

  // Check if the image is already saved when component mounts
  useEffect(() => {
    const checkSaveStatus = async () => {
      try {
        setIsLoading(true);
        if (isAuthenticated) {
          const savedStatus = await checkIfImageIsSaved(imageId);
          setIsSaved(savedStatus);
        }
      } catch (error) {
        console.error('Error checking save status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSaveStatus();
  }, [imageId, isAuthenticated]);

  // Handle the countdown timer
  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;
    
    if (showTimer && timeLeft > 0) {
      timerId = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (showTimer && timeLeft === 0 && downloadPrepared) {
      // Timer finished, proceed with download
      completeDownload();
    }
    
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [showTimer, timeLeft, downloadPrepared]);
  
  // Cleanup download data when component unmounts
  useEffect(() => {
    return () => {
      if (downloadData.objectUrl) {
        URL.revokeObjectURL(downloadData.objectUrl);
      }
    };
  }, [downloadData.objectUrl]);

  const startDownloadProcess = async () => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      toast.error('Please log in to download images');
      // Store the current URL in sessionStorage to redirect back after login
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
      router.push('/login');
      return;
    }

    try {
      setIsDownloading(true);
      
      try {
        // Record the download
        await recordDownload(session.user.id, imageId);
      } catch (error) {
        console.error('Error recording download:', error);
        // Continue with download even if tracking fails
      }
      
      // Get file extension from URL or default to jpg
      const fileExtension = imageUrl.split('.').pop()?.toLowerCase() || 'jpg';
      const cleanFileName = `${title.replace(/[^\w\s]/gi, '')}_klickstock.${fileExtension}`;
      
      // First, simply prepare the fallback approach - direct link
      setDownloadData({
        directUrl: imageUrl,
        fileName: cleanFileName
      });

      // Set up the timer regardless - direct URL approach will be used if blob fails
      setTimeLeft(10);
      setShowTimer(true);
      setDownloadPrepared(true);
      
      // Show toast notification
      toast.success('Your download is being prepared...', { duration: 3000 });
      
      // Try the advanced blob approach in a non-blocking way
      fetchImageAsBlob(imageUrl, cleanFileName).catch(error => {
        console.error('Blob fetch error, will use direct URL:', error);
        // We already have the fallback setup, so no additional action needed
      });
      
    } catch (error) {
      console.error('Download preparation error:', error);
      toast.error('Failed to prepare download. Please try again.');
      resetDownloadState();
    }
  };
  
  const fetchImageAsBlob = async (url: string, fileName: string) => {
    try {
      // Try with no-cors first to handle potential CORS issues
      const response = await fetch(url, { 
        mode: 'no-cors',
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });
      
      // If response is opaque (no-cors), we can't use it for blob
      if (response.type === 'opaque') {
        throw new Error('CORS restriction, falling back to direct URL');
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }
      
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      
      // Update the download data with blob approach
      setDownloadData(prev => ({
        ...prev,
        objectUrl,
        fileName
      }));
      
    } catch (error) {
      throw error; // Let the caller handle it
    }
  };
  
  const completeDownload = () => {
    if (!downloadPrepared) {
      return;
    }
    
    try {
      // Create and configure download link
      const downloadLink = document.createElement('a');
      
      // Use object URL if available, otherwise fall back to direct URL
      if (downloadData.objectUrl) {
        downloadLink.href = downloadData.objectUrl;
      } else if (downloadData.directUrl) {
        downloadLink.href = downloadData.directUrl;
      } else {
        throw new Error('No download URL available');
      }
      
      downloadLink.download = downloadData.fileName;
      downloadLink.target = '_self'; // Prevent opening in new tab
      downloadLink.rel = 'noopener noreferrer';
      downloadLink.style.display = 'none';
      
      // Add to document, trigger click, then clean up
      document.body.appendChild(downloadLink);
      downloadLink.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(downloadLink);
      }, 100);
      
      // Update local state
      setDownloads(downloads + 1);
      toast.success('Download started!');
    } catch (error) {
      console.error('Download completion error:', error);
      
      // Last resort fallback - open in new tab
      try {
        window.open(imageUrl, '_blank');
        toast.success('Image opened in new tab. Right-click to save.');
      } catch (fallbackError) {
        toast.error('Failed to download. Please try another browser.');
      }
    } finally {
      resetDownloadState();
    }
  };
  
  const resetDownloadState = () => {
    setIsDownloading(false);
    setShowTimer(false);
    setTimeLeft(10);
    setDownloadPrepared(false);
    
    // Clean up any object URLs to prevent memory leaks
    if (downloadData.objectUrl) {
      URL.revokeObjectURL(downloadData.objectUrl);
    }
    
    setDownloadData({ fileName: '' });
  };

  const handleSaveToggle = async () => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      toast.error('Please log in to save images');
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
      router.push('/login');
      return;
    }

    try {
      const result = await toggleSaveImage(imageId, isSaved);
      
      if (result.success) {
        setIsSaved(!isSaved);
        toast.success(isSaved ? 'Removed from saved items' : 'Added to saved items');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save image');
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: `Check out this image: ${title}`,
          url: window.location.href,
        });
        toast.success('Shared successfully!');
      } else {
        // Fallback - copy link to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Share error:', error);
      toast.error('Failed to share image');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div>
      {/* Stats section - updated to match our theme */}
      <div className="bg-gray-800/50 rounded-xl p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center text-gray-300">
          <Eye className="w-4 h-4 mr-2 text-blue-400" />
          <span>{views} views</span>
        </div>
        <div className="flex items-center text-gray-300">
          <Download className="w-4 h-4 mr-2 text-green-400" />
          <span>{downloads} downloads</span>
        </div>
      </div>

      {/* Action Buttons - updated with our new theme */}
      <div className="space-y-4">
        {showTimer ? (
          <div className="relative">
            <div className="w-full rounded-full h-16 overflow-hidden bg-gray-800 border border-gray-700/50 shadow-inner">
              {/* Progress bar */}
              <div 
                className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-1000 ease-linear"
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
              
              {/* Timer text overlay */}
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <Clock className="w-5 h-5 mr-2 text-indigo-300 animate-pulse" />
                <span className="font-medium">
                  {timeLeft === 0 
                    ? 'Initiating download...' 
                    : `Download ready in ${timeLeft} second${timeLeft !== 1 ? 's' : ''}`}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={startDownloadProcess}
            disabled={isDownloading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium py-4 px-6 rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-[0_5px_15px_rgba(79,70,229,0.4)] hover:-translate-y-0.5"
          >
            {isDownloading ? (
              <>
                <div className="flex items-center justify-center space-x-2 mr-3">
                  <div className="relative w-7 h-7">
                    {/* Outer spinning ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-indigo-500/30 border-t-indigo-400 animate-spin"></div>
                    
                    {/* Middle pulsing ring */}
                    <div className="absolute inset-[3px] rounded-full border border-purple-400/40 animate-pulse"></div>
                    
                    {/* Inner spinning ring (opposite direction) */}
                    <div className="absolute inset-[6px] rounded-full border-2 border-t-purple-500 border-r-transparent border-b-indigo-500/40 border-l-transparent animate-spin animation-direction-reverse animation-delay-150"></div>
                    
                    {/* Center dot */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                    </div>
                  </div>
                </div>
                <span className="text-white">Preparing download...</span>
              </>
            ) : (
              <>
                <Download className="w-6 h-6 mr-2" />
                Download
              </>
            )}
          </button>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleSaveToggle}
            disabled={isLoading}
            className={`
              bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium py-3 px-4 rounded-full 
              flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5
              ${isSaved ? 'bg-gradient-to-r from-pink-600/30 to-red-600/30 hover:from-pink-600/20 hover:to-red-600/20' : ''}
            `}
          >
            <Heart className={`w-5 h-5 mr-2 ${isSaved ? 'text-red-500 fill-current' : 'text-gray-200'}`} />
            {isSaved ? 'Saved' : 'Save'}
          </button>
          
          <button
            onClick={handleShare}
            disabled={isSharing}
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium py-3 px-4 rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5"
          >
            {isSharing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-200 mr-2"></div>
                Sharing...
              </>
            ) : (
              <>
                <Share className="w-5 h-5 mr-2" />
                Share
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 