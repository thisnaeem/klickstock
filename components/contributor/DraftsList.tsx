"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { submitDraftForReview, deleteDraft, updateDraft } from "@/actions/contributor";
import { DraftEditSidebar } from "./DraftEditSidebar";

interface DraftsListProps {
  items: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    createdAt: Date;
    tags: string[];
    category: string;
  }[];
}

export function DraftsList({ items }: DraftsListProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedDraft, setSelectedDraft] = useState<DraftsListProps["items"][0] | null>(null);

  const handleSubmit = async (id: string) => {
    try {
      setLoadingId(id);
      await submitDraftForReview(id);
      toast.success("Draft submitted for review successfully");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit draft for review");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteDraft(id);
      toast.success("Draft deleted successfully");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete draft");
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdateDraft = async (id: string, data: {
    title: string;
    description: string;
    category: string;
    tags: string[];
  }) => {
    await updateDraft(id, data);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Your Drafts</h2>
        <Link 
          href="/contributor/upload" 
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors"
        >
          Upload New
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="bg-gray-800/50 border border-gray-700/50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all"
          >
            <div 
              className="relative aspect-square cursor-pointer group"
              onClick={() => setSelectedDraft(item)}
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
              <div className="absolute top-2 right-2 flex space-x-2">
                <button 
                  className="p-2 bg-gray-900/80 rounded-full shadow hover:bg-gray-800 text-indigo-400 transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDraft(item);
                  }}
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="p-2 flex justify-center">
              <button 
                className="w-full py-1.5 bg-indigo-600 text-white text-xs rounded-md font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={loadingId === item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubmit(item.id);
                }}
              >
                {loadingId === item.id ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <DraftEditSidebar
        isOpen={!!selectedDraft}
        onClose={() => setSelectedDraft(null)}
        draft={selectedDraft}
        onUpdate={handleUpdateDraft}
      />
    </>
  );
} 