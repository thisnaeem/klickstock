"use client";

import { useState, useEffect } from "react";
import { Download, Heart, Share, Eye } from "lucide-react";
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

  const handleDownload = async () => {
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
      
      try {
        // Use fetch to get the image as a blob
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error('Failed to fetch image');
        
        const blob = await response.blob();
        
        // Create a local URL for the blob
        const objectUrl = URL.createObjectURL(blob);
        
        // Create and configure download link
        const downloadLink = document.createElement('a');
        downloadLink.href = objectUrl;
        downloadLink.download = cleanFileName;
        downloadLink.target = '_self'; // Prevent opening in new tab
        downloadLink.style.display = 'none';
        
        // Add to document, trigger click, then clean up
        document.body.appendChild(downloadLink);
        downloadLink.click();
        
        // Cleanup
        setTimeout(() => {
          document.body.removeChild(downloadLink);
          URL.revokeObjectURL(objectUrl);
        }, 100);
        
        // Update local state
        setDownloads(downloads + 1);
        toast.success('Download started!');
      } catch (error) {
        console.error('Download error:', error);
        
        // Direct fallback method (should work on most browsers)
        const downloadLink = document.createElement('a');
        downloadLink.href = imageUrl;
        downloadLink.download = cleanFileName; // Forces download
        downloadLink.target = '_self'; // Prevents opening in new tab
        downloadLink.rel = 'noopener noreferrer';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        setDownloads(downloads + 1);
        toast.success('Download started!');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download image. Please try again.');
    }
    setIsDownloading(false);
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
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium py-4 px-6 rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-[0_5px_15px_rgba(79,70,229,0.4)] hover:-translate-y-0.5"
        >
          {isDownloading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
              Downloading...
            </>
          ) : (
            <>
              <Download className="w-6 h-6 mr-2" />
              Download
            </>
          )}
        </button>
        
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