"use client";

import { useState, useEffect } from "react";
import { 
  ArrowDownTrayIcon,
  HeartIcon,
  ShareIcon,
  EyeIcon
} from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import { recordDownload } from "@/actions/user";
import { useSession } from "next-auth/react";

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
  const { data: session } = useSession();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [downloads, setDownloads] = useState(currentDownloads);
  const [views, setViews] = useState(currentViews);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the image is already saved when component mounts
  useEffect(() => {
    const checkSaveStatus = async () => {
      try {
        setIsLoading(true);
        const savedStatus = await checkIfImageIsSaved(imageId);
        setIsSaved(savedStatus);
      } catch (error) {
        console.error('Error checking save status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSaveStatus();
  }, [imageId]);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      try {
        // Record the download if user is logged in
        if (session?.user?.id) {
          await recordDownload(session.user.id, imageId);
        } else {
          // Fallback to API route for anonymous users
          await fetch('/api/images/download', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageId }),
          });
        }
      } catch (error) {
        console.error('Error recording download:', error);
        // Continue with download even if tracking fails
      }
      
      // Create a temporary anchor element to trigger download
      const downloadLink = document.createElement('a');
      
      try {
        // Use fetch to get the image as a blob
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error('Failed to fetch image');
        
        const blob = await response.blob();
        
        // Create a local URL for the blob
        const objectUrl = URL.createObjectURL(blob);
        
        // Set up the download
        downloadLink.href = objectUrl;
        downloadLink.download = `${title.replace(/[^\w\s]/gi, '')}_klickstock.jpg`; // Remove special chars from filename
        downloadLink.style.display = 'none';
        
        // Add to document, trigger click, then clean up
        document.body.appendChild(downloadLink);
        downloadLink.click();
        
        // Cleanup
        setTimeout(() => {
          document.body.removeChild(downloadLink);
          URL.revokeObjectURL(objectUrl); // Free up memory
        }, 100);
        
        // Update local state
        setDownloads(downloads + 1);
        toast.success('Download started!');
      } catch (fetchError) {
        console.error('Error with blob method:', fetchError);
        
        // Fallback method: direct link
        try {
          // Directly use the URL as href
          downloadLink.href = imageUrl;
          downloadLink.download = `${title.replace(/[^\w\s]/gi, '')}_klickstock.jpg`;
          downloadLink.target = '_blank'; // Open in new tab as fallback
          downloadLink.style.display = 'none';
          
          document.body.appendChild(downloadLink);
          downloadLink.click();
          
          setTimeout(() => {
            document.body.removeChild(downloadLink);
          }, 100);
          
          // Still increment visual counter
          setDownloads(downloads + 1);
          toast.success('Download started in new tab!');
        } catch (directError) {
          console.error('Error with direct method:', directError);
          // Last resort: open in new tab
          window.open(imageUrl, '_blank');
          toast.success('Image opened in new tab. Right-click to save.');
        }
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSaveToggle = async () => {
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
      {/* Stats */}
      <div className="flex justify-between mb-4 bg-gray-50 rounded-lg p-3">
        <div className="flex items-center text-sm text-gray-600">
          <EyeIcon className="w-4 h-4 mr-2 text-blue-600" />
          <span>{views} views</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <ArrowDownTrayIcon className="w-4 h-4 mr-2 text-green-600" />
          <span>{downloads} downloads</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center transition-colors"
        >
          {isDownloading ? (
            <span className="animate-pulse">Downloading...</span>
          ) : (
            <>
              <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
              Download
            </>
          )}
        </button>
        
        <div className="flex space-x-3">
          <button 
            onClick={handleSaveToggle}
            disabled={isLoading}
            className={`flex-1 border py-2 rounded-lg font-medium flex items-center justify-center transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 
              isSaved 
                ? 'bg-pink-50 text-pink-600 border-pink-200' 
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            {isLoading ? (
              <span className="animate-pulse">Loading...</span>
            ) : isSaved ? (
              <>
                <HeartIcon className="w-5 h-5 mr-2 text-pink-600" />
                Saved
              </>
            ) : (
              <>
                <HeartOutline className="w-5 h-5 mr-2" />
                Save
              </>
            )}
          </button>
          
          <button 
            onClick={handleShare}
            disabled={isSharing}
            className="flex-1 border border-gray-300 hover:bg-gray-50 py-2 rounded-lg font-medium flex items-center justify-center transition-colors"
          >
            <ShareIcon className="w-5 h-5 mr-2" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
} 