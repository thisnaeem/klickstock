import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Check if user is admin
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex h-screen bg-gray-950 overflow-x-hidden">
      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0">
        <AdminSidebar />
      </div>
      
      {/* Mobile sidebar - rendering outside normal document flow */}
      <div className="lg:hidden">
        <AdminSidebar />
      </div>
      
      {/* Main content */}
      <main className="flex-1 w-full lg:pl-72">
        <div className="py-6 px-3 sm:px-4 md:px-6 lg:px-8 pt-16 lg:pt-6 max-w-full h-full">
          {children}
        </div>
      </main>
    </div>
  );
} 