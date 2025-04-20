import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { db } from "@/lib/prisma";
import { RoleUpdateButton } from "@/components/sadmin/RoleUpdateButton";
import { UserCog } from "lucide-react";

export default async function ContributorsPage() {
  // Fetch users with role CONTRIBUTOR
  const contributors = await db.user.findMany({
    where: {
      role: "CONTRIBUTOR"
    },
    orderBy: {
      createdAt: "desc"
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      role: true,
      _count: {
        select: {
          contributorItems: true
        }
      },
      contributorItems: {
        select: {
          status: true
        }
      }
    }
  });

  // Process contributor statistics
  const contributorsWithStats = contributors.map(contributor => {
    const totalUploads = contributor._count.contributorItems;
    const approvedCount = contributor.contributorItems.filter(item => item.status === "APPROVED").length;
    const pendingCount = contributor.contributorItems.filter(item => item.status === "PENDING").length;
    const rejectedCount = contributor.contributorItems.filter(item => item.status === "REJECTED").length;
    
    return {
      ...contributor,
      totalUploads,
      approvedCount,
      pendingCount,
      rejectedCount,
      approvalRate: totalUploads > 0 ? Math.round((approvedCount / totalUploads) * 100) : 0
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contributor Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage content contributors and their roles
          </p>
        </div>
        <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full flex items-center">
          <UserCog className="h-4 w-4 mr-2" />
          <span>{contributors.length} Contributors</span>
        </div>
      </div>

      {/* Contributors Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">Contributor</th>
                <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">Joined</th>
                <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">Total Uploads</th>
                <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">Approval Rate</th>
                <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {contributorsWithStats.map((contributor) => (
                <tr key={contributor.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                        {contributor.image ? (
                          <Image
                            src={contributor.image}
                            alt={contributor.name || "Contributor"}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-200">
                            {(contributor.name || contributor.email)[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">
                          {contributor.name || "No name"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{contributor.email}</div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(contributor.createdAt), { addSuffix: true })}
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700">
                        {contributor.totalUploads} Total
                      </span>
                      <div className="text-xs text-gray-500 space-x-1">
                        <span className="text-green-600">{contributor.approvedCount} Approved</span>
                        <span>•</span>
                        <span className="text-yellow-600">{contributor.pendingCount} Pending</span>
                        <span>•</span>
                        <span className="text-red-600">{contributor.rejectedCount} Rejected</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    {contributor.totalUploads > 0 ? (
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            contributor.approvalRate > 70 ? 'bg-green-600' : 
                            contributor.approvalRate > 40 ? 'bg-yellow-500' : 'bg-red-600'
                          }`}
                          style={{ width: `${contributor.approvalRate}%` }}
                        ></div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">No uploads yet</span>
                    )}
                    {contributor.totalUploads > 0 && (
                      <span className="text-xs text-gray-500 mt-1 block">
                        {contributor.approvalRate}% Approved
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-right">
                    <RoleUpdateButton 
                      userId={contributor.id} 
                      currentRole={contributor.role} 
                      userName={contributor.name || contributor.email}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {contributors.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No contributors found
          </div>
        )}
      </div>
    </div>
  );
} 