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
import { UploadSidebar } from "./UploadSidebar";

// Maximum file size (50MB)
const MAX_FILE_SIZE = 50 * 1024 * 1024;

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
  const [isGeneratingBulk, setIsGeneratingBulk] = useState(false);
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
        dispatch(setSuccess("Images successfully saved as drafts"));
        if (remainingFiles.length === 0) {
          setTimeout(() => {
            router.push('/contributor/drafts');
          }, 2000);
        }
      } else {
        dispatch(setSuccess("Images successfully submitted for review"));
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

  // Generate content with AI for all selected images
  const generateContentWithAIForAll = async () => {
    if (selectedFiles.length === 0) {
      toast.error("No images selected for AI generation");
      return;
    }
    
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
    
    setIsGeneratingBulk(true);
    dispatch(setError(null));
    
    try {
      // Create a list of available categories for the AI
      const availableCategories = CATEGORY_OPTIONS.map(cat => cat.value).join(", ");
      let processedCount = 0;
      let failedCount = 0;
      
      // Process each image sequentially to avoid overwhelming the API
      for (const index of selectedFiles) {
        try {
          const file = files[index];
          const imageBase64 = file.preview.split(',')[1]; // Remove data URL prefix
          
          toast.loading(`Processing image ${processedCount + 1}/${selectedFiles.length}...`, { id: `ai-gen-${index}` });
          
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
            index,
            data: { 
              title: generatedContent.title || file.title,
              description: generatedContent.description || file.description,
              tags: generatedContent.keywords || file.tags,
              category: generatedContent.category || file.category
            }
          }));
          
          processedCount++;
          toast.success(`Generated content for image ${processedCount}/${selectedFiles.length}`, { id: `ai-gen-${index}` });
        } catch (err) {
          console.error(`Failed to generate content for image at index ${index}:`, err);
          failedCount++;
          toast.error(`Failed to generate content for image ${index + 1}`, { id: `ai-gen-${index}` });
        }
        
        // Small delay to avoid rate limiting
        if (selectedFiles.length > 1 && processedCount < selectedFiles.length) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      if (processedCount > 0) {
        toast.success(`Successfully generated content for ${processedCount} image${processedCount !== 1 ? 's' : ''}`);
      }
      
      if (failedCount > 0) {
        toast.error(`Failed to generate content for ${failedCount} image${failedCount !== 1 ? 's' : ''}`);
      }
    } catch (err: unknown) {
      console.error(err);
      const error = err as { message?: string };
      dispatch(setError(error.message || "Failed to generate content. Please try again."));
    } finally {
      setIsGeneratingBulk(false);
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

  // Add select all images functionality to the main files section
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    // Implementation here
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="w-full mx-auto px-6 py-6">
        {success ? (
          <div className="flex flex-col items-center justify-center h-60 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-200 mb-2">Upload Successful!</h3>
            <p className="text-gray-400 mb-6">Your images have been successfully submitted for review</p>
            <div className="flex space-x-4">
              <Button onClick={() => router.push('/contributor')} variant="outline" className="bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700 hover:text-white">
                Return to Dashboard
              </Button>
              <Button onClick={() => {
                dispatch(clearFiles());
                dispatch(setSuccess(null));
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Upload More
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Main Upload Area */}
            {files.length === 0 ? (
              <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
                <div
                  {...getRootProps()}
                  className="border border-dashed border-gray-600 rounded-lg w-full max-w-4xl aspect-[4/3] cursor-pointer"
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-20 h-20 bg-indigo-800/70 rounded-full flex items-center justify-center mb-6">
                      <Upload className="h-10 w-10 text-indigo-300" />
                    </div>
                    <h2 className="text-2xl font-medium text-white mb-2">
                      Drag & drop your images here
                    </h2>
                    <p className="text-gray-400 mb-8">
                      Or click to browse files (JPG, PNG, GIF)
                    </p>
                    <button 
                      type="button"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white transition-colors px-8 py-3 rounded-lg font-medium text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Select Files
                    </button>
                    <p className="text-gray-500 text-sm mt-8">
                      Maximum file size: 50MB
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="min-h-screen">
                {/* Content container with right margin to avoid overlap with sidebar */}
                <div className="pr-[420px]">
                  {/* Header section with upload count and actions */}
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-medium text-white">
                        {files.length} image{files.length !== 1 ? 's' : ''} to upload
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleClearFiles}
                        disabled={isUploading}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md text-sm font-medium transition-colors"
                      >
                        Clear All
                      </button>

                      <button
                        type="button"
                        onClick={selectedFiles.length === files.length ? clearSelection : selectAll}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md text-sm font-medium transition-colors"
                      >
                        {selectedFiles.length === files.length ? "Deselect All" : "Select All"}
                      </button>

                      <div
                        {...getRootProps()}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md text-sm font-medium transition-colors cursor-pointer"
                      >
                        <input {...getInputProps()} />
                        <Upload className="h-4 w-4" />
                        <span>Add more images</span>
                      </div>
                    </div>
                  </div>
                  
                  {error && (
                    <div className="text-red-400 text-sm mb-4">{error}</div>
                  )}
                  
                  {/* Image grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 pb-16">
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
                          className={`relative group cursor-pointer overflow-hidden rounded-lg shadow-md transition-all ${
                            isSelected 
                              ? 'border-2 border-indigo-500 ring-2 ring-indigo-500/30' 
                              : isBulkSelected
                                ? 'border-2 border-indigo-400 ring-1 ring-indigo-400/20'
                                : 'border border-gray-700 hover:border-gray-600'
                          }`}
                          onClick={() => setActiveFileIndex(index)}
                          style={{ 
                            aspectRatio: '1/1',
                            backgroundColor: '#1f2937'
                          }}
                        >
                          {/* Status indicator - Top Left */}
                          <div className="absolute top-2 left-2 z-30">
                            {isComplete ? (
                              <div className="w-7 h-7 flex items-center justify-center bg-green-500/80 hover:bg-green-600/90 text-white rounded-full transition-all">
                                <Check className="h-4 w-4" strokeWidth={2.5} />
                              </div>
                            ) : (
                              <div className="w-7 h-7 flex items-center justify-center bg-red-500/70 hover:bg-red-600/80 text-white rounded-full transition-all">
                                <X className="h-4 w-4" strokeWidth={2.5} />
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
                              className="w-7 h-7 flex items-center justify-center bg-gray-800/90 hover:bg-gray-700/90 text-gray-400 rounded-md transition-all"
                            >
                              {isSelected ? (
                                <Check className="h-4 w-4 text-white" />
                              ) : (
                                <div className="w-4 h-4 border-2 border-gray-500 rounded-sm"></div>
                              )}
                            </button>
                          </div>

                          <div className="absolute inset-0 flex items-center justify-center">
                            {file.imageType === 'PNG' && transparentImages[index] && (
                              <div 
                                className="absolute inset-0 bg-[length:16px_16px] bg-[linear-gradient(45deg,#1f2937_25%,transparent_25%,transparent_75%,#1f2937_75%,#1f2937),linear-gradient(45deg,#1f2937_25%,transparent_25%,transparent_75%,#1f2937_75%,#1f2937)]" 
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
                </div>
              </div>
            )}

            {/* Right sidebar - completely separate from the layout */}
            {files.length > 0 && activeFileIndex !== null && (
              <UploadSidebar
                files={files}
                activeFileIndex={activeFileIndex}
                setActiveFileIndex={setActiveFileIndex}
                newTag={newTag}
                setNewTag={setNewTag}
                handleAddTag={handleAddTag}
                handleRemoveTag={handleRemoveTag}
                handleRemoveFile={handleRemoveFile}
                selectedFiles={selectedFiles}
                isGenerating={isGenerating}
                isGeneratingBulk={isGeneratingBulk}
                generateContentWithAI={generateContentWithAI}
                generateContentWithAIForAll={generateContentWithAIForAll}
                isUploading={isUploading}
                transparentImages={transparentImages}
                handleSubmitAll={handleSubmitAll}
                isFileComplete={isFileComplete}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
} 