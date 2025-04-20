"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { recordDownload } from "@/actions/user";
import { toast } from "react-hot-toast";

interface DownloadButtonProps {
  userId: string;
  contributorItemId: string;
  imageUrl: string;
  title: string;
}

export default function DownloadButton({
  userId,
  contributorItemId,
  imageUrl,
  title
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      // Record the download in the database
      await recordDownload(userId, contributorItemId);
      
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

  return (
    <Button 
      size="sm" 
      onClick={handleDownload} 
      disabled={isDownloading}
      className="rounded-full p-2 h-auto w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow transition-all"
    >
      {isDownloading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      <span className="sr-only">Download Again</span>
    </Button>
  );
} 