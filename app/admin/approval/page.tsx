import { db } from "@/lib/prisma";
import { AdminApprovalList } from "@/components/admin/AdminApprovalList";

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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Content Approval</h1>
        <p className="mt-1 text-sm text-gray-500">
          Review and approve contributor submissions
        </p>
      </div>

      <AdminApprovalList items={pendingItems} />
    </div>
  );
} 