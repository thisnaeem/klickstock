import { db } from "@/lib/prisma";
import { Users, UserCog, ShieldCheck, Package } from "lucide-react";

export default async function SuperAdminDashboard() {
  // Fetch user counts
  const userCount = await db.user.count({
    where: { role: "USER" }
  });

  const contributorCount = await db.user.count({
    where: { role: "CONTRIBUTOR" }
  });

  const adminCount = await db.user.count({
    where: { role: "ADMIN" }
  });

  // Fetch content stats
  const contentStats = await db.contributorItem.groupBy({
    by: ['status'],
    _count: {
      _all: true
    }
  });

  // Parse the stats
  const pendingCount = contentStats.find(stat => stat.status === "PENDING")?._count._all || 0;
  const approvedCount = contentStats.find(stat => stat.status === "APPROVED")?._count._all || 0;
  const rejectedCount = contentStats.find(stat => stat.status === "REJECTED")?._count._all || 0;
  const draftCount = contentStats.find(stat => stat.status === "DRAFT")?._count._all || 0;
  const totalItems = pendingCount + approvedCount + rejectedCount + draftCount;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your platform and user management
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* User Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-700">Users</h2>
              <p className="text-2xl font-bold text-gray-900">{userCount}</p>
            </div>
          </div>
        </div>

        {/* Contributor Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <UserCog className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-700">Contributors</h2>
              <p className="text-2xl font-bold text-gray-900">{contributorCount}</p>
            </div>
          </div>
        </div>

        {/* Admin Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-700">Admins</h2>
              <p className="text-2xl font-bold text-gray-900">{adminCount}</p>
            </div>
          </div>
        </div>

        {/* Content Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <Package className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-700">Total Content</h2>
              <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Status */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Content Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-700">Pending Review</p>
            <p className="text-2xl font-bold text-blue-900">{pendingCount}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-700">Approved</p>
            <p className="text-2xl font-bold text-green-900">{approvedCount}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-sm text-red-700">Rejected</p>
            <p className="text-2xl font-bold text-red-900">{rejectedCount}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700">Drafts</p>
            <p className="text-2xl font-bold text-gray-900">{draftCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
