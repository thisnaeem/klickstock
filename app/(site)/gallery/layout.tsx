import { Footer } from "@/components/site/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery - KlickStock",
  description: "Browse high-quality stock images for your projects",
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <main className="flex-grow">
        {children}
      </main>
      
    </div>
  );
} 