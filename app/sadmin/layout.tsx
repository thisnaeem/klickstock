import { notFound } from "next/navigation";
import { auth } from "@/auth";
import Sidebar from "@/components/sadmin/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Only allow super admins
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    return notFound();
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
