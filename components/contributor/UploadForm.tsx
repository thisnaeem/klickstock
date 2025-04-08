"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { X, Plus, Upload, Image as ImageIcon, Trash2, ChevronLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { uploadImageToServer } from "@/actions/contributor";
import { RootState } from "@/redux/store";
import { 
  addFile, 
  updateFile, 
  removeFile, 
  clearFiles, 
  setUploading, 
  setError, 
  setSuccess 
} from "@/redux/features/uploadSlice";

// Maximum file size (8MB)
const MAX_FILE_SIZE = 8 * 1024 * 1024;

// License options
const LICENSE_OPTIONS = [
  { value: "STANDARD", label: "Standard License" },
  { value: "EXTENDED", label: "Extended License" },
];

// Category options (replace with your actual categories)
const CATEGORY_OPTIONS = [
  { value: "nature", label: "Nature" },
  { value: "business", label: "Business" },
  { value: "technology", label: "Technology" },
  { value: "food", label: "Food & Drink" },
  { value: "people", label: "People" },
  { value: "abstract", label: "Abstract" },
  { value: "animals", label: "Animals" },
  { value: "travel", label: "Travel" },
];

export function UploadForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { files, isUploading, error, success } = useSelector((state: RootState) => state.upload);
  
  const [newTag, setNewTag] = useState("");
  const [activeFileIndex, setActiveFileIndex] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

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

  // Dropzone setup for bulk upload
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
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
        dispatch(addFile({
          file,
          preview: reader.result as string,
          title: file.name.split('.')[0].replace(/[-_]/g, ' '),
          description: '',
          tags: [],
          license: 'STANDARD',
          category: '',
        }));
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

  // Handle adding a new tag
  const handleAddTag = (index: number) => {
    if (!newTag.trim()) return;
    
    dispatch(updateFile({
      index,
      data: {
        tags: [...files[index].tags, newTag.trim()]
      }
    }));
    
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

  // Handle submit all images
  const handleSubmitAll = async (saveDraft: boolean = false) => {
    if (files.length === 0) {
      dispatch(setError("Please add at least one image to upload"));
      return;
    }

    // For drafts, we only need the image file and title
    if (!saveDraft) {
      // Validate all files have required fields for submission
      const incompleteIndex = files.findIndex(file => 
        !file.title.trim() || !file.category.trim()
      );

      if (incompleteIndex >= 0) {
        dispatch(setError(`Please fill in all required fields for image #${incompleteIndex + 1}`));
        openSidebar(incompleteIndex); // Open sidebar to show the incomplete file
        return;
      }
    } else {
      // For drafts just check that title exists
      const incompleteIndex = files.findIndex(file => !file.title.trim());
      if (incompleteIndex >= 0) {
        dispatch(setError(`Please provide at least a title for image #${incompleteIndex + 1}`));
        openSidebar(incompleteIndex); // Open sidebar to show the incomplete file
        return;
      }
    }

    try {
      dispatch(setUploading(true));
      dispatch(setError(null));
      
      // Upload each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        const formData = new FormData();
        formData.append("file", file.file);
        formData.append("title", file.title);
        formData.append("description", file.description);
        formData.append("license", file.license);
        formData.append("category", file.category);
        file.tags.forEach(tag => {
          formData.append("tags[]", tag);
        });
        
        await uploadImageToServer(formData, saveDraft);
      }
      
      // Reset form and show success message
      dispatch(clearFiles());
      if (saveDraft) {
        dispatch(setSuccess(`${files.length} image${files.length !== 1 ? 's' : ''} saved as draft! You can submit them for review later.`));
        // Redirect to drafts page after a delay
        setTimeout(() => {
          router.push('/contributor/drafts');
        }, 2000);
      } else {
        dispatch(setSuccess(`${files.length} image${files.length !== 1 ? 's' : ''} uploaded successfully! They will be reviewed by our team.`));
        // Refresh after a delay
        setTimeout(() => {
          router.refresh();
        }, 2000);
      }
      
    } catch (err: any) {
      console.error(err);
      dispatch(setError(err.message || "Failed to upload images. Please try again."));
    } finally {
      dispatch(setUploading(false));
    }
  };

  return (
    <div className="space-y-6 relative">
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
          {success}
        </div>
      )}
      
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <Upload className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-lg font-medium text-gray-700">
            Drag & drop images here, or click to select
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Support for JPEG, PNG and GIF. Max {MAX_FILE_SIZE / (1024 * 1024)}MB per file.
          </p>
        </div>
      </div>
      
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      
      {/* Image Grid */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">{files.length} image{files.length !== 1 ? 's' : ''} to upload</h3>
            
            <div className="space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => dispatch(clearFiles())}
                disabled={isUploading}
                size="sm"
              >
                Clear All
              </Button>
            </div>
          </div>
          
          {/* 6-column grid layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {files.map((file, index) => (
              <div 
                key={index} 
                className="relative group cursor-pointer rounded-lg overflow-hidden bg-white aspect-square shadow-sm border border-gray-200 hover:shadow-md transition-all flex items-center justify-center p-2"
                onClick={() => openSidebar(index)}
              >
                <img
                  src={file.preview}
                  alt={file.title || `Image ${index + 1}`}
                  className="max-h-full max-w-full object-contain"
                />
                
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(removeFile(index));
                      }}
                      className="h-8 w-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {/* Status indicator */}
                <div className="absolute bottom-0 left-0 right-0 py-1 px-2 bg-black bg-opacity-60 text-white text-xs">
                  {!file.title && <span className="text-yellow-300">❌ Missing title</span>}
                  {!file.category && <span className="text-yellow-300">{file.title ? ' | ' : ''}❌ Missing category</span>}
                  {file.title && file.category && <span className="text-green-300">✓ Ready</span>}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end mt-6 space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSubmitAll(true)}
              disabled={isUploading}
              className="min-w-[120px]"
            >
              {isUploading ? "Saving..." : "Save as Draft"}
            </Button>
            
            <Button
              type="button"
              onClick={() => handleSubmitAll(false)}
              disabled={isUploading}
              className="min-w-[150px]"
            >
              {isUploading ? "Uploading..." : "Submit for Review"}
            </Button>
          </div>
        </div>
      )}
      
      {/* Sidebar for editing image details */}
      <div 
        className={`fixed top-0 right-0 w-full md:w-[450px] lg:w-[500px] h-full bg-white shadow-xl z-50 transition-transform duration-300 transform ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } overflow-y-auto`}
        ref={sidebarRef}
      >
        {activeFileIndex !== null && files[activeFileIndex] && (
          <div className="flex flex-col h-full">
            {/* Sidebar header */}
            <div className="flex items-center justify-between p-4 border-b">
              <button 
                onClick={closeSidebar}
                className="text-gray-500 hover:text-gray-700 flex items-center"
              >
                <ChevronLeft className="h-5 w-5 mr-1" />
                <span>Back</span>
              </button>
              <h3 className="text-lg font-medium">Edit Image Details</h3>
              <div className="w-8"></div> {/* Spacer for centering */}
            </div>
            
            {/* Image preview */}
            <div className="p-4 bg-gray-50">
              <div className="aspect-video relative rounded-lg overflow-hidden bg-white flex items-center justify-center">
                <img
                  src={files[activeFileIndex].preview}
                  alt="Preview"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
            
            {/* Form fields */}
            <div className="flex-1 p-4 space-y-6 overflow-y-auto">
              <div>
                <Label htmlFor="sidebar-title" className="text-gray-700">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="sidebar-title"
                  value={files[activeFileIndex].title}
                  onChange={(e) =>
                    dispatch(updateFile({
                      index: activeFileIndex,
                      data: { title: e.target.value }
                    }))
                  }
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
                  value={files[activeFileIndex].description}
                  onChange={(e) =>
                    dispatch(updateFile({
                      index: activeFileIndex,
                      data: { description: e.target.value }
                    }))
                  }
                  placeholder="Describe your image"
                  rows={3}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="sidebar-category" className="text-gray-700">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={files[activeFileIndex].category}
                  onValueChange={(value) =>
                    dispatch(updateFile({
                      index: activeFileIndex,
                      data: { category: value }
                    }))
                  }
                >
                  <SelectTrigger id="sidebar-category" className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
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
                  value={files[activeFileIndex].license}
                  onValueChange={(value) =>
                    dispatch(updateFile({
                      index: activeFileIndex,
                      data: { license: value }
                    }))
                  }
                >
                  <SelectTrigger id="sidebar-license" className="mt-1">
                    <SelectValue placeholder="Select license" />
                  </SelectTrigger>
                  <SelectContent>
                    {LICENSE_OPTIONS.map((license) => (
                      <SelectItem key={license.value} value={license.value}>
                        {license.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-gray-700">Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2 min-h-[40px] p-2 border rounded-md border-gray-200">
                  {files[activeFileIndex].tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} className="gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200">
                      {tag}
                      <button 
                        type="button"
                        onClick={() => handleRemoveTag(activeFileIndex, tagIndex)}
                        className="ml-1 text-blue-700 hover:text-blue-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex mt-2">
                  <Input
                    placeholder="Add a tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag(activeFileIndex);
                      }
                    }}
                    className="mr-2"
                  />
                  <Button 
                    type="button" 
                    onClick={() => handleAddTag(activeFileIndex)}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="p-4 border-t">
              <Button
                type="button"
                onClick={closeSidebar}
                className="w-full"
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 