import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { categoryOptions } from "@/lib/constants";

interface DraftEditSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  draft: {
    id: string;
    title: string;
    description: string;
    category: string;
    tags: string[];
  } | null;
  onUpdate: (id: string, data: {
    title: string;
    description: string;
    category: string;
    tags: string[];
  }) => Promise<void>;
}

export function DraftEditSidebar({ isOpen, onClose, draft, onUpdate }: DraftEditSidebarProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: ""
  });

  // Update form data when draft changes
  useEffect(() => {
    if (draft) {
      setFormData({
        title: draft.title || "",
        description: draft.description || "",
        category: draft.category || "",
        tags: draft.tags ? draft.tags.join(", ") : ""
      });
    }
  }, [draft]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    
    try {
      setIsLoading(true);
      await onUpdate(draft.id, {
        ...formData,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(Boolean)
      });
      toast.success("Draft updated successfully");
      onClose();
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to update draft");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm">
      <div 
        className="absolute right-0 top-0 h-full w-[400px] bg-gray-950 border-l border-gray-800/50 shadow-xl transition-all"
        style={{ animation: "slideIn 0.3s ease-out" }}
      >
        <div className="flex items-center justify-between border-b border-gray-800/50 p-4">
          <h3 className="text-lg font-semibold text-white">Edit Draft</h3>
          <button 
            onClick={onClose} 
            className="h-8 w-8 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-md flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(100vh-64px)]">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-300">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter a title"
              required
              className="bg-gray-800 border-gray-700 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-300">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter a description"
              required
              className="bg-gray-800 border-gray-700 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-gray-300">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger 
                id="category"
                className="bg-gray-800 border-gray-700 text-gray-200"
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border border-gray-700 text-gray-200">
                {categoryOptions.map((category: { value: string; label: string }) => (
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

          <div className="space-y-2">
            <Label htmlFor="tags" className="text-gray-300">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Enter tags separated by commas"
              className="bg-gray-800 border-gray-700 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              Enter keywords separated by commas
            </p>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={isLoading || !draft}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
      
      <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
} 