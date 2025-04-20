import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { db } from "@/lib/prisma";
import { RoleUpdateButton } from "@/components/sadmin/RoleUpdateButton";
import { UserPlus } from "lucide-react";

export default async function UsersPage() {
  // Fetch users with role USER
  const users = await db.user.findMany({
    where: {
      role: "USER"
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
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage regular users and their roles
          </p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full flex items-center">
          <UserPlus className="h-4 w-4 mr-2" />
          <span>{users.length} Users</span>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">User</th>
                <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">Joined</th>
                <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">Uploads</th>
                <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name || "User"}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-200">
                            {(user.name || user.email)[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">
                          {user.name || "No name"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {user._count.contributorItems}
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-right">
                    <RoleUpdateButton 
                      userId={user.id} 
                      currentRole={user.role} 
                      userName={user.name || user.email}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {users.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No users found
          </div>
        )}
      </div>
    </div>
  );
} 