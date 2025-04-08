import { auth } from "@/auth";
import { UploadForm } from "@/components/contributor/UploadForm";

export default async function UploadPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Submit New Content</h1>
        <p className="mt-1 text-sm text-gray-500">
          Upload your images to be reviewed by our team
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <UploadForm />
      </div>
    </div>
  );
} 