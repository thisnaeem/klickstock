import { db } from "@/lib/prisma";
import { AdminApprovalList } from "@/components/admin/AdminApprovalList";
import { Clock } from "lucide-react";

export default async function AdminApprovalPage() {
  // Get all pending items
  const pendingItems = await db.contributorItem.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      title: true,
      description: true,
      imageUrl: true,
      createdAt: true,
      tags: true,
      category: true,
      license: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      }
    }
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <div className="mr-4 p-3 bg-yellow-500/10 rounded-xl">
          <Clock className="h-8 w-8 text-yellow-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Content Approval</h1>
          <p className="mt-1 text-gray-400">
            Review and approve {pendingItems.length} pending submissions
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl border border-gray-700/50">
        <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/5 rounded-full translate-x-1/4 -translate-y-1/4 blur-3xl"></div>
        <AdminApprovalList items={pendingItems} />
      </div>
    </div>
  );
} 