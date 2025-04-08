import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Eye } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

// Type definitions
interface UserInfo {
  name: string | null;
  image: string | null;
}

interface ApprovedItem {
  id: string;
  title: string;
  imageUrl: string;
  updatedAt: Date;
  user: UserInfo;
}

interface AdminRecentItemsProps {
  items: ApprovedItem[];
}

export const AdminRecentItems = ({ items }: AdminRecentItemsProps) => {
  if (items.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm h-full">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recently Approved</h2>
        <div className="text-center py-12">
          <div className="text-gray-500">No approved items yet</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Recently Approved</h2>
        <Link href="/admin/content" className="text-sm text-blue-600 flex items-center">
          View all <ExternalLink className="ml-1 w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.id} className="border rounded-lg overflow-hidden flex flex-col">
            <div className="relative pt-[70%]">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-end p-2">
                <Link 
                  href={`/admin/content/${item.id}`}
                  className="bg-white p-2 rounded-full shadow-lg text-gray-800 hover:text-blue-600 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            <div className="p-3 flex justify-between items-center">
              <div>
                <h3 className="font-medium text-sm text-gray-900 line-clamp-1">{item.title}</h3>
                <div className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true })}
                </div>
              </div>
              <Avatar className="h-6 w-6">
                <AvatarImage src={item.user.image || ""} alt={item.user.name || "User"} />
                <AvatarFallback>{item.user.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 