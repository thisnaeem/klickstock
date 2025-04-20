import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { db } from "@/lib/prisma";
import { RoleUpdateButton } from "@/components/sadmin/RoleUpdateButton";
import { ShieldCheck } from "lucide-react";

export default async function AdminsPage() {
  // Fetch users with role ADMIN
  const admins = await db.user.findMany({
    where: {
      role: "ADMIN"
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
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage administrators and their roles
          </p>
        </div>
        <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full flex items-center">
          <ShieldCheck className="h-4 w-4 mr-2" />
          <span>{admins.length} Admins</span>
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">Admin</th>
                <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">Joined</th>
                <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">Contributions</th>
                <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                        {admin.image ? (
                          <Image
                            src={admin.image}
                            alt={admin.name || "Admin"}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-200">
                            {(admin.name || admin.email)[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">
                          {admin.name || "No name"}
                        </div>
                        <div className="text-xs text-purple-600 font-medium mt-0.5">
                          Administrator
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{admin.email}</div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(admin.createdAt), { addSuffix: true })}
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700">
                      {admin._count.contributorItems} Uploads
                    </span>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-right">
                    <RoleUpdateButton 
                      userId={admin.id} 
                      currentRole={admin.role} 
                      userName={admin.name || admin.email}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {admins.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No admins found
          </div>
        )}
      </div>
    </div>
  );
} 