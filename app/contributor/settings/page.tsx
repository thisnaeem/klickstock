import { auth } from "@/auth";
import { SettingsForm } from "@/components/contributor/SettingsForm";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return (
    <div className="space-y-6 min-h-screen pb-10">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-purple-900/40 p-6 rounded-lg shadow-lg mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Account Settings</h1>
        <p className="text-gray-300">
          Manage your contributor account preferences
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-gray-900/50 border border-gray-800/40 p-6 rounded-lg shadow-lg">
        <SettingsForm user={session.user} />
      </div>
    </div>
  );
} 