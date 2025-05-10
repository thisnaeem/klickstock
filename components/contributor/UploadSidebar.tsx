import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { 
  X, Plus, Sparkles, Check, ChevronLeft, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { updateFile, removeFile } from "@/redux/features/uploadSlice";
import { 
  categoryOptions,
  licenseOptions,
  imageTypeOptions
} from "@/lib/constants";

// License options
const LICENSE_OPTIONS = licenseOptions;

// Image type options
const IMAGE_TYPE_OPTIONS = imageTypeOptions;

// AI Generation options
// const AI_GENERATION_OPTIONS = aiGenerationOptions;

// Category options (replace with your actual categories)
const CATEGORY_OPTIONS = categoryOptions;

type UploadSidebarProps = {
  files: any[];
  activeFileIndex: number | null;
  setActiveFileIndex: (index: number | null) => void;
  newTag: string;
  setNewTag: (tag: string) => void;
  handleAddTag: (index: number) => void;
  handleRemoveTag: (fileIndex: number, tagIndex: number) => void;
  handleRemoveFile: (index: number) => void;
  selectedFiles: number[];
  isGenerating: boolean;
  isGeneratingBulk: boolean;
  generateContentWithAI: () => void;
  generateContentWithAIForAll: () => void;
  isUploading: boolean;
  transparentImages: { [key: number]: boolean };
  handleSubmitAll: (saveDraft: boolean) => void;
  isFileComplete: (file: any) => boolean;
};

export function UploadSidebar({
  files,
  activeFileIndex,
  setActiveFileIndex,
  newTag,
  setNewTag,
  handleAddTag,
  handleRemoveTag,
  handleRemoveFile,
  selectedFiles,
  isGenerating,
  isGeneratingBulk,
  generateContentWithAI,
  generateContentWithAIForAll,
  isUploading,
  transparentImages,
  handleSubmitAll,
  isFileComplete
}: UploadSidebarProps) {
  const dispatch = useDispatch();

  if (activeFileIndex === null || !files[activeFileIndex]) {
    return null;
  }

  return (
    <div className="absolute top-0 right-0 bottom-0 w-[400px] bg-gray-950 border-l border-gray-800/50 overflow-hidden z-50 flex flex-col h-screen shadow-xl max-h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800/50">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveFileIndex(null)}
            className="p-2 rounded-full bg-gray-800/70 text-gray-300 hover:bg-gray-700"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h3 className="text-lg font-medium text-white">
            {selectedFiles.length > 1 
              ? `Edit ${selectedFiles.length} Images` 
              : 'Edit Image Details'}
          </h3>
        </div>
        <button
          type="button"
          onClick={() => {
            if (confirm('Are you sure you want to delete this image?')) {
              handleRemoveFile(activeFileIndex);
            }
          }}
          className="h-10 w-10 bg-red-600/20 hover:bg-red-600/40 text-red-400 hover:text-red-300 rounded-lg flex items-center justify-center transition-all duration-200"
          aria-label="Delete image"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    
      {/* Scrollable content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Image preview and AI button section */}
        <div className="p-4 bg-gray-900/30 border-b border-gray-800/50">
          <div 
            className="relative h-48 rounded-lg overflow-hidden bg-gray-900 cursor-pointer group border border-gray-700/50 hover:border-gray-600 transition-colors"
          >
            {files[activeFileIndex].imageType === 'PNG' && 
              transparentImages[activeFileIndex] && (
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
              src={files[activeFileIndex].preview}
              alt={files[activeFileIndex].title || 
                `Image ${activeFileIndex + 1}`}
              className="w-full h-full object-cover select-none pointer-events-none"
              style={{ position: 'relative', zIndex: 1, userSelect: 'none', WebkitUserSelect: 'none' }}
              draggable="false"
            />
          </div>

          {selectedFiles.length > 1 ? (
            <Button
              type="button"
              onClick={() => generateContentWithAIForAll()}
              disabled={isGeneratingBulk || isGenerating}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 py-5 mt-4"
            >
              <Sparkles className="h-5 w-5" />
              <span>
                {isGeneratingBulk 
                  ? `Generating for ${selectedFiles.length} images...` 
                  : `Generate AI for all ${selectedFiles.length} images`}
              </span>
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => generateContentWithAI()}
              disabled={isGenerating || isGeneratingBulk}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 py-5 mt-4"
            >
              <Sparkles className="h-5 w-5" />
              <span>{isGenerating ? "Generating..." : "Generate with AI"}</span>
            </Button>
          )}
        </div>
      
        {/* Form fields - make this scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          <div>
            <Label htmlFor="sidebar-title" className="text-gray-300 flex items-center">
              Title <span className="text-red-400 ml-1">*</span>
            </Label>
            <Input
              id="sidebar-title"
              value={files[activeFileIndex].title}
              onChange={(e) => {
                dispatch(updateFile({
                  index: activeFileIndex,
                  data: { title: e.target.value }
                }));
              }}
              placeholder="Enter image title"
              required
              className="mt-1 bg-gray-800 border-gray-700 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <Label htmlFor="sidebar-description" className="text-gray-300">
              Description
            </Label>
            <Textarea
              id="sidebar-description"
              value={files[activeFileIndex].description}
              onChange={(e) => {
                dispatch(updateFile({
                  index: activeFileIndex,
                  data: { description: e.target.value }
                }));
              }}
              placeholder="Describe your image"
              rows={2}
              className="mt-1 bg-gray-800 border-gray-700 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sidebar-category" className="text-gray-300 flex items-center">
                Category <span className="text-red-400 ml-1">*</span>
              </Label>
              <Select
                value={files[activeFileIndex].category}
                onValueChange={(value) => {
                  dispatch(updateFile({
                    index: activeFileIndex,
                    data: { category: value }
                  }));
                }}
              >
                <SelectTrigger 
                  id="sidebar-category" 
                  className="mt-1 bg-gray-800 border-gray-700 text-gray-200"
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border border-gray-700 text-gray-200">
                  {CATEGORY_OPTIONS.map((category) => (
                    <SelectItem 
                      key={category.value} 
                      value={category.value}
                      className="text-gray-200 hover:bg-gray-700 focus:bg-gray-700"
                    >
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="sidebar-license" className="text-gray-300 flex items-center">
                License
              </Label>
              <Select
                value={files[activeFileIndex].license}
                onValueChange={(value) => {
                  dispatch(updateFile({
                    index: activeFileIndex,
                    data: { license: value }
                  }));
                }}
              >
                <SelectTrigger 
                  id="sidebar-license" 
                  className="mt-1 bg-gray-800 border-gray-700 text-gray-200"
                >
                  <SelectValue placeholder="Select license" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border border-gray-700 text-gray-200">
                  {LICENSE_OPTIONS.map((license) => (
                    <SelectItem 
                      key={license.value} 
                      value={license.value}
                      className="text-gray-200 hover:bg-gray-700 focus:bg-gray-700"
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
              <Label htmlFor="sidebar-image-type" className="text-gray-300 flex items-center">
                Image Type <span className="text-red-400 ml-1">*</span>
              </Label>
              <Select
                value={files[activeFileIndex].imageType}
                onValueChange={(value) => {
                  dispatch(updateFile({
                    index: activeFileIndex,
                    data: { imageType: value }
                  }));
                }}
              >
                <SelectTrigger 
                  id="sidebar-image-type" 
                  className="mt-1 bg-gray-800 border-gray-700 text-gray-200"
                >
                  <SelectValue placeholder="Select image type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border border-gray-700 text-gray-200">
                  {IMAGE_TYPE_OPTIONS.map((type) => (
                    <SelectItem 
                      key={type.value} 
                      value={type.value}
                      className="text-gray-200 hover:bg-gray-700 focus:bg-gray-700"
                    >
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sidebar-ai-status" className="text-gray-300 flex items-center">
                  AI Generated <span className="text-red-400 ml-1">*</span>
                </Label>
                <Switch
                  id="sidebar-ai-status"
                  checked={files[activeFileIndex].aiGeneratedStatus === 'AI_GENERATED'}
                  onCheckedChange={(checked: boolean) => {
                    const newStatus = checked ? 'AI_GENERATED' : 'NOT_AI_GENERATED';
                    dispatch(updateFile({
                      index: activeFileIndex,
                      data: { aiGeneratedStatus: newStatus }
                    }));
                  }}
                  className="mt-1"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {files[activeFileIndex].aiGeneratedStatus === 'AI_GENERATED' 
                  ? "This image was created with AI" 
                  : "This image was not created with AI"}
              </p>
            </div>
          </div>
          
          <div>
            <Label className="text-gray-300 flex justify-between items-center">
              <span>Keywords</span>
              <span className="text-xs text-gray-500">{files[activeFileIndex].tags.length}/50 max</span>
            </Label>
            <div className="flex flex-wrap gap-2 mt-2 min-h-[40px] p-2 border rounded-md border-gray-700">
              {files[activeFileIndex].tags.map((tag: string, tagIndex: number) => (
                <Badge key={tagIndex} className="gap-1 bg-indigo-900/60 text-indigo-300 hover:bg-indigo-800/60 border border-indigo-800">
                  {tag}
                  <button 
                    type="button"
                    onClick={() => handleRemoveTag(activeFileIndex, tagIndex)}
                    className="ml-1 text-indigo-300 hover:text-indigo-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex mt-2 gap-3">
              <Input
                placeholder="Add keywords (comma separated)"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag(activeFileIndex);
                  }
                }}
                className="bg-gray-800 border-gray-700 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 h-10"
              />
              <Button 
                type="button" 
                onClick={() => handleAddTag(activeFileIndex)}
                className="bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700 hover:text-white h-10 px-4 flex items-center justify-center"
              >
                <Plus className="h-4 w-4 mr-2" /> Add
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Enter keywords separated by commas. Maximum 50 keywords allowed.
            </p>
          </div>
        </div>
        
        {/* Submit buttons - fixed at bottom */}
        <div className=" bottom-0 left-0 right-0 p-4 bg-gray-950 border-t border-gray-800/50 flex gap-3">
          <Button
            type="button"
            onClick={() => handleSubmitAll(true)}
            disabled={isUploading}
            className="flex-1 border border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
          >
            Save as Draft
          </Button>
          <Button
            type="button"
            onClick={() => handleSubmitAll(false)}
            disabled={isUploading || !isFileComplete(files[activeFileIndex])}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>
    </div>
  );
} 