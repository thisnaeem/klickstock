"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { submitDraftForReview, deleteDraft } from "@/actions/contributor";

interface DraftsListProps {
  items: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    createdAt: Date;
    tags: string[];
    categories: string[];
  }[];
}

export function DraftsList({ items }: DraftsListProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Your Drafts</h2>
        <Link 
          href="/contributor/upload" 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Upload New
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 border rounded-xl bg-gray-50">
          <div className="text-gray-500">No draft content</div>
          <p className="text-sm text-gray-400 mt-2 mb-4">Any content you upload but don't submit will appear here</p>
          <Link 
            href="/contributor/upload" 
            className="mt-3 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Upload new content
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative aspect-square">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-0 right-0 p-2 flex space-x-2">
                  <Link href={`/contributor/edit/${item.id}`} className="p-2 bg-white rounded-full shadow hover:bg-gray-100">
                    <PencilIcon className="w-4 h-4 text-blue-600" />
                  </Link>
                  <button 
                    className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
                    disabled={deletingId === item.id}
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this draft?")) {
                        handleDelete(item.id);
                      }
                    }}
                  >
                    <TrashIcon className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-1">{item.title}</h3>
                <p className="text-gray-500 text-sm mb-3 line-clamp-2">{item.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                  {item.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      +{item.tags.length - 3}
                    </span>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                  </div>
                  <button 
                    className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={loadingId === item.id}
                    onClick={() => handleSubmit(item.id)}
                  >
                    {loadingId === item.id ? "Submitting..." : "Submit for Review"}
                  </button>
                </div>
                {item.categories.length === 0 && (
                  <p className="text-xs text-yellow-600 mt-2">
                    Please add categories before submitting for review
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
} 