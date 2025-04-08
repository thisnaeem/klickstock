import { auth } from "@/auth";
import { SettingsForm } from "@/components/contributor/SettingsForm";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your contributor account preferences
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <SettingsForm user={session.user} />
      </div>
    </div>
  );
} 