"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { 
  X, Plus, Upload, Image as ImageIcon, Trash2, ChevronLeft, 
  Sparkles, Check, CheckSquare, Square, Edit3 
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { uploadImageToServer } from "@/actions/contributor";
import { RootState } from "@/redux/store";
import { toast } from "sonner";
import { 
  addFile, 
  updateFile, 
  removeFile, 
  clearFiles, 
  setUploading, 
  setError, 
  setSuccess 
} from "@/redux/features/uploadSlice";
import { 
  categoryOptions,
  licenseOptions,
  imageTypeOptions,
  aiGenerationOptions 
} from "@/lib/constants";

// Maximum file size (8MB)
const MAX_FILE_SIZE = 8 * 1024 * 1024;

// License options
const LICENSE_OPTIONS = licenseOptions;

// Image type options
const IMAGE_TYPE_OPTIONS = imageTypeOptions;

// AI Generation options
const AI_GENERATION_OPTIONS = aiGenerationOptions;

// Category options (replace with your actual categories)
const CATEGORY_OPTIONS = categoryOptions;

// Add this new type above the UploadForm component
type ValidationStatus = {
  title: boolean;
  category: boolean;
  imageType: boolean;
  aiGeneratedStatus: boolean;
};

// Add this function at the top level of the file
const hasTransparency = (imageUrl: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(false);
        return;
      }
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] < 255) {
          resolve(true);
          return;
        }
      }
      resolve(false);
    };
    img.src = imageUrl;
  });
};

