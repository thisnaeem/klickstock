import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Sidebar } from "@/components/contributor/Sidebar";
import { hasContributorAccess } from "@/lib/permissions";

export default async function ContributorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const hasAccess = await hasContributorAccess();

  if (!session?.user) {
    return redirect("/login?callbackUrl=/contributor");
  }

  // Check if user has appropriate role
  if (!hasAccess) {
    return redirect("/?error=You+do+not+have+contributor+access");
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