export function UploadForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { files, isUploading, error, success } = useSelector((state: RootState) => state.upload);
  
  const [newTag, setNewTag] = useState("");
  const [activeFileIndex, setActiveFileIndex] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [transparentImages, setTransparentImages] = useState<{ [key: number]: boolean }>({});
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [showBulkEditPanel, setShowBulkEditPanel] = useState(false);

  // Add new state for validation
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>({
    title: false,
    category: false,
    imageType: false,
    aiGeneratedStatus: false
  });

  // Close sidebar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarRef]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  // Open sidebar with specific file
  const openSidebar = (index: number) => {
    setActiveFileIndex(index);
    setIsSidebarOpen(true);
  };

  // Close sidebar
  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setTimeout(() => setActiveFileIndex(null), 300); // Reset after animation ends
  };

  // Add this effect to handle file changes
  useEffect(() => {
    // Reset selection when files array changes length (files added or removed)
    setSelectedFiles([]);
    setActiveFileIndex(files.length > 0 ? 0 : null);
  }, [files.length]);

  // Modify the clearFiles action handler
  const handleClearFiles = () => {
    dispatch(clearFiles());
    setSelectedFiles([]);
    setActiveFileIndex(null);
  };

  // Modify the onDrop callback
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Reset selection states when new files are dropped
    setSelectedFiles([]);
    setActiveFileIndex(null);

    acceptedFiles.forEach((file, index) => {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        dispatch(setError(`File "${file.name}" exceeds the maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB`));
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith("image/")) {
        dispatch(setError(`File "${file.name}" is not an image`));
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          dispatch(addFile({
            id:new Date().getTime()+Math.random().toString(),
            file,
            preview: reader.result,
            title: file.name.split('.')[0].replace(/[-_]/g, ' '),
            description: '',
            tags: [],
            license: 'STANDARD',
            category: '',
            imageType: file.type.includes('png') ? 'PNG' : 'JPG',
            aiGeneratedStatus: 'NOT_AI_GENERATED',
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  }, [dispatch]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    }
  });

  // Effect to ensure first image is selected when files change
  useEffect(() => {
    if (files.length > 0 && activeFileIndex === null) {
      setActiveFileIndex(0);
    } else if (files.length === 0) {
      setActiveFileIndex(null);
    } else if (activeFileIndex !== null && activeFileIndex >= files.length) {
      // If current selection is out of bounds, select the last available image
      setActiveFileIndex(files.length - 1);
    }
  }, [files.length, activeFileIndex]);

  // Handle adding a new tag
  const handleAddTag = (index: number) => {
    if (!newTag.trim()) return;
    
    // Check if adding this tag would exceed the 50 keyword limit
    if (files[index].tags.length >= 50) {
      dispatch(setError("Maximum 50 keywords allowed"));
      return;
    }
    
    // Check if comma-separated values
    if (newTag.includes(',')) {
      const tagArray = newTag.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      
      // Check if adding these tags would exceed the 50 keyword limit
      if (files[index].tags.length + tagArray.length > 50) {
        dispatch(setError("Maximum 50 keywords allowed"));
        return;
      }
      
      dispatch(updateFile({
        index,
        data: {
          tags: [...files[index].tags, ...tagArray]
        }
      }));
    } else {
      dispatch(updateFile({
        index,
        data: {
          tags: [...files[index].tags, newTag.trim()]
        }
      }));
    }
    
    setNewTag("");
  };

  // Handle removing a tag
  const handleRemoveTag = (fileIndex: number, tagIndex: number) => {
    const newTags = [...files[fileIndex].tags];
    newTags.splice(tagIndex, 1);
    
    dispatch(updateFile({
      index: fileIndex,
      data: { tags: newTags }
    }));
  };

  // Add new function to check if all required fields are complete
  const checkValidation = (file: any) => {
    return {
      title: !!file.title?.trim(),
      category: !!file.category?.trim(),
      imageType: !!file.imageType,
      aiGeneratedStatus: !!file.aiGeneratedStatus
    };
  };

  // Update validation status when file changes
  useEffect(() => {
    if (activeFileIndex !== null && files[activeFileIndex]) {
      setValidationStatus(checkValidation(files[activeFileIndex]));
    }
  }, [activeFileIndex, files]);

  // Calculate completion percentage
  const calculateCompletionPercentage = (status: ValidationStatus) => {
    const total = Object.keys(status).length;
    const completed = Object.values(status).filter(Boolean).length;
    return Math.round((completed / total) * 100);
  };

  // Add this helper function to check if a single file is complete
  const isFileComplete = (file: any) => {
    return file.title?.trim() && 
           file.category?.trim() && 
           file.imageType && 
           file.aiGeneratedStatus &&
           file.description?.trim() &&
           file.tags.length > 0;
  };

  // Update the handleSubmitAll function
  const handleSubmitAll = async (saveDraft: boolean = false) => {
    if (files.length === 0) {
      dispatch(setError("Please add at least one image to upload"));
      return;
    }

    // Get completed files
    const completedFiles = files.filter(file => saveDraft ? file.title?.trim() : isFileComplete(file));
    
    if (completedFiles.length === 0) {
      dispatch(setError(saveDraft 
        ? "Please provide at least a title for one image" 
        : "Please complete all required fields for at least one image"));
      return;
    }

    try {
      dispatch(setUploading(true));
      dispatch(setError(null));
      
      const successfullyUploadedIds: string[] = [];
      
      // Upload only completed files
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Skip incomplete files
        if (!saveDraft && !isFileComplete(file)) {
          continue;
        }
        // Skip files without title for drafts
        if (saveDraft && !file.title?.trim()) {
          continue;
        }
        
        try {
          const formData = new FormData();
          formData.append("file", file.file);
          formData.append("title", file.title);
          formData.append("description", file.description);
          formData.append("license", file.license);
          formData.append("category", file.category);
          formData.append("imageType", file.imageType || "JPG");
          formData.append("aiGeneratedStatus", file.aiGeneratedStatus || "NOT_AI_GENERATED");
          file.tags.forEach(tag => {
            formData.append("keywords[]", tag);
          });
          
          await uploadImageToServer(formData, saveDraft);
          successfullyUploadedIds.push(file.id);
          
        } catch (error) {
          console.error(`Failed to upload image ${i}:`, error);
          // Continue with other images if one fails
        }
      }
      
      if (successfullyUploadedIds.length === 0) {
        throw new Error("No images were uploaded successfully");
      }

      // Remove uploaded files from the state
      const remainingFiles = files.filter((file, index) => !successfullyUploadedIds.includes(file.id));
      console.log(remainingFiles)
      // Update the files state
      if (remainingFiles.length === 0) {
        dispatch(clearFiles());
        setSelectedFiles([]);
        setActiveFileIndex(null);
      } else {
        dispatch(clearFiles());
        remainingFiles.forEach((file)=>{
          dispatch(addFile(file))
        })
        setActiveFileIndex(0);
        setSelectedFiles([]);
      }

      const uploadedCount = successfullyUploadedIds.length;
      if (saveDraft) {
        dispatch(setSuccess(`${uploadedCount} image${uploadedCount !== 1 ? 's' : ''} saved as draft! You can submit them for review later.`));
        if (remainingFiles.length === 0) {
          setTimeout(() => {
            router.push('/contributor/drafts');
          }, 2000);
        }
      } else {
        dispatch(setSuccess(`${uploadedCount} image${uploadedCount !== 1 ? 's' : ''} uploaded successfully! They will be reviewed by our team.`));
        if (remainingFiles.length === 0) {
          setTimeout(() => {
            router.refresh();
          }, 2000);
        }
      }
      
    } catch (err: any) {
      console.error(err);
      dispatch(setError(err.message || "Failed to upload images. Please try again."));
    } finally {
      dispatch(setUploading(false));
    }
  };

  // Generate content with Gemini AI
  const generateContentWithAI = async () => {
    if (!activeFileIndex && activeFileIndex !== 0) return;
    
    const apiKey = localStorage.getItem("geminiApiKey");
    if (!apiKey) {
      dispatch(setError("Gemini API key is missing"));
      toast.error(
        <div className="flex flex-col gap-2">
          <p>Please add your Gemini API key in Settings first</p>
          <a 
            href="/contributor/settings" 
            className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 inline-block text-center"
          >
            Go to Settings
          </a>
        </div>
      );
      return;
    }
    
    setIsGenerating(true);
    dispatch(setError(null));
    
    try {
      const file = files[activeFileIndex];
      const imageBase64 = file.preview.split(',')[1]; // Remove data URL prefix
      
      // Create a list of available categories for the AI
      const availableCategories = CATEGORY_OPTIONS.map(cat => cat.value).join(", ");
      
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate a professional title, detailed description, 5-7 relevant keywords, and select the most appropriate category for this image. The category MUST be chosen from this exact list: ${availableCategories}. Format your response as JSON with fields: title, description, keywords (as array), category (must match one from the list exactly). Be specific, descriptive and professional.`
                },
                {
                  inline_data: {
                    mime_type: file.file.type,
                    data: imageBase64
                  }
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 0.95,
            maxOutputTokens: 800,
          }
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || "Error generating content");
      }
      
      // Parse the response text as JSON
      const textResponse = data.candidates[0].content.parts[0].text;
      
      // Find the JSON part within the text (in case model wrapped it)
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Invalid response format from AI");
      }
      
      const generatedContent = JSON.parse(jsonMatch[0]);
      
      // Validate that the category is from our list
      if (!CATEGORY_OPTIONS.some(cat => cat.value === generatedContent.category)) {
        throw new Error("AI generated an invalid category");
      }
      
      // Update the file with generated content
      dispatch(updateFile({
        index: activeFileIndex,
        data: { 
          title: generatedContent.title || file.title,
          description: generatedContent.description || file.description,
          tags: generatedContent.keywords || file.tags,
          category: generatedContent.category || file.category
        }
      }));
      
      toast.success("Content generated successfully!");
    } catch (err: unknown) {
      console.error(err);
      const error = err as { message?: string };
      dispatch(setError(error.message || "Failed to generate content. Please try again."));
    } finally {
      setIsGenerating(false);
    }
  };

  // Add effect to check transparency when files change
  useEffect(() => {
    files.forEach(async (file, index) => {
      if (file.imageType === 'PNG') {
        const isTransparent = await hasTransparency(file.preview);
        setTransparentImages(prev => ({
          ...prev,
          [index]: isTransparent
        }));
      }
    });
  }, [files]);

  // Bulk selection handlers
  const toggleFileSelection = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedFiles(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const selectAll = () => {
    setSelectedFiles(files.map((_, index) => index));
  };

  const clearSelection = () => {
    setSelectedFiles([]);
  };

  // Bulk edit handlers
  const handleBulkDelete = () => {
    // Sort in descending order to avoid index shifting issues
    const sortedIndices = [...selectedFiles].sort((a, b) => b - a);
    sortedIndices.forEach(index => {
      dispatch(removeFile(index));
    });
    clearSelection();
  };

  const handleBulkEdit = (data: any) => {
    selectedFiles.forEach(index => {
      dispatch(updateFile({
        index,
        data
      }));
    });
    setShowBulkEditPanel(false);
  };

  // Update the removeFile action to handle selection
  const handleRemoveFile = (index: number) => {
    dispatch(removeFile(index));
    // Remove the index from selected files
    setSelectedFiles(prev => prev.filter(i => i !== index).map(i => i > index ? i - 1 : i));
    // Update active index if needed
    if (activeFileIndex === index) {
      setActiveFileIndex(files.length > 1 ? 0 : null);
    } else if (activeFileIndex !== null && activeFileIndex > index) {
      setActiveFileIndex(activeFileIndex - 1);
    }
  };

  return (
    <div>
      {files.length === 0 ? (
        // Empty state - only show dropzone
        <div className="max-w-3xl mx-auto">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center">
              <Upload className="h-12 w-12 text-gray-400 mb-3" />
              <p className="text-lg font-medium text-gray-700">
                Drag & drop images here, or click to select
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Support for JPEG, PNG and GIF. Max {MAX_FILE_SIZE / (1024 * 1024)}MB per file.
              </p>
            </div>
          </div>
          
          {error && (
            <div className="mt-4 text-red-500 text-sm text-center">{error}</div>
          )}
        </div>
      ) : (
        // Show full layout when images exist
        <div className="flex gap-6">
          <div className="flex-1 pr-[420px]">
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                {success}
              </div>
            )}
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {files.length} image{files.length !== 1 ? 's' : ''} to upload
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClearFiles}
                  disabled={isUploading}
                  size="sm"
                >
                  Clear All
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={selectedFiles.length === files.length ? clearSelection : selectAll}
                  className="text-gray-600 hover:text-gray-700"
                >
                  {selectedFiles.length === files.length ? "Deselect All" : "Select All"}
                </Button>

                <div
                  {...getRootProps()}
                  className={`px-4 py-2 rounded-lg cursor-pointer transition-colors inline-flex items-center gap-2 ${
                    isDragActive 
                      ? "bg-blue-50 text-blue-600 border border-blue-200" 
                      : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="h-4 w-4" />
                  <span className="text-sm font-medium">Add more images</span>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="text-red-500 text-sm mb-4">{error}</div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
              {files.map((file, index) => {
                const status = {
                  title: !!file.title?.trim(),
                  category: !!file.category?.trim(),
                  imageType: !!file.imageType,
                  aiGeneratedStatus: !!file.aiGeneratedStatus,
                  description: !!file.description?.trim(),
                  tags: file.tags.length > 0
                };
                
                const isComplete = Object.values(status).every(Boolean);
                const isSelected = index === activeFileIndex;
                const isBulkSelected = selectedFiles.includes(index);
                
                return (
                  <div 
                    key={index} 
                    className={`relative group cursor-pointer overflow-hidden rounded-lg shadow-sm transition-all ${
                      isSelected 
                        ? 'border-2 border-blue-500 ring-2 ring-blue-100' 
                        : isBulkSelected
                        ? 'border-2 border-blue-400 ring-2 ring-blue-100'
                        : 'border border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveFileIndex(index)}
                    style={{ 
                      aspectRatio: '1/1',
                      backgroundColor: '#f8f9fa'
                    }}
                  >
                    {/* Completion Status - Top Left */}
                    <div className="absolute top-2 left-2 z-20">
                      {isComplete ? (
                        <div className="bg-green-100/50 backdrop-blur-[1px] rounded-full p-1.5 transition-all duration-200">
                          <Check className="h-3.5 w-3.5 text-green-600/70" strokeWidth={2.5} />
                        </div>
                      ) : (
                        <div className="bg-red-100/50 backdrop-blur-[1px] rounded-full p-1.5 transition-all duration-200">
                          <X className="h-3.5 w-3.5 text-red-600/70" strokeWidth={2.5} />
                        </div>
                      )}
                    </div>

                    {/* Selection Checkmark - Top Right */}
                    <div className="absolute top-2 right-2 z-20">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFileSelection(index, e);
                        }}
                        className={`w-6 h-6 flex items-center justify-center transition-all duration-200 ${
                          isBulkSelected 
                            ? 'bg-blue-500 border-2 border-white text-white shadow-sm' 
                            : 'bg-white/90 border-2 border-gray-300 text-transparent hover:border-gray-400'
                        } rounded-md ${
                          isBulkSelected ? 'opacity-100' : 'opacity-100 group-hover:opacity-100'
                        }`}
                        aria-label={isBulkSelected ? "Deselect image" : "Select image"}
                      >
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </button>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center">
                      {file.imageType === 'PNG' && transparentImages[index] && (
                        <div 
                          className="absolute inset-0 bg-[length:16px_16px] bg-[linear-gradient(45deg,#f0f0f0_25%,transparent_25%,transparent_75%,#f0f0f0_75%,#f0f0f0),linear-gradient(45deg,#f0f0f0_25%,transparent_25%,transparent_75%,#f0f0f0_75%,#f0f0f0)]" 
                          style={{ 
                            backgroundPosition: "0 0, 8px 8px",
                            backgroundSize: "16px 16px",
                            backgroundRepeat: "repeat",
                            zIndex: 0
                          }}
                        />
                      )}
                      <img
                        src={file.preview}
                        alt={file.title || `Image ${index + 1}`}
                        className={`w-full h-full transition-transform duration-200 group-hover:scale-105 ${
                          file.imageType === 'PNG' && transparentImages[index]
                            ? 'object-contain bg-transparent'
                            : 'object-cover'
                        }`}
                        style={{ position: 'relative', zIndex: 1 }}
                        onError={(e) => {
                          console.error('Image failed to load:', file.file.name);
                          e.currentTarget.src = '/placeholder-image.png';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSubmitAll(true)}
                disabled={isUploading || files.every(file => !file.title?.trim())}
                className="min-w-[120px]"
              >
                {isUploading ? "Saving..." : "Save as Draft"}
              </Button>
              
              <Button
                type="button"
                onClick={() => handleSubmitAll(false)}
                disabled={isUploading || !files.some(isFileComplete)}
                className={`min-w-[150px] ${
                  files.some(isFileComplete)
                    ? 'bg-green-600 hover:bg-green-700'
                    : ''
                }`}
              >
                {isUploading 
                  ? "Uploading..." 
                  : `Submit ${files.filter(isFileComplete).length} for Review`}
              </Button>
            </div>
          </div>

          <div className="w-[400px] bg-white rounded-lg shadow-lg fixed top-4 right-4">
            <div className="flex flex-col h-[calc(100vh-2rem)] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-medium">
                  {selectedFiles.length > 1 
                    ? `Edit ${selectedFiles.length} Images` 
                    : 'Edit Image Details'}
                </h3>
                {activeFileIndex !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedFiles.length > 1) {
                        handleBulkDelete();
                      } else {
                        handleRemoveFile(activeFileIndex);
                      }
                    }}
                    className="h-8 w-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    aria-label="Delete image"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              {(activeFileIndex !== null || selectedFiles.length > 0) && files.length > 0 ? (
                <>
                  <div className="p-4 bg-gray-50">
                    <div 
                      className="relative h-48 rounded-lg overflow-hidden bg-white cursor-pointer group border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      {files[activeFileIndex !== null ? activeFileIndex : selectedFiles[0] || 0].imageType === 'PNG' && 
                        transparentImages[activeFileIndex !== null ? activeFileIndex : selectedFiles[0] || 0] && (
                        <div 
                          className="absolute inset-0 bg-[length:16px_16px] bg-[linear-gradient(45deg,#f0f0f0_25%,transparent_25%,transparent_75%,#f0f0f0_75%,#f0f0f0),linear-gradient(45deg,#f0f0f0_25%,transparent_25%,transparent_75%,#f0f0f0_75%,#f0f0f0)]" 
                          style={{ 
                            backgroundPosition: "0 0, 8px 8px",
                            backgroundSize: "16px 16px",
                            backgroundRepeat: "repeat",
                            zIndex: 0
                          }}
                        />
                      )}
                      <img
                        src={files[activeFileIndex !== null ? activeFileIndex : selectedFiles[0] || 0].preview}
                        alt={files[activeFileIndex !== null ? activeFileIndex : selectedFiles[0] || 0].title || 
                          `Image ${(activeFileIndex !== null ? activeFileIndex : selectedFiles[0] || 0) + 1}`}
                        className="w-full h-full object-cover select-none pointer-events-none"
                        style={{ position: 'relative', zIndex: 1, userSelect: 'none', WebkitUserSelect: 'none' }}
                        draggable="false"
                      />
                    </div>

                    <Button
                      type="button"
                      onClick={() => generateContentWithAI()}
                      disabled={isGenerating || selectedFiles.length > 1}
                      className="w-full mt-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      {isGenerating ? "Generating..." : "Generate with AI"}
                    </Button>
                    {selectedFiles.length > 1 && (
                      <p className="text-xs text-gray-500 mt-1 text-center">AI generation is only available when editing a single image</p>
                    )}
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {selectedFiles.length > 1 && (
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4">
                        <p className="text-sm text-blue-700">
                          Changes will be applied to all {selectedFiles.length} selected images
                        </p>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="sidebar-title" className="text-gray-700">
                        Title <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="sidebar-title"
                        value={files[activeFileIndex !== null ? activeFileIndex : selectedFiles[0] || 0].title}
                        onChange={(e) => {
                          if (selectedFiles.length > 1) {
                            selectedFiles.forEach(index => {
                              dispatch(updateFile({
                                index,
                                data: { title: e.target.value }
                              }));
                            });
                          } else {
                            dispatch(updateFile({
                              index: activeFileIndex !== null ? activeFileIndex : selectedFiles[0] || 0,
                              data: { title: e.target.value }
                            }));
                          }
                        }}
                        placeholder="Enter image title"
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="sidebar-description" className="text-gray-700">
                        Description
                      </Label>
                      <Textarea
                        id="sidebar-description"
                        value={files[activeFileIndex !== null ? activeFileIndex : selectedFiles[0] || 0].description}
                        onChange={(e) => {
                          if (selectedFiles.length > 1) {
                            selectedFiles.forEach(index => {
                              dispatch(updateFile({
                                index,
                                data: { description: e.target.value }
                              }));
                            });
                          } else {
                            dispatch(updateFile({
                              index: activeFileIndex !== null ? activeFileIndex : selectedFiles[0] || 0,
                              data: { description: e.target.value }
                            }));
                          }
                        }}
                        placeholder="Describe your image"
                        rows={3}
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="sidebar-category" className="text-gray-700">
                          Category <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={files[activeFileIndex !== null ? activeFileIndex : selectedFiles[0] || 0].category}
                          onValueChange={(value) => {
                            if (selectedFiles.length > 1) {
                              selectedFiles.forEach(index => {
                                dispatch(updateFile({
                                  index,
                                  data: { category: value }
                                }));
                              });
                            } else {
                              dispatch(updateFile({
                                index: activeFileIndex !== null ? activeFileIndex : selectedFiles[0] || 0,
                                data: { category: value }
                              }));
                            }
                          }}
                        >
                          <SelectTrigger 
                            id="sidebar-category" 
                            className="mt-1 border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-gray-200 shadow-md">
                            {CATEGORY_OPTIONS.map((category) => (
                              <SelectItem 
                                key={category.value} 
                                value={category.value}
                                className="text-gray-800 hover:bg-blue-50 focus:bg-blue-50"
                              >
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="sidebar-license" className="text-gray-700">
                          License
                        </Label>
                        <Select
                          value={files[activeFileIndex !== null ? activeFileIndex : selectedFiles[0] || 0].license}
                          onValueChange={(value) => {
                            if (selectedFiles.length > 1) {
                              selectedFiles.forEach(index => {
                                dispatch(updateFile({
                                  index,
                                  data: { license: value }
                                }));
                              });
                            } else {
                              dispatch(updateFile({
                                index: activeFileIndex !== null ? activeFileIndex : selectedFiles[0] || 0,
                                data: { license: value }
                              }));
                            }
                          }}
                        >
                          <SelectTrigger 
                            id="sidebar-license" 
                            className="mt-1 border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <SelectValue placeholder="Select license" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-gray-200 shadow-md">
                            {LICENSE_OPTIONS.map((license) => (
                              <SelectItem 
                                key={license.value} 
                                value={license.value}
                                className="text-gray-800 hover:bg-blue-50 focus:bg-blue-50"
                              >
                                {license.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="sidebar-image-type" className="text-gray-700">
                          Image Type <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={files[activeFileIndex !== null ? activeFileIndex : selectedFiles[0] || 0].imageType}
                          onValueChange={(value) => {
                            if (selectedFiles.length > 1) {
                              selectedFiles.forEach(index => {
                                dispatch(updateFile({
                                  index,
                                  data: { imageType: value }
                                }));
                              });
                            } else {
                              dispatch(updateFile({
                                index: activeFileIndex !== null ? activeFileIndex : selectedFiles[0] || 0,
                                data: { imageType: value }
                              }));
                            }
                          }}
                        >
                          <SelectTrigger 
                            id="sidebar-image-type" 
                            className="mt-1 border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <SelectValue placeholder="Select image type" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-gray-200 shadow-md">
                            {IMAGE_TYPE_OPTIONS.map((type) => (
                              <SelectItem 
                                key={type.value} 
                                value={type.value}
                                className="text-gray-800 hover:bg-blue-50 focus:bg-blue-50"
                              >
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="sidebar-ai-status" className="text-gray-700">
                            AI Generated <span className="text-red-500">*</span>
                          </Label>
                          <Switch
                            id="sidebar-ai-status"
                            checked={files[activeFileIndex !== null ? activeFileIndex : selectedFiles[0] || 0].aiGeneratedStatus === 'AI_GENERATED'}
                            onCheckedChange={(checked: boolean) => {
                              const newStatus = checked ? 'AI_GENERATED' : 'NOT_AI_GENERATED';
                              if (selectedFiles.length > 1) {
                                selectedFiles.forEach(index => {
                                  dispatch(updateFile({
                                    index,
                                    data: { aiGeneratedStatus: newStatus }
                                  }));
                                });
                              } else {
                                dispatch(updateFile({
                                  index: activeFileIndex !== null ? activeFileIndex : selectedFiles[0] || 0,
                                  data: { aiGeneratedStatus: newStatus }
                                }));
                              }
                            }}
                            className="mt-1"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {files[activeFileIndex !== null ? activeFileIndex : selectedFiles[0] || 0].aiGeneratedStatus === 'AI_GENERATED' 
                            ? "This image was created with AI" 
                            : "This image was not created with AI"}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-gray-700 flex justify-between items-center">
                        <span>Keywords</span>
                        <span className="text-xs text-gray-500">{files[activeFileIndex !== null ? activeFileIndex : selectedFiles[0] || 0].tags.length}/50 max</span>
                      </Label>
                      <div className="flex flex-wrap gap-2 mt-2 min-h-[40px] p-2 border rounded-md border-gray-200">
                        {files[activeFileIndex !== null ? activeFileIndex : selectedFiles[0] || 0].tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} className="gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200">
                            {tag}
                            <button 
                              type="button"
                              onClick={() => handleRemoveTag(activeFileIndex !== null ? activeFileIndex : selectedFiles[0] || 0, tagIndex)}
                              className="ml-1 text-blue-700 hover:text-blue-900"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex mt-2">
                        <Input
                          placeholder="Add keywords (comma separated)"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTag(activeFileIndex !== null ? activeFileIndex : selectedFiles[0] || 0);
                            }
                          }}
                          className="mr-2"
                        />
                        <Button 
                          type="button" 
                          onClick={() => handleAddTag(activeFileIndex !== null ? activeFileIndex : selectedFiles[0] || 0)}
                          size="sm"
                          variant="outline"
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Enter keywords separated by commas. Maximum 50 keywords allowed.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select an image to edit its details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 